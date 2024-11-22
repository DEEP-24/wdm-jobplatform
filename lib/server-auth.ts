import type { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { db } from "./db";

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

export async function validateAuthToken() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth-token");

  if (!authToken?.value) {
    return null;
  }

  try {
    const sessionData = JSON.parse(authToken.value);

    // Verify that the user still exists with the same ID
    const user = await db.user.findUnique({
      where: { id: sessionData.id },
      select: { id: true, email: true },
    });

    // If user doesn't exist or email doesn't match, return null
    if (!user || user.email !== sessionData.email) {
      return null;
    }

    return sessionData;
  } catch (_error) {
    return null;
  }
}
