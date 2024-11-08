import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const tokenData = JSON.parse(authToken.value);

    // Get complete user data from database
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            dob: true,
            phone: true,
            streetAddress: true,
            city: true,
            state: true,
            postalCode: true,
          },
        },
        notificationPreferences: true,
        lastPasswordResetAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        dob: user.profile?.dob?.toISOString().split("T")[0], // Format date for frontend
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
