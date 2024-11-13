import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const followerId = tokenData.id;
    const followingId = params.id;

    // Check if follow relationship exists
    const existingFollow = await db.followers.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json({ error: "Not following this user" }, { status: 400 });
    }

    // Delete follow relationship
    await db.followers.delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    return NextResponse.json({ message: "Successfully unfollowed user" }, { status: 200 });
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}
