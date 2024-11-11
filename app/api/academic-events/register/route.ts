import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId, sessionId } = await req.json();

    if (!eventId || !sessionId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = await db.eventRegistration.findFirst({
      where: {
        userId: user.id,
        sessionId: sessionId,
      },
    });

    if (existingRegistration) {
      return new NextResponse("Already registered for this session", { status: 400 });
    }

    // Check if session exists and has space
    const eventSession = await db.eventSession.findUnique({
      where: { id: sessionId },
      include: {
        registrations: true,
      },
    });

    if (!eventSession) {
      return new NextResponse("Session not found", { status: 404 });
    }

    if (
      eventSession.maxAttendees &&
      eventSession.registrations.length >= eventSession.maxAttendees
    ) {
      return new NextResponse("Session is full", { status: 400 });
    }

    // Create registration
    const registration = await db.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: eventId,
        sessionId: sessionId,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
