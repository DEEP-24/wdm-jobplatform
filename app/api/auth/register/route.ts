import { hashPassword } from "@/hooks/misc";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { registerSchema } from "../../../schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received registration data:", body);

    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
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

    // Create new user
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
      },
    });

    console.log("User created successfully:", user.id);

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
