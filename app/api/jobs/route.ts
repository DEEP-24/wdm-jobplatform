import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ListingType, WorkArrangement } from "@prisma/client";
import { cookies } from "next/headers";

// Helper function to get current user
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
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const jobs = await db.jobListing.findMany({
      where:
        type !== "all"
          ? {
              listingType: type?.toUpperCase() === "JOB" ? "Job" : "Internship",
            }
          : undefined,
      include: {
        requiredSkills: true,
        user: {
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
      orderBy: {
        postedAt: "desc",
      },
    });

    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      salary: job.salaryRange,
      location: job.location,
      postedAgo: job.postedAt.toISOString(),
      workMode: job.workArrangement.toLowerCase(),
      type: job.listingType.toLowerCase(),
      jobType: job.jobType,
      applicationDeadline: job.applicationDeadline?.toISOString() || null,
      startDate: job.startDate?.toISOString() || null,
      duration: job.duration,
      isInternshipPaid: job.isInternshipPaid,
      requiredSkills: job.requiredSkills,
      status: job.status,
      postedBy: {
        email: job.user.email,
        profile: job.user.profile,
      },
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      company,
      location,
      description,
      requirements,
      responsibilities,
      salary,
      workMode,
      type,
      jobType,
      applicationDeadline,
      startDate,
      duration,
      isInternshipPaid,
      requiredSkills,
    } = body;

    // Map workMode to WorkArrangement enum
    const workModeMap: Record<string, WorkArrangement> = {
      onsite: "On_site",
      remote: "Remote",
      hybrid: "Hybrid",
    };

    const workArrangement = workModeMap[workMode as string] as WorkArrangement;
    if (!workArrangement) {
      return new NextResponse("Invalid work mode", { status: 400 });
    }

    // Convert type to ListingType enum
    const listingType = type === "job" ? "Job" : "Internship";

    // Create the job listing
    const job = await db.jobListing.create({
      data: {
        title,
        company,
        location: workArrangement === "On_site" ? location : null, // Only store location if onsite
        description,
        requirements,
        responsibilities,
        salaryRange: salary,
        workArrangement,
        listingType,
        jobType,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        startDate: startDate ? new Date(startDate) : null,
        duration: type === "internship" ? duration : null,
        isInternshipPaid: type === "internship" ? isInternshipPaid : null,
        postedBy: user.id,
        // Create required skills if provided
        requiredSkills: requiredSkills
          ? {
              create: requiredSkills
                .split(",")
                .map((skill: string) => ({
                  skillName: skill.trim(),
                }))
                .filter((skill: { skillName: string }) => skill.skillName !== ""),
            }
          : undefined,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[JOBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
