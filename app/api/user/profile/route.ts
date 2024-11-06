import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hashPassword } from "@/hooks/misc";
import { z } from "zod";
import { profileSchema } from "@/app/schema";

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const body = await request.json();

    // Validate profile data
    try {
      const validatedProfileData = profileSchema.parse({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        streetAddress: body.streetAddress,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        dob: body.dob,
      });

      // Update user data
      const userUpdateData: any = {
        email: body.email,
        notificationPreferences: body.notificationPreferences,
      };

      if (body.password) {
        const hashedPassword = await hashPassword(body.password);
        userUpdateData.password = hashedPassword;
      }

      // Update or create profile data using validated data
      const profileData = {
        firstName: validatedProfileData.firstName,
        lastName: validatedProfileData.lastName,
        phone: validatedProfileData.phone,
        streetAddress: validatedProfileData.streetAddress,
        city: validatedProfileData.city,
        state: validatedProfileData.state,
        postalCode: validatedProfileData.postalCode,
        dob: new Date(validatedProfileData.dob),
      };

      const updatedUser = await db.user.update({
        where: { email: tokenData.email },
        data: {
          ...userUpdateData,
          profile: {
            upsert: {
              create: profileData,
              update: profileData,
            },
          },
        },
        include: {
          profile: true,
        },
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
          dob: updatedUser.profile?.dob?.toISOString().split("T")[0],
        },
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: validationError.errors },
          { status: 400 },
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
