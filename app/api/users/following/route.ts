import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenData = JSON.parse(authToken.value);
    const userId = tokenData.id;

    // Get all following relationships with user details and last message
    const following = await db.followers.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
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
                senderId: userId,
              },
              orderBy: {
                sentAt: "desc",
              },
              take: 1,
            },
            sentMessages: {
              where: {
                receiverId: userId,
              },
              orderBy: {
                sentAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    // Transform the data to match the ChatUser interface
    const followingUsers = following.map((f) => {
      const user = f.following;
      const lastSentMessage = user.sentMessages[0];
      const lastReceivedMessage = user.receivedMessages[0];

      // Get the most recent message
      const lastMessage =
        lastSentMessage && lastReceivedMessage
          ? new Date(lastSentMessage.sentAt) > new Date(lastReceivedMessage.sentAt)
            ? lastSentMessage
            : lastReceivedMessage
          : lastSentMessage || lastReceivedMessage;

      return {
        id: user.id,
        email: user.email,
        profile: user.profile,
        lastMessage: lastMessage || undefined,
      };
    });

    return NextResponse.json(followingUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching following:", error);
    return NextResponse.json({ error: "Failed to fetch following users" }, { status: 500 });
  }
}
