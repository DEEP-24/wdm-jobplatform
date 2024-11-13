"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { disconnectSocket, getSocket, initializeSocket } from "@/lib/socket";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatComponent({
  recipientId,
  recipientName,
  currentUserId,
  isOpen,
  onClose,
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
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-lg">
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{recipientName}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && <div className="text-xs text-red-500">Connecting to chat server...</div>}
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
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
        <form onSubmit={sendMessage} className="p-4 border-t">
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
      </CardContent>
    </Card>
  );
}
