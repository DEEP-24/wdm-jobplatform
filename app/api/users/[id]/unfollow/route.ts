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

    await db.follower.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unfollow error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
