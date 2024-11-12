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

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return new NextResponse(JSON.stringify({ error: "Event ID is required" }), { status: 400 });
  }

  try {
    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        sessions: true,
      },
    });

    if (!event) {
      return new NextResponse(JSON.stringify({ error: "Event not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(event), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch event" }), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const data = await request.json();

    const event = await db.event.update({
      where: { id: params.id },
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
      },
    });

    // Delete existing sessions
    await db.eventSession.deleteMany({
      where: { eventId: params.id },
    });

    // Create new sessions
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

    return new NextResponse(JSON.stringify({ event, sessions }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to update event" }), { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First delete all registrations for all sessions of this event
    await db.eventRegistration.deleteMany({
      where: {
        event: {
          id: params.id,
        },
      },
    });

    // Then delete all sessions associated with the event
    await db.eventSession.deleteMany({
      where: {
        eventId: params.id,
      },
    });

    // Finally delete the event itself
    await db.event.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
