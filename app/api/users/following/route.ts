import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const tokenData = JSON.parse(authToken.value);

    const following = await db.follower.findMany({
      where: {
        followerId: tokenData.id,
      },
      select: {
        followingId: true,
      },
    });

    return NextResponse.json(following);
  } catch (error) {
    console.error("Get following error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
