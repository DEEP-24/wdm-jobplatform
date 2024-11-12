import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, company, expertise, bio, imageUrl, yearsOfExperience, maxMentees } = body;

    // Update user role to MENTOR
    await db.user.update({
      where: { id: user.id },
      data: { role: "MENTOR" },
    });

    // Create mentor profile
    const mentorProfile = await db.mentorProfile.create({
      data: {
        userId: user.id,
        expertise,
        yearsOfExperience,
        maxMentees,
      },
    });

    // Update user profile
    await db.profile.update({
      where: { userId: user.id },
      data: {
        title,
        company,
        bio,
        imageUrl,
      },
    });

    return NextResponse.json(mentorProfile);
  } catch (error) {
    console.error("[MENTORS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mentors = await db.mentorProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                title: true,
                company: true,
                bio: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the expected format
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.user.id,
      profile: mentor.user.profile,
      MentorProfile: {
        expertise: mentor.expertise,
        yearsOfExperience: mentor.yearsOfExperience,
        maxMentees: mentor.maxMentees,
      },
    }));

    return NextResponse.json(formattedMentors);
  } catch (error) {
    console.error("[MENTORS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
