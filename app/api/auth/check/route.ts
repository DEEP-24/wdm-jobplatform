import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(authToken.value);
    return NextResponse.json({ authenticated: true, user });
  } catch (_error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
