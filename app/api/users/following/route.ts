import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);

    const currentUser = await db.user.findUnique({
      where: { email: tokenData.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get both followed users and users who sent messages
    const users = await db.user.findMany({
      where: {
        OR: [
          // Users being followed
          {
            followers: {
              some: {
                followerId: currentUser.id,
              },
            },
          },
          // Users who sent messages to current user
          {
            sentMessages: {
              some: {
                receiverId: currentUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        receivedMessages: {
          where: {
            senderId: currentUser.id,
          },
          orderBy: {
            sentAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            receiverId: true,
            sentAt: true,
            isRead: true,
          },
        },
        sentMessages: {
          where: {
            receiverId: currentUser.id,
          },
          orderBy: {
            sentAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            receiverId: true,
            sentAt: true,
            isRead: true,
          },
        },
      },
    });

    // Transform the data to include lastMessage
    const usersWithLastMessage = users.map((user) => {
      const sentMessage = user.sentMessages[0];
      const receivedMessage = user.receivedMessages[0];

      let lastMessage = null;
      if (sentMessage && receivedMessage) {
        lastMessage =
          new Date(sentMessage.sentAt) > new Date(receivedMessage.sentAt)
            ? sentMessage
            : receivedMessage;
      } else {
        lastMessage = sentMessage || receivedMessage || null;
      }

      // Remove the messages arrays and add lastMessage
      const { sentMessages, receivedMessages, ...userWithoutMessages } = user;
      return {
        ...userWithoutMessages,
        lastMessage: lastMessage
          ? {
              ...lastMessage,
              read: lastMessage.isRead,
            }
          : null,
      };
    });

    return NextResponse.json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in GET /api/users/following:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
