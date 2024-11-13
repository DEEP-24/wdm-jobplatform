import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);

    // Get user
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      mentorId,
      message,
      sessionDate,
      startTime,
      endTime,
      sessionType,
      academicLevel,
      fieldOfStudy,
      careerGoals,
      areasOfInterest,
      expectedGraduationDate,
    } = await req.json();

    // Basic mentor check - only verify the mentor exists and has MENTOR role
    const mentor = await db.user.findFirst({
      where: {
        id: mentorId,
        role: "MENTOR",
      },
    });

    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    // Only check for existing applications with the same mentor
    const existingMentorship = await db.mentorshipSession.findFirst({
      where: {
        menteeId: user.id,
        mentorId: mentorId,
        status: {
          in: ["PENDING", "ACCEPTED"], // Only check PENDING and ACCEPTED status
        },
      },
    });

    if (existingMentorship) {
      const status =
        existingMentorship.status === "PENDING" ? "a pending application" : "an active mentorship";
      return NextResponse.json(
        { error: `You already have ${status} with this mentor` },
        { status: 400 },
      );
    }

    // Create the mentorship session
    const mentorshipSession = await db.mentorshipSession.create({
      data: {
        mentorId,
        menteeId: user.id,
        message,
        sessionDate: sessionDate ? new Date(sessionDate) : null,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        sessionType,
        status: "PENDING",
        academicLevel,
        fieldOfStudy,
        careerGoals,
        areasOfInterest,
        expectedGraduationDate: new Date(expectedGraduationDate),
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

    // Get user
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all mentorship sessions where the user is either mentor or mentee
    const mentorshipSessions = await db.mentorshipSession.findMany({
      where: {
        OR: [{ mentorId: user.id }, { menteeId: user.id }],
      },
      include: {
        mentor: {
          include: {
            profile: true,
            mentorProfile: true,
          },
        },
        mentee: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(mentorshipSessions);
  } catch (error) {
    console.error("Error fetching mentorship sessions:", error);
    return NextResponse.json({ error: "Failed to fetch mentorship sessions" }, { status: 500 });
  }
}
