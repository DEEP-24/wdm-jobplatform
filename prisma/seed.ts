import { hashPassword } from "@/lib/server/misc";
import { PrismaClient, UserRole, EventType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.mentorshipSession.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.requiredSkill.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.eventSession.deleteMany();
  await prisma.event.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.followers.deleteMany();
  await prisma.mentorProfile.deleteMany();
  await prisma.menteeProfile.deleteMany();
  await prisma.mentorshipProgram.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

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

  const organizerUser = await prisma.user.findUnique({ where: { email: "organizer@example.com" } });

  await prisma.event.create({
    data: {
      title: "Annual Tech Conference",
      description: "Join us for the biggest tech conference of the year",
      eventType: EventType.CONFERENCE,
      startDate: new Date("2024-11-18T09:00:00Z"),
      endDate: new Date("2024-11-20T17:00:00Z"),
      location: "Tech Convention Center",
      isVirtual: false,
      maxAttendees: 500,
      registrationDeadline: new Date("2024-11-15T23:59:59Z"),
      userId: organizerUser!.id,
      sessions: {
        create: [
          {
            title: "Keynote Speech",
            description: "Opening ceremony and keynote presentation",
            startTime: new Date("2024-11-18T09:00:00Z"),
            endTime: new Date("2024-11-18T10:30:00Z"),
            location: "Main Hall",
            maxAttendees: 500,
          },
          {
            title: "Web Development Workshop",
            description: "Hands-on workshop on modern web development",
            startTime: new Date("2024-11-18T11:00:00Z"),
            endTime: new Date("2024-11-18T13:00:00Z"),
            location: "Workshop Room A",
            maxAttendees: 50,
          },
        ],
      },
    },
  });

  await prisma.event.create({
    data: {
      title: "Career Development Workshop",
      description: "Connect with top employers in the tech industry",
      eventType: EventType.WORKSHOP,
      startDate: new Date("2024-11-25T10:00:00Z"),
      endDate: new Date("2024-11-25T16:00:00Z"),
      location: "University Campus Center",
      isVirtual: false,
      maxAttendees: 300,
      registrationDeadline: new Date("2024-11-22T23:59:59Z"),
      userId: organizerUser!.id,
      sessions: {
        create: [
          {
            title: "Resume Review Session",
            description: "Get your resume reviewed by HR professionals",
            startTime: new Date("2024-11-25T10:30:00Z"),
            endTime: new Date("2024-11-25T12:30:00Z"),
            location: "Room 101",
            maxAttendees: 50,
          },
          {
            title: "Interview Skills Workshop",
            description: "Learn effective interviewing techniques",
            startTime: new Date("2024-11-25T13:30:00Z"),
            endTime: new Date("2024-11-25T15:30:00Z"),
            location: "Room 102",
            maxAttendees: 40,
          },
        ],
      },
    },
  });

  // Add job listings
  const employerUser = await prisma.user.findUnique({ where: { email: "employer@example.com" } });

  await prisma.jobListing.create({
    data: {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      listingType: "Job",
      jobType: "Full_time",
      workArrangement: "Hybrid",
      description:
        "We are seeking an exceptional Senior Software Engineer to join our innovative development team at Tech Corp. The ideal candidate will play a crucial role in architecting and developing scalable solutions for our enterprise clients. You'll work with cutting-edge technologies in a collaborative environment, participating in code reviews, system design discussions, and technical decision-making processes. We offer competitive benefits, including health insurance, 401(k) matching, unlimited PTO, and professional development opportunities. Our hybrid work environment provides the perfect balance of in-office collaboration and remote flexibility.",
      requirements: "5+ years experience, React, Node.js",
      responsibilities: "Lead development projects, mentor junior developers",
      salaryRange: "$120,000 - $160,000",
      applicationDeadline: new Date("2024-12-31"),
      postedBy: employerUser!.id,
      requiredSkills: {
        create: [{ skillName: "React" }, { skillName: "Node.js" }, { skillName: "TypeScript" }],
      },
    },
  });

  await prisma.jobListing.create({
    data: {
      title: "Summer Software Internship",
      company: "Tech Corp",
      location: "Remote",
      listingType: "Internship",
      jobType: "Full_time",
      workArrangement: "Remote",
      isInternshipPaid: true,
      description:
        "Join Tech Corp's dynamic summer internship program, designed to provide hands-on experience in modern software development practices. As an intern, you'll be fully integrated into our development teams, working on real-world projects that impact millions of users. You'll receive mentorship from experienced developers, participate in weekly learning sessions, and gain exposure to full-stack development, agile methodologies, and industry best practices. This program includes regular feedback sessions, networking opportunities with industry professionals, and the possibility of full-time employment upon successful completion. We're committed to fostering an inclusive learning environment where you can grow both technically and professionally.",
      requirements: "Currently pursuing CS degree, knowledge of JavaScript",
      responsibilities: "Assist in development projects, learn our tech stack",
      salaryRange: "$25,000 - $30,000",
      applicationDeadline: new Date("2024-03-31"),
      startDate: new Date("2024-06-01"),
      duration: "3 months",
      postedBy: employerUser!.id,
      requiredSkills: {
        create: [{ skillName: "JavaScript" }, { skillName: "HTML" }, { skillName: "CSS" }],
      },
    },
  });

  // Add a job application
  const regularUser = await prisma.user.findUnique({ where: { email: "user@example.com" } });
  const jobListing = await prisma.jobListing.findFirst();

  await prisma.jobApplication.create({
    data: {
      jobId: jobListing!.id,
      applicantId: regularUser!.id,
      resumeURL: "https://example.com/resume.pdf",
      coverLetterURL: "https://example.com/cover-letter.pdf",
      linkedInURL: "https://linkedin.com/in/johndoe",
      applicationStatus: "Under Review",
      notes: "Strong candidate with relevant experience",
    },
  });

  // Add a saved job
  await prisma.savedJob.create({
    data: {
      userId: regularUser!.id,
      jobId: jobListing!.id,
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
