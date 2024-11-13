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

export type User = {
  id: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    dob: string;
  };
  notificationPreferences?: string;
};
