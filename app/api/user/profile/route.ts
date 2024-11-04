import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hashPassword } from "@/hooks/misc";

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const body = await request.json();

    const updateData: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      dob: body.dob ? new Date(body.dob) : null,
      phoneNo: body.phoneNo,
      street: body.street,
      city: body.city,
      state: body.state,
      zipcode: body.zipcode,
      notificationPreferences: body.notificationPreferences,
    };

    if (body.password) {
      const hashedPassword = await hashPassword(body.password);
      updateData.password = hashedPassword;
    }

    const updatedUser = await db.user.update({
      where: { email: tokenData.email },
      data: updateData,
    });

    // Update auth token if email changed
    if (body.email !== tokenData.email) {
      const newToken = { ...tokenData, email: body.email };
      cookieStore.set("auth-token", JSON.stringify(newToken));
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        dob: updatedUser.dob?.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
