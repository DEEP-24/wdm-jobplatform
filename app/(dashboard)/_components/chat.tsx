"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { disconnectSocket, getSocket, initializeSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

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

interface ChatComponentProps {
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientProfile: {
    firstName: string;
    lastName: string;
  } | null;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatComponent({
  recipientId,
  recipientName,
  recipientEmail,
  currentUserId,
  isOpen,
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const socket = initializeSocket(currentUserId);

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      disconnectSocket();
    };
  }, [currentUserId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?userId=${recipientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          receiverId: recipientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Emit message through socket
      const socket = getSocket();
      socket.emit("send-message", {
        content: newMessage,
        senderId: currentUserId,
        receiverId: recipientId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${recipientName}`} />
            <AvatarFallback className="bg-purple-200 text-purple-800">
              {recipientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{recipientName}</h2>
            <div className="text-sm text-gray-500">{recipientEmail}</div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.senderId === currentUserId ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === currentUserId
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.sentAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected || isLoading}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !isConnected || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </form>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
