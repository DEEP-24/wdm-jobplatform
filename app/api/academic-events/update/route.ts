import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { isWithinDateRange, hasTimeConflict } from "@/lib/server/misc";

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || user.role !== "ORGANIZER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      isVirtual,
      maxAttendees,
      registrationDeadline,
      sessions,
    } = body;

    // Validate required fields
    if (!title || !eventType || !startDate || !endDate || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const eventStartDate = new Date(startDate);
    const eventEndDate = new Date(endDate);

    // Validate event dates
    if (eventStartDate >= eventEndDate) {
      return NextResponse.json(
        { error: "Event end date must be after start date" },
        { status: 400 },
      );
    }

    // Validate registration deadline
    if (registrationDeadline) {
      const regDeadline = new Date(registrationDeadline);
      if (regDeadline > eventStartDate) {
        return NextResponse.json(
          { error: "Registration deadline must be before event start date" },
          { status: 400 },
        );
      }
    }

    // Validate sessions
    for (const session of sessions) {
      const sessionStartTime = new Date(session.startTime);
      const sessionEndTime = new Date(session.endTime);

      // Check if session dates are within event dates
      if (
        !isWithinDateRange(sessionStartTime, eventStartDate, eventEndDate) ||
        !isWithinDateRange(sessionEndTime, eventStartDate, eventEndDate)
      ) {
        return NextResponse.json(
          { error: "Session times must be within event dates" },
          { status: 400 },
        );
      }

      // Check if session end time is after start time
      if (sessionStartTime >= sessionEndTime) {
        return NextResponse.json(
          { error: "Session end time must be after start time" },
          { status: 400 },
        );
      }

      // Check for time conflicts with other sessions
      for (const otherSession of sessions) {
        if (otherSession === session) {
          continue;
        }

        if (
          hasTimeConflict(
            sessionStartTime,
            sessionEndTime,
            new Date(otherSession.startTime),
            new Date(otherSession.endTime),
          )
        ) {
          return NextResponse.json(
            { error: "Session times conflict with another session" },
            { status: 400 },
          );
        }
      }

      // Set session location to event location if not specified
      if (!session.location) {
        session.location = location;
      }
    }

    // Verify the user owns this event
    const existingEvent = await db.event.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 });
    }

    // Update event and its sessions
    const updatedEvent = await db.event.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        eventType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        isVirtual,
        maxAttendees,
        registrationDeadline: new Date(registrationDeadline),
        sessions: {
          deleteMany: {}, // Remove all existing sessions
          create: sessions.map((session: any) => ({
            title: session.title,
            description: session.description,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
            location: session.location,
            maxAttendees: session.maxAttendees,
          })),
        },
      },
      include: {
        sessions: true,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event", details: error }, { status: 500 });
  }
}
