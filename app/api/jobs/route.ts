import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ListingType, WorkArrangement } from "@prisma/client";
import { cookies } from "next/headers";

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "today";
  }
  if (diffInDays === 1) {
    return "yesterday";
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  }
  return `${Math.floor(diffInDays / 30)} months ago`;
}

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

function mapJobTypeToListingType(type: string): ListingType {
  const map: Record<string, ListingType> = {
    job: "Job",
    internship: "Internship",
  };
  return map[type] || "Job";
}

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
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const whereClause =
      type && type !== "all" ? { listingType: mapJobTypeToListingType(type) } : {};

    const jobListings = await db.jobListing.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        postedAt: "desc",
      },
      include: {
        requiredSkills: true, // Include the related skills
      },
    });

    // Transform the data to match the frontend interface
    const jobs = jobListings.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      salary: job.salaryRange || "Salary not specified",
      location: job.location,
      postedAgo: formatTimeAgo(job.postedAt),
      workMode: mapWorkArrangementToWorkMode(job.workArrangement),
      type: job.listingType.toLowerCase() as "job" | "internship",
      jobType: job.jobType,
      applicationDeadline: job.applicationDeadline?.toISOString(),
      startDate: job.startDate?.toISOString(),
      duration: job.duration,
      isInternshipPaid: job.isInternshipPaid,
      requiredSkills: job.requiredSkills.map((skill) => skill.skillName),
    }));

    return NextResponse.json(jobs);
  } catch (error: unknown) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
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
