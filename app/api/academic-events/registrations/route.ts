// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const registrations = await prisma.eventRegistration.findMany({
//       where: {
//         userId: session.user.id,
//       },
//       include: {
//         event: true,
//         session: true,
//       },
//     });

//     return NextResponse.json(registrations);
//   } catch (error) {
//     console.error("Error fetching registrations:", error);
//     return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
//   }
// }
