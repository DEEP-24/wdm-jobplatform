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
  lastMessage: Message;
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
          await fetchChatUsers();
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

  const fetchChatUsers = async () => {
    try {
      const response = await fetch("/api/messages/users");
      const data = await response.json();
      setChatUsers(data);
    } catch (error) {
      console.error("Error fetching chat users:", error);
      toast({
        title: "Error",
        description: "Failed to load chat users",
        variant: "destructive",
      });
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

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
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
                {chatUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No messages yet</p>
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
                            <p className="text-sm text-gray-500 truncate">
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
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Chat Area */}
            <div className="h-[calc(100vh-200px)] relative bg-gray-50">
              {selectedUser ? (
                <ChatComponent
                  recipientId={selectedUser.id}
                  recipientName={getUserName(selectedUser)}
                  currentUserId={currentUser?.id}
                  isOpen={true}
                  onClose={() => setSelectedUser(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
