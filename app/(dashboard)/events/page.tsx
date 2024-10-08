"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";

const eventsData = [
  {
    id: 1,
    title: "Tech Conference",
    description:
      "This event is a gathering of industry leaders and technology enthusiasts. It aims to explore the latest innovations and trends in the technology sector. Attendees will have the opportunity to learn about cutting-edge developments, network with professionals, and gain insights into the future of technology.",
    date: "2024-11-15",
    location: "San Francisco, CA",
    registrationLink: "https://techconference.com/register",
  },
  {
    id: 2,
    title: "AI Symposium",
    description:
      " This annual symposium focuses on the cutting-edge advancements in Artificial Intelligence. It's an opportunity for researchers, developers, and AI enthusiasts to come together and explore the latest developments in the field of AI. The event likely covers topics such as machine learning, neural networks, natural language processing, and the ethical implications of AI.",
    date: "2024-12-05",
    location: "New York, NY",
    registrationLink: "https://aisymposium.com/register",
  },
  {
    id: 3,
    title: "Blockchain Summit",
    description:
      "This summit is dedicated to exploring the potential of blockchain technology and its applications across various industries. Attendees will have the opportunity to discover how blockchain is being used beyond cryptocurrencies, potentially including areas such as supply chain management, healthcare, finance, and more.",
    date: "2025-01-20",
    location: "London, UK",
    registrationLink: "https://blockchainsummit.com/register",
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof eventsData)[0] | null>(null);

  const handleEventClick = (event: (typeof eventsData)[0]) => {
    setSelectedEvent(event);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

  if (selectedEvent) {
    return (
      <div className="p-4">
        <Button variant="outline" className="mb-4" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{selectedEvent.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>
            <p className="text-sm font-semibold">Date: {selectedEvent.date}</p>
            <p className="text-sm font-semibold">Location: {selectedEvent.location}</p>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => window.open(selectedEvent.registrationLink, "_blank")}
            >
              Register
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4">
      {eventsData.map((event) => (
        <Card
          key={event.id}
          className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleEventClick(event)}
        >
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{event.description}</p>
          </CardContent>
          <CardFooter>
            <Button className="bg-black text-white hover:bg-gray-800">Register</Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}
