import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: {
        sessions: true,
      },
    });

    // Transform the data to match the frontend interface
    const transformedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description || "",
      eventType: event.eventType,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location || "",
      isVirtual: event.isVirtual,
      maxAttendees: event.maxAttendees || 0,
      registrationDeadline: event.registrationDeadline?.toISOString() || "",
      status: event.status || "Upcoming",
      sessions: event.sessions.map((session) => ({
        id: session.id,
        eventId: session.eventId,
        title: session.title,
        description: session.description || "",
        startTime: session.startTime?.toISOString() || "",
        endTime: session.endTime?.toISOString() || "",
        location: session.location || "",
        maxAttendees: session.maxAttendees || 0,
      })),
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
