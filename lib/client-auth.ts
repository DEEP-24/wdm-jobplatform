import type { User } from "./server-auth";

export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/check", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.authenticated && data.user) {
      return data.user;
    }

    return null;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}
