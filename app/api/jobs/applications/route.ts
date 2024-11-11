import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { ListingType, WorkArrangement } from "@prisma/client";

function mapWorkArrangementToWorkMode(
  arrangement: WorkArrangement,
): "onsite" | "remote" | "hybrid" {
  const map = {
    On_site: "onsite",
    Remote: "remote",
    Hybrid: "hybrid",
  } as const;
  return map[arrangement];
}

async function getCurrentUser() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return null;
  }

  try {
    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.jobApplication.findMany({
      where: {
        applicantId: user.id,
      },
      include: {
        job: true,
      },
    });

    const transformedApplications = applications.map((application) => ({
      id: application.id,
      jobId: application.jobId,
      userId: application.applicantId,
      name: user.email,
      email: user.email,
      resume: application.resumeURL || "",
      coverLetter: application.coverLetterURL || "",
      submittedAt: application.submittedAt.toISOString(),
      job: {
        id: application.job.id,
        title: application.job.title,
        company: application.job.company,
        description: application.job.description,
        fullDescription: application.job.description,
        salary: application.job.salaryRange || "Salary not specified",
        type: application.job.listingType.toLowerCase() as "job" | "internship",
        workMode: mapWorkArrangementToWorkMode(application.job.workArrangement),
        postedAgo: application.job.postedAt.toISOString(),
      },
    }));

    return NextResponse.json(transformedApplications);
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const application = await db.jobApplication.create({
      data: {
        jobId: data.jobId,
        applicantId: user.id,
        resumeURL: data.resumeURL,
        coverLetterURL: data.coverLetterURL,
      },
      include: {
        job: true,
      },
    });

    const transformedApplication = {
      id: application.id,
      jobId: application.jobId,
      userId: application.applicantId,
      name: user.email,
      email: user.email,
      resume: application.resumeURL || "",
      coverLetter: application.coverLetterURL || "",
      submittedAt: application.submittedAt.toISOString(),
      job: {
        id: application.job.id,
        title: application.job.title,
        company: application.job.company,
        description: application.job.description,
        fullDescription: application.job.description,
        salary: application.job.salaryRange || "Salary not specified",
        type: application.job.listingType.toLowerCase() as "job" | "internship",
        workMode: mapWorkArrangementToWorkMode(application.job.workArrangement),
        postedAgo: application.job.postedAt.toISOString(),
      },
    };

    return NextResponse.json(transformedApplication);
  } catch (error: unknown) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
