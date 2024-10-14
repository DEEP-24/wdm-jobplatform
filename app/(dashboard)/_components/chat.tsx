"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleIcon, SendIcon } from "lucide-react";
import { useState } from "react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "system";
};

export default function ChatComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to GrowthLink chat!", sender: "system" },
    { id: 2, text: "How can I assist you today?", sender: "system" },
    { id: 3, text: "I'm interested in the upcoming AI workshop.", sender: "user" },
    {
      id: 4,
      text: "Great! The AI workshop series starts next month. Would you like more details?",
      sender: "system",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: inputMessage, sender: "user" }]);
      setInputMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 bg-primary text-white shadow-lg"
      >
        <MessageCircleIcon />
      </Button>
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 h-96 overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden flex flex-col p-0">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-2 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow p-2 border rounded"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
