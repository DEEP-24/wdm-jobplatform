import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const registrationId = request.url.split("/").pop();
    console.log("Received registration ID:", registrationId);

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const user = await db.user.findUnique({
      where: {
        email: tokenData.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Find and verify the registration
    const registration = await db.eventRegistration.findFirst({
      where: {
        id: registrationId,
        userId: user.id,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete the registration
    const deletedRegistration = await db.eventRegistration.delete({
      where: {
        id: registrationId,
      },
    });

    if (!deletedRegistration) {
      throw new Error("Failed to delete registration");
    }

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully",
      data: deletedRegistration,
    });
  } catch (error) {
    console.error("Delete registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
