// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { eventId, sessionId } = await request.json();

//     const registration = await prisma.eventRegistration.create({
//       data: {
//         userId: session.user.id,
//         eventId,
//         sessionId,
//         bookingDate: new Date(),
//       },
//     });

//     return NextResponse.json(registration);
//   } catch (error) {
//     console.error("Error registering for event:", error);
//     return NextResponse.json({ error: "Failed to register" }, { status: 500 });
//   }
// }
