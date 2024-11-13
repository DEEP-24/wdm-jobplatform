import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const userId = tokenData.id;

    // Get all following relationships for the current user
    const following = await db.followers.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    return NextResponse.json({ following }, { status: 200 });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following users" }, { status: 500 });
  }
}
