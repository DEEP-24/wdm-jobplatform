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

    // Get user
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch applications for this user
    const applications = await db.mentorshipSession.findMany({
      where: {
        menteeId: user.id,
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching mentorship applications:", error);
    return NextResponse.json({ error: "Failed to fetch mentorship applications" }, { status: 500 });
  }
}
