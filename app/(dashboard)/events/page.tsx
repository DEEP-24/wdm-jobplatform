"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

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
  const [registeredSessions, setRegisteredSessions] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
      const userReservations = reservations.filter((r: any) => r.userId === currentUser.id);
      setRegisteredSessions(userReservations.map((r: any) => r.sessionId));
    }
  }, []);

  const handleEventClick = (event: (typeof eventsData)[0]) => {
    setSelectedEvent(event);
  };

  const handleBackClick = () => {
    setSelectedEvent(null);
  };

  const handleRegister = (sessionId: string) => {
    const session = selectedEvent?.sessions.find((s) => s.id === sessionId);
    if (session && selectedEvent) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to register for events.",
          variant: "destructive",
        });
        return;
      }

      if (registeredSessions.includes(sessionId)) {
        toast({
          title: "Already Reserved",
          description: "You have already reserved this session.",
          variant: "default",
        });
        return;
      }

      const reservation = {
        id: uuidv4(),
        userId: currentUser.id,
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        eventDescription: selectedEvent.description,
        eventStartDate: selectedEvent.startDate,
        eventEndDate: selectedEvent.endDate,
        eventLocation: selectedEvent.location,
        sessionId: session.id,
        sessionTitle: session.title,
        sessionDescription: session.description,
        sessionStartTime: session.startTime,
        sessionEndTime: session.endTime,
        sessionLocation: session.location,
      };

      const reservations = JSON.parse(localStorage.getItem("reservations") || "[]");
      reservations.push(reservation);
      localStorage.setItem("reservations", JSON.stringify(reservations));

      setRegisteredSessions((prev) => [...prev, sessionId]);
      toast({
        title: "Registration Successful",
        description: `You have been registered for the session: ${session.title}`,
      });

      router.push("/reservations");
    }
  };

  if (selectedEvent) {
    return (
      <div className="w-full">
        <div className="bg-gray-100 p-4 mb-6">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" className="hover:bg-gray-200" onClick={handleBackClick}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gray-900 text-white">
              <CardTitle className="text-2xl md:text-3xl">{selectedEvent.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-6">{selectedEvent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-700" />
                  <p className="text-sm">
                    {selectedEvent.startDate} to {selectedEvent.endDate}
                  </p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-700" />
                  <p className="text-sm">{selectedEvent.location}</p>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-700" />
                  <p className="text-sm">Max Attendees: {selectedEvent.maxAttendees}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-700" />
                  <p className="text-sm">Deadline: {selectedEvent.registrationDeadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <h3 className="text-2xl font-bold mb-6">Sessions</h3>
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedEvent.sessions.map((session) => (
                <Card key={session.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gray-300">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 mb-4">{session.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm">
                          {new Date(session.startTime).toLocaleString()} -{" "}
                          {new Date(session.endTime).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm">{session.location}</p>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm">Max Attendees: {session.maxAttendees}</p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => handleRegister(session.id)}
                      disabled={registeredSessions.includes(session.id)}
                    >
                      {registeredSessions.includes(session.id)
                        ? "Already Reserved"
                        : "Register for Session"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gray-100 p-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.map((event) => (
            <Card
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
              onClick={() => handleEventClick(event)}
            >
              <CardHeader className="bg-gray-300">
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-sm">
                    {event.startDate} to {event.endDate}
                  </p>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <p className="text-sm">{event.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
