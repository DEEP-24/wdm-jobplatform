import { hashPassword } from "@/hooks/misc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create admin user
  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: await hashPassword("password"),
      role: UserRole.ADMIN,
      notificationPreferences: "email",
      dob: new Date("1990-01-01"),
      phoneNo: "+1234567890",
      street: "123 Admin Street",
      city: "Admin City",
      state: "California",
      zipcode: "12345",
    },
  });

  // Create employer user
  await prisma.user.create({
    data: {
      firstName: "Employer",
      lastName: "Smith",
      email: "employer@example.com",
      password: await hashPassword("password"),
      role: UserRole.EMPLOYER,
      notificationPreferences: "email,sms",
      dob: new Date("1985-05-15"),
      phoneNo: "+1987654321",
      street: "456 Business Ave",
      city: "Enterprise City",
      state: "New York",
      zipcode: "67890",
    },
  });

  // Create mentor user
  await prisma.user.create({
    data: {
      firstName: "Mentor",
      lastName: "Johnson",
      email: "mentor@example.com",
      password: await hashPassword("password"),
      role: UserRole.MENTOR,
      notificationPreferences: "email",
      dob: new Date("1982-08-20"),
      phoneNo: "+1122334455",
      street: "789 Mentor Lane",
      city: "Knowledge City",
      state: "Texas",
      zipcode: "34567",
    },
  });

  // Create organizer user
  await prisma.user.create({
    data: {
      firstName: "Organizer",
      lastName: "Brown",
      email: "organizer@example.com",
      password: await hashPassword("password"),
      role: UserRole.ORGANIZER,
      notificationPreferences: "email,sms",
      dob: new Date("1988-11-30"),
      phoneNo: "+1555666777",
      street: "321 Event Street",
      city: "Festival City",
      state: "Florida",
      zipcode: "89012",
    },
  });

  // Create regular user
  await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "user@example.com",
      password: await hashPassword("password"),
      role: UserRole.USER,
      notificationPreferences: "email",
      dob: new Date("1995-03-25"),
      phoneNo: "+1999888777",
      street: "555 User Road",
      city: "User City",
      state: "Washington",
      zipcode: "45678",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
