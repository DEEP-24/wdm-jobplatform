"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ChatComponent from "@/app/(dashboard)/_components/chat";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  sentAt: string;
  read: boolean;
  sender: {
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}

interface ChatUser {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
  lastMessage?: Message;
}

export default function ChatPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
          await fetchFollowedUsers();
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [toast]);

  const fetchFollowedUsers = async () => {
    try {
      const response = await fetch("/api/users/following");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Following users response:", data);

      const sortedUsers = data.sort((a: ChatUser, b: ChatUser) => {
        const aTime = a.lastMessage?.sentAt ? new Date(a.lastMessage.sentAt).getTime() : 0;
        const bTime = b.lastMessage?.sentAt ? new Date(b.lastMessage.sentAt).getTime() : 0;
        return bTime - aTime;
      });

      setChatUsers(sortedUsers || []);
    } catch (error) {
      console.error("Error fetching followed users:", error);
      toast({
        title: "Error",
        description: "Failed to load followed users",
        variant: "destructive",
      });
      setChatUsers([]);
    }
  };

  const getInitials = (user: ChatUser) => {
    if (user.profile) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`;
    }
    return user.email[0].toUpperCase();
  };

  const getUserName = (user: ChatUser) => {
    if (user.profile) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.email;
  };

  const handleUserSelect = async (user: ChatUser) => {
    setSelectedUser(user);

    if (
      user.lastMessage &&
      !user.lastMessage.read &&
      user.lastMessage.receiverId === currentUser?.id
    ) {
      try {
        await fetch(`/api/messages/${user.lastMessage.id}/read`, {
          method: "PUT",
        });

        setChatUsers((prevUsers) =>
          prevUsers.map((u) => {
            if (u.id === user.id && u.lastMessage) {
              return {
                ...u,
                lastMessage: {
                  ...u.lastMessage,
                  read: true,
                },
              };
            }
            return u;
          }),
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, user: ChatUser) => {
    if (e.key === "Enter" || e.key === " ") {
      setSelectedUser(user);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="bg-purple-700 text-white">
          <CardTitle className="text-2xl font-bold">Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[350px,1fr] divide-x">
            {/* Users List */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="p-4 space-y-2">
                {!Array.isArray(chatUsers) || chatUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No followed users yet</p>
                ) : (
                  chatUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id ? "bg-purple-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleUserSelect(user)}
                      onKeyDown={(e) => handleKeyPress(e, user)}
                      role="button"
                      tabIndex={0}
                    >
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${getUserName(
                            user,
                          )}`}
                        />
                        <AvatarFallback className="bg-purple-200 text-purple-800">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{getUserName(user)}</p>
                        {user.lastMessage && (
                          <>
                            <p
                              className={`text-sm truncate ${
                                !user.lastMessage.read &&
                                user.lastMessage.receiverId === currentUser?.id
                                  ? "text-purple-700 font-semibold"
                                  : "text-gray-500"
                              }`}
                            >
                              {user.lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(user.lastMessage.sentAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </>
                        )}
                      </div>
                      {user.lastMessage &&
                        !user.lastMessage.read &&
                        user.lastMessage.receiverId === currentUser?.id && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full" />
                        )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Chat Area */}
            <div className="h-[calc(100vh-200px)] bg-gray-50">
              {selectedUser ? (
                <div className="h-full">
                  {!selectedUser.lastMessage && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-500 z-10">
                      <p>No conversation history with {getUserName(selectedUser)}</p>
                      <p className="text-sm">Send a message to start chatting!</p>
                    </div>
                  )}
                  <ChatComponent
                    key={selectedUser.id}
                    recipientId={selectedUser.id}
                    recipientName={getUserName(selectedUser)}
                    recipientEmail={selectedUser.email}
                    recipientProfile={selectedUser.profile}
                    currentUserId={currentUser?.id}
                    isOpen={true}
                    onClose={() => setSelectedUser(null)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a user to start messaging
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
