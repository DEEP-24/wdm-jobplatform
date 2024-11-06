import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verify } from "argon2";
import { z } from "zod";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Login attempt for email:", body.email);

    const validatedData = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!user) {
      console.log("User not found");
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    console.log("User found, comparing passwords");

    try {
      const passwordMatch = await verify(user.password, validatedData.password);
      console.log("Password match result:", passwordMatch);

      if (!passwordMatch) {
        console.log("Password does not match");
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }

      const cookieStore = cookies();
      const sessionData = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : undefined,
        profile: user.profile,
      };

      cookieStore.set("auth-token", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: sessionData,
      });
    } catch (error) {
      console.error("Password comparison error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("auth-token");

  return NextResponse.json({ success: true });
}
