import type { UserRole } from "@prisma/client";

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
