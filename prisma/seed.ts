import { hashPassword } from "@/hooks/misc";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await hashPassword("password"),
      role: UserRole.ADMIN,
      notificationPreferences: "email",
      profile: {
        create: {
          firstName: "Admin",
          lastName: "User",
          phone: "+1234567890",
          streetAddress: "123 Admin Street",
          city: "Admin City",
          state: "California",
          postalCode: "12345",

          dob: new Date("1990-01-01"),
          academicBackground: "PhD in Administration",
          interests: "System Management, Security",
          skills: "Leadership, Problem Solving",
        },
      },
    },
  });

  // Create employer user
  await prisma.user.create({
    data: {
      email: "employer@example.com",
      password: await hashPassword("password"),
      role: UserRole.EMPLOYER,
      notificationPreferences: "email,sms",
      profile: {
        create: {
          firstName: "Employer",
          lastName: "Smith",
          phone: "+1987654321",
          streetAddress: "456 Business Ave",
          city: "Enterprise City",
          state: "New York",
          postalCode: "67890",
          dob: new Date("1985-05-15"),
          academicBackground: "MBA",
          interests: "Business Development, Recruitment",
          skills: "Hiring, Management",
        },
      },
    },
  });

  // Create mentor user
  await prisma.user.create({
    data: {
      email: "mentor@example.com",
      password: await hashPassword("password"),
      role: UserRole.MENTOR,
      notificationPreferences: "email",
      profile: {
        create: {
          firstName: "Mentor",
          lastName: "Johnson",
          phone: "+1122334455",
          streetAddress: "789 Mentor Lane",
          city: "Knowledge City",
          state: "Texas",
          postalCode: "34567",
          dob: new Date("1982-08-20"),
          academicBackground: "Masters in Education",
          interests: "Mentoring, Teaching",
          skills: "Communication, Leadership",
        },
      },
    },
  });

  // Create organizer user
  await prisma.user.create({
    data: {
      email: "organizer@example.com",
      password: await hashPassword("password"),
      role: UserRole.ORGANIZER,
      notificationPreferences: "email,sms",
      profile: {
        create: {
          firstName: "Organizer",
          lastName: "Brown",
          phone: "+1555666777",
          streetAddress: "321 Event Street",
          city: "Festival City",
          state: "Florida",
          postalCode: "89012",
          dob: new Date("1988-11-30"),
          academicBackground: "Event Management",
          interests: "Event Planning, Coordination",
          skills: "Organization, Time Management",
        },
      },
    },
  });

  // Create regular user
  await prisma.user.create({
    data: {
      email: "user@example.com",
      password: await hashPassword("password"),
      role: UserRole.USER,
      notificationPreferences: "email",
      profile: {
        create: {
          firstName: "John",
          lastName: "Doe",
          phone: "+1999888777",
          streetAddress: "555 User Road",
          city: "User City",
          state: "Washington",
          postalCode: "89012",
          dob: new Date("1995-03-25"),
          academicBackground: "Bachelor's in Computer Science",
          interests: "Technology, Programming",
          skills: "JavaScript, React, Node.js",
        },
      },
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
