export type UserRole = "admin" | "employer" | "organizer" | "mentor" | "student";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  phoneNo: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  role: UserRole;
}
