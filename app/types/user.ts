export interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  dob: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  profile?: Profile;
  notificationPreferences?: string;
}
