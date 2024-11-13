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

    // Check if already following
    const existingFollow = await db.followers.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following this user" }, { status: 400 });
    }

    // Create new follow relationship
    await db.followers.create({
      data: {
        followerId,
        followingId,
      },
    });

    return NextResponse.json({ message: "Successfully followed user" }, { status: 200 });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}
