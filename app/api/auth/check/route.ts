import { NextResponse } from "next/server";
import { validateAuthToken } from "@/lib/server-auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const sessionData = await validateAuthToken();

    if (!sessionData) {
      // Clear the invalid cookie
      const cookieStore = cookies();
      cookieStore.delete("auth-token");

      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: sessionData,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
