import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ListingType, WorkArrangement } from "@prisma/client";

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
    });

    // Transform the data to match the frontend interface
    const jobs = jobListings.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      fullDescription: job.description,
      salary: job.salaryRange || "Salary not specified",
      postedAgo: formatTimeAgo(job.postedAt),
      workMode: mapWorkArrangementToWorkMode(job.workArrangement),
      type: job.listingType.toLowerCase() as "job" | "internship",
    }));

    return NextResponse.json(jobs);
  } catch (error: unknown) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
