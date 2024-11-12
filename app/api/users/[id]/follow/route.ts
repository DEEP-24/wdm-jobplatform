import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const tokenData = JSON.parse(authToken.value);
    const followerId = tokenData.id;
    const followingId = params.id;

    // Check if already following
    const existingFollow = await db.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return new NextResponse("Already following this user", { status: 400 });
    }

    // Create new follow relationship
    await db.follower.create({
      data: {
        followerId,
        followingId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
