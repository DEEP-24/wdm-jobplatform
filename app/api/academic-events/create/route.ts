import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const tokenData = JSON.parse(authToken.value);

      // Get user from database
      const user = await db.user.findUnique({
        where: {
          email: tokenData.email,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const data = await request.json();

      // Create the event
      const event = await db.event.create({
        data: {
          title: data.title,
          description: data.description,
          eventType: data.eventType,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          location: data.location,
          maxAttendees: Number.parseInt(data.maxAttendees),
          registrationDeadline: new Date(data.registrationDeadline),
          isVirtual: data.isVirtual || false,
          userId: user.id,
        },
      });

      // Create sessions for the event
      const sessions = await Promise.all(
        data.sessions.map((session: any) =>
          db.eventSession.create({
            data: {
              title: session.title,
              description: session.description,
              startTime: new Date(session.startTime),
              endTime: new Date(session.endTime),
              location: session.location || data.location,
              maxAttendees: session.maxAttendees || Number.parseInt(data.maxAttendees),
              eventId: event.id,
            },
          }),
        ),
      );

      return NextResponse.json({ event, sessions }, { status: 201 });
    } catch (error) {
      console.error("Token parsing error:", error);
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
