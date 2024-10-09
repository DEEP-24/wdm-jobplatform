"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for events and sessions
const eventsData = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual gathering of tech enthusiasts and industry leaders.",
    eventType: "Conference",
    startDate: "2024-11-15",
    endDate: "2024-11-17",
    location: "San Francisco, CA",
    isVirtual: false,
    maxAttendees: 1000,
    registrationDeadline: "2024-11-01",
    status: "Upcoming",
    sessions: [
      {
        id: "101",
        eventId: "1",
        title: "Keynote: Future of AI",
        description: "Opening keynote discussing the future of Artificial Intelligence.",
        startTime: "2024-11-15T09:00:00",
        endTime: "2024-11-15T10:30:00",
        location: "Main Hall",
        maxAttendees: 1000,
      },
      {
        id: "102",
        eventId: "1",
        title: "Workshop: Blockchain Basics",
        description: "Hands-on workshop introducing blockchain technology.",
        startTime: "2024-11-15T11:00:00",
        endTime: "2024-11-15T13:00:00",
        location: "Workshop Room A",
        maxAttendees: 50,
      },
    ],
  },
  {
    id: "2",
    title: "AI Symposium",
    description: "Exploring cutting-edge advancements in Artificial Intelligence.",
    eventType: "Symposium",
    startDate: "2024-12-05",
    endDate: "2024-12-07",
    location: "New York, NY",
    isVirtual: false,
    maxAttendees: 500,
    registrationDeadline: "2024-11-20",
    status: "Upcoming",
    sessions: [
      {
        id: "201",
        eventId: "2",
        title: "Machine Learning in Practice",
        description: "Real-world applications of machine learning algorithms.",
        startTime: "2024-12-05T10:00:00",
        endTime: "2024-12-05T12:00:00",
        location: "Lecture Hall 1",
        maxAttendees: 200,
      },
    ],
  },
  {
    id: "3",
    title: "Virtual Blockchain Summit",
    description: "Online summit focusing on blockchain technology and its applications.",
    eventType: "Summit",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    location: "Online",
    isVirtual: true,
    maxAttendees: 2000,
    registrationDeadline: "2025-01-15",
    status: "Upcoming",
    sessions: [
      {
        id: "301",
        eventId: "3",
        title: "Decentralized Finance (DeFi) Explained",
        description: "An in-depth look at the growing field of decentralized finance.",
        startTime: "2025-01-20T14:00:00",
        endTime: "2025-01-20T15:30:00",
        location: "Virtual Room 1",
        maxAttendees: 500,
      },
    ],
  },
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof eventsData)[0] | null>(null);
  const { toast } = useToast();

  const handleEventClick = (event: (typeof eventsData)[0]) => {
    setSelectedEvent(event);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

  const handleRegister = () => {
    // Here you would typically make an API call to register the user
    // For now, we'll just show a success toast
    toast({
      title: "Registration Successful",
      description: "You have been registered for the event.",
    });
  };

  if (selectedEvent) {
    return (
      <div className="p-4">
        <Button variant="outline" className="mb-4" onClick={handleBackClick}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{selectedEvent.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>
            <p className="text-sm font-semibold">
              Date: {selectedEvent.startDate} to {selectedEvent.endDate}
            </p>
            <p className="text-sm font-semibold">Location: {selectedEvent.location}</p>
            <p className="text-sm font-semibold">Type: {selectedEvent.eventType}</p>
            <p className="text-sm font-semibold">Max Attendees: {selectedEvent.maxAttendees}</p>
            <p className="text-sm font-semibold">
              Registration Deadline: {selectedEvent.registrationDeadline}
            </p>
          </CardContent>
        </Card>
        <h3 className="text-xl font-bold mb-4">Sessions</h3>
        <ScrollArea className="h-[50vh]">
          {selectedEvent.sessions.map((session) => (
            <Card key={session.id} className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">{session.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                <p className="text-sm font-semibold">
                  Time: {new Date(session.startTime).toLocaleString()} -{" "}
                  {new Date(session.endTime).toLocaleString()}
                </p>
                <p className="text-sm font-semibold">Location: {session.location}</p>
                <p className="text-sm font-semibold">Max Attendees: {session.maxAttendees}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
        <Button
          className="w-full mt-4 bg-black text-white hover:bg-gray-800"
          onClick={() => handleRegister()}
        >
          Register for Event
        </Button>
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
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
            <p className="text-sm font-semibold">
              Date: {event.startDate} to {event.endDate}
            </p>
            <p className="text-sm font-semibold">Location: {event.location}</p>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  );
}
