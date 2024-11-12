import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the auth token
    const tokenData = JSON.parse(authToken.value);
    if (!tokenData.email) {
      return new NextResponse("Invalid token", { status: 401 });
    }

    // Fetch all applications with related job and user data
    const applications = await db.jobApplication.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            description: true,
            requirements: true,
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
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Transform the data to include postedAgo
    const transformedApplications = applications.map((app) => {
      const postedDate = new Date(app.job.postedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - postedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: app.id,
        jobId: app.job.id,
        applicantId: app.applicant.id,
        resumeURL: app.resumeURL,
        coverLetterURL: app.coverLetterURL,
        linkedInURL: app.linkedInURL,
        additionalDocumentsR2URL: app.additionalDocumentsR2URL,
        applicationStatus: app.applicationStatus || "Under Review",
        submittedAt: app.submittedAt.toISOString(),
        lastUpdated: app.lastUpdated.toISOString(),
        notes: app.notes,
        job: {
          id: app.job.id,
          title: app.job.title,
          company: app.job.company,
          description: app.job.description,
          salaryRange: app.job.salaryRange,
          listingType: app.job.listingType,
          workArrangement: app.job.workArrangement,
          postedAgo: `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`,
        },
        applicant: {
          id: app.applicant.id,
          email: app.applicant.email,
          profile: app.applicant.profile,
        },
      };
    });

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error("[GET_APPLICATIONS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify the auth token
    const tokenData = JSON.parse(authToken.value);
    if (!tokenData.email) {
      return new NextResponse("Invalid token", { status: 401 });
    }

    const body = await request.json();
    const { id, applicationStatus } = body;

    if (!id || !applicationStatus) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update the application status
    const updatedApplication = await db.jobApplication.update({
      where: {
        id: id,
      },
      data: {
        applicationStatus: applicationStatus,
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

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("[UPDATE_APPLICATION]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
