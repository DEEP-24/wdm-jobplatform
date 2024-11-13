import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { expertise, yearsOfExperience, maxMentees, city, state, academicBackground, skills } =
      body;

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
        yearsOfExperience: Number(yearsOfExperience),
        maxMentees: Number(maxMentees),
      },
    });

    // Update user profile
    if (user.profile) {
      await db.profile.update({
        where: { userId: user.id },
        data: {
          city,
          state,
          academicBackground,
          skills,
        },
      });
    } else {
      await db.profile.create({
        data: {
          userId: user.id,
          firstName: "",
          lastName: "",
          phone: "",
          streetAddress: "",
          city,
          state,
          postalCode: "",
          dob: new Date(),
          academicBackground,
          skills,
        },
      });
    }

    return NextResponse.json(mentorProfile);
  } catch (error) {
    console.error("[MENTORS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mentors = await db.user.findMany({
      where: {
        role: "MENTOR",
      },
      include: {
        profile: true,
        mentorProfile: true,
      },
    });

    console.log("Found mentors:", mentors); // Debug log

    return NextResponse.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json({ error: "Failed to fetch mentors" }, { status: 500 });
  }
}
