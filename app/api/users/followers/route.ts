import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const followers = await db.followers.findMany({
      where: {
        followingId: user.id,
      },
      select: {
        followerId: true,
      },
    });

    return NextResponse.json({ followers });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
