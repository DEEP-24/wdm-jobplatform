import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const applications = await db.jobApplication.findMany({
      where: {
        applicantId: user.id,
      },
      include: {
        job: {
          include: {
            requiredSkills: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    const formattedApplications = applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      userId: app.applicantId,
      resumeURL: app.resumeURL,
      coverLetterURL: app.coverLetterURL,
      submittedAt: app.submittedAt.toISOString(),
      applicationStatus: app.applicationStatus,
      job: {
        id: app.job.id,
        title: app.job.title,
        company: app.job.company,
        description: app.job.description,
        requirements: app.job.requirements,
        responsibilities: app.job.responsibilities,
        salary: app.job.salaryRange,
        location: app.job.location,
        postedAgo: app.job.postedAt.toISOString(),
        workMode: app.job.workArrangement.toLowerCase(),
        type: app.job.listingType.toLowerCase(),
        jobType: app.job.jobType,
        applicationDeadline: app.job.applicationDeadline?.toISOString() || null,
        startDate: app.job.startDate?.toISOString() || null,
        duration: app.job.duration,
        isInternshipPaid: app.job.isInternshipPaid,
        requiredSkills: app.job.requiredSkills,
        status: app.job.status,
      },
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error("[APPLICATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, applicationStatus } = await request.json();

    const application = await db.jobApplication.update({
      where: { id },
      data: {
        applicationStatus,
        lastUpdated: new Date(),
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            description: true,
            salaryRange: true,
            listingType: true,
            workArrangement: true,
            postedAt: true,
          },
        },
        applicant: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Transform the updated application to match the frontend format
    const transformedApplication = {
      id: application.id,
      jobId: application.jobId,
      userId: application.applicantId,
      name: application.applicant.profile
        ? `${application.applicant.profile.firstName} ${application.applicant.profile.lastName}`
        : application.applicant.email,
      email: application.applicant.email,
      resume: application.resumeURL || "",
      coverLetter: application.coverLetterURL || "",
      submittedAt: application.submittedAt.toISOString(),
      status: application.applicationStatus || "Under Review",
      lastUpdated: application.lastUpdated?.toISOString() || application.submittedAt.toISOString(),
      job: {
        id: application.job.id,
        title: application.job.title,
        company: application.job.company,
        description: application.job.description,
        fullDescription: application.job.description,
        salary: application.job.salaryRange || "Not specified",
        type: application.job.listingType.toLowerCase() as "job" | "internship",
        workMode: application.job.workArrangement.toLowerCase().replace("_", "") as
          | "onsite"
          | "remote"
          | "hybrid",
        postedAgo: application.job.postedAt.toISOString(),
      },
    };

    return NextResponse.json(transformedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
