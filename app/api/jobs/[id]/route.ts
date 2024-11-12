import { db } from "@/lib/db";
import { NextResponse } from "next/server";
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

// Updated GET handler to exactly match the academic events API structure
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const job = await db.jobListing.findUnique({
      where: {
        id: params.id,
      },
      include: {
        requiredSkills: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Transform the job data to match the frontend format
    const formattedJob = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      type: job.listingType.toLowerCase(),
      jobType: job.jobType,
      workMode:
        job.workArrangement === "On_site"
          ? "onsite"
          : job.workArrangement === "Remote"
            ? "remote"
            : "hybrid",
      salary: job.salaryRange,
      applicationDeadline: job.applicationDeadline,
      startDate: job.startDate,
      duration: job.duration,
      isInternshipPaid: job.isInternshipPaid,
      status: job.status,
      requiredSkills: job.requiredSkills.map((skill) => skill.skillName),
    };

    return NextResponse.json(formattedJob);
  } catch (error) {
    console.error("[JOB_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Updated PUT handler to match the event API structure
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
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
      status,
    } = body;

    // Map workMode to WorkArrangement enum
    const workModeMap = {
      onsite: "On_site",
      remote: "Remote",
      hybrid: "Hybrid",
    } as const;

    const workArrangement = workModeMap[workMode as keyof typeof workModeMap];
    if (!workArrangement) {
      return new NextResponse(JSON.stringify({ error: "Invalid work mode" }), { status: 400 });
    }

    // Convert type to ListingType enum
    const listingType = type === "job" ? "Job" : "Internship";

    // First, delete existing required skills
    await db.requiredSkill.deleteMany({
      where: {
        jobId: params.id,
      },
    });

    // Update the job listing
    const updatedJob = await db.jobListing.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        company,
        location: workArrangement === "On_site" ? location : null,
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
        status,
        requiredSkills: {
          create: requiredSkills
            .split(",")
            .map((skill: string) => ({
              skillName: skill.trim(),
            }))
            .filter((skill: { skillName: string }) => skill.skillName !== ""),
        },
      },
      include: {
        requiredSkills: true,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("[JOB_PUT]", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First delete all required skills associated with the job
    await db.requiredSkill.deleteMany({
      where: {
        jobId: params.id,
      },
    });

    // Then delete all job applications associated with the job
    await db.jobApplication.deleteMany({
      where: {
        jobId: params.id,
      },
    });

    // Then delete all saved jobs associated with the job
    await db.savedJob.deleteMany({
      where: {
        jobId: params.id,
      },
    });

    // Finally delete the job listing
    await db.jobListing.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[JOB_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
