import { hashPassword } from "@/lib/server/misc";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { registerSchema } from "../../../schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        profile: {
          create: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            phone: validatedData.phoneNo || "",
            streetAddress: validatedData.street,
            city: validatedData.city,
            state: validatedData.state,
            postalCode: validatedData.zipcode,
            dob: validatedData.dob ? new Date(validatedData.dob) : new Date(),
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (!user.profile) {
      throw new Error("Failed to create user profile");
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.profile.firstName} ${user.profile.lastName}`,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 },
    );
  }
}
