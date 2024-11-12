import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Check authentication using cookies
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);

    // Get user from database
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      mentorId,
      message,
      academicLevel,
      fieldOfStudy,
      careerGoals,
      areasOfInterest,
      expectedGraduationDate,
    } = await req.json();

    // Check if user is trying to select themselves as mentor
    if (mentorId === user.id) {
      return NextResponse.json(
        { error: "You cannot select yourself as a mentor" },
        { status: 400 },
      );
    }

    // Verify that the selected mentor exists and is actually a mentor
    const mentor = await db.user.findUnique({
      where: {
        id: mentorId,
        role: "MENTOR",
      },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Selected mentor is not valid" }, { status: 400 });
    }

    const mentorshipSession = await db.mentorshipSession.create({
      data: {
        mentorId,
        menteeId: user.id,
        message,
        academicLevel,
        fieldOfStudy,
        careerGoals,
        areasOfInterest,
        expectedGraduationDate: new Date(expectedGraduationDate),
        status: "PENDING",
      },
    });

    return NextResponse.json(mentorshipSession);
  } catch (error) {
    console.error("Error creating mentorship session:", error);
    return NextResponse.json({ error: "Failed to create mentorship session" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);

    // Get user and verify they are a mentor
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user || user.role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch applications for this mentor
    const applications = await db.mentorshipSession.findMany({
      where: {
        mentorId: user.id,
      },
      include: {
        mentee: {
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
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching mentorship sessions:", error);
    return NextResponse.json({ error: "Failed to fetch mentorship sessions" }, { status: 500 });
  }
}
