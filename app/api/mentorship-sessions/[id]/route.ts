import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);

    // Get user and verify they are a mentor
    const user = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!user || user.role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    // Update the mentorship session
    const updatedSession = await db.mentorshipSession.update({
      where: {
        id: params.id,
        mentorId: user.id, // Ensure mentor can only update their own sessions
      },
      data: { status },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating mentorship session:", error);
    return NextResponse.json({ error: "Failed to update mentorship session" }, { status: 500 });
  }
}
