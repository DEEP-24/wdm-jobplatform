import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    const user = await db.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dob: true,
        phoneNo: true,
        street: true,
        city: true,
        state: true,
        zipcode: true,
        notificationPreferences: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load profile data" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const body = await request.json();

    const updatedUser = await db.user.update({
      where: { email: session.email },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dob: body.dob ? new Date(body.dob) : null,
        phoneNo: body.phoneNo,
        street: body.street,
        city: body.city,
        state: body.state,
        zipcode: body.zipcode,
        notificationPreferences: body.notificationPreferences,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
