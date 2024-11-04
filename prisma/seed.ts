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
    },
  });

  // Create regular users
  await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: await hashPassword("password"),
      role: UserRole.USER,
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
