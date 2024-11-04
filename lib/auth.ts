import type { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  dob?: Date | null;
  phoneNo?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  notificationPreferences?: string | null;
  lastPasswordResetAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Server-side auth check
export function requireUser(): User {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken) {
    redirect("/login");
  }

  try {
    const user = JSON.parse(authToken.value) as User;
    return user;
  } catch (_error) {
    cookieStore.delete("auth-token");
    redirect("/login");
  }
}

// Client-side auth check
export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "include", // Important for cookies
    });

    const data = await response.json();

    if (data.authenticated && data.user) {
      return data.user as User;
    }

    return null;
  } catch (_error) {
    return null;
  }
}
