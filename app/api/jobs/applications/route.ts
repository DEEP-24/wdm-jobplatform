import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    console.log("Auth token:", authToken?.value);

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    console.log("Token data:", tokenData);

    // Get applications based on whether the user is an applicant or employer
    const applications = await db.jobApplication.findMany({
      where: {
        applicantId: tokenData.id, // Find applications where the current user is the applicant
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            description: true,
            requirements: true,
            responsibilities: true,
            salaryRange: true,
            location: true,
            listingType: true,
            workArrangement: true,
            jobType: true,
            applicationDeadline: true,
            startDate: true,
            duration: true,
            isInternshipPaid: true,
            requiredSkills: true,
            postedAt: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform the data to match the expected format
    const transformedApplications = applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      userId: app.applicantId,
      resumeURL: app.resumeURL || "",
      coverLetterURL: app.coverLetterURL || "",
      submittedAt: app.submittedAt.toISOString(),
      applicationStatus: app.applicationStatus || "Under Review",
      job: {
        id: app.job.id,
        title: app.job.title,
        company: app.job.company,
        description: app.job.description,
        requirements: app.job.requirements,
        responsibilities: app.job.responsibilities,
        salary: app.job.salaryRange || "Not specified",
        location: app.job.location,
        postedAgo: app.job.postedAt.toISOString(),
        workMode: app.job.workArrangement.toLowerCase() as "onsite" | "remote" | "hybrid",
        type: app.job.listingType.toLowerCase() as "job" | "internship",
        jobType: app.job.jobType as "Full_time" | "Part_time" | "Contract",
        applicationDeadline: app.job.applicationDeadline?.toISOString() || null,
        startDate: app.job.startDate?.toISOString() || null,
        duration: app.job.duration || null,
        isInternshipPaid: app.job.isInternshipPaid || null,
        requiredSkills: app.job.requiredSkills || [],
      },
    }));

    console.log("Raw applications:", applications);
    console.log("Transformed applications:", transformedApplications);

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
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
