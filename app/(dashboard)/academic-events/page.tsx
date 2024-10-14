"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, Clock, MapPin, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  eventType: "Conference" | "Workshop" | "Seminar";
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  registrationDeadline: string;
  status: string;
  sessions: {
    id: string;
    eventId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    maxAttendees: number;
  }[];
}

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const createDefaultEvents = () => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return [
    {
      id: "1",
      title: "AI in Academia Conference 2024",
      description: "Annual gathering of AI researchers and academics.",
      eventType: "Conference",
      startDate: formatDate(today),
      endDate: formatDate(tomorrow),
      location: "Stanford University, CA",
      isVirtual: false,
      maxAttendees: 500,
      registrationDeadline: formatDate(today),
      status: "Upcoming",
      sessions: [
        {
          id: "101",
          eventId: "1",
          title: "Keynote: Future of AI in Education",
          description: "Opening keynote discussing the impact of AI on education.",
          startTime: `${formatDate(today)}T09:00:00`,
          endTime: `${formatDate(today)}T10:30:00`,
          location: "Main Auditorium",
          maxAttendees: 500,
        },
        {
          id: "102",
          eventId: "1",
          title: "Workshop: Implementing AI in Curriculum",
          description: "Hands-on workshop on integrating AI into academic curricula.",
          startTime: `${formatDate(today)}T11:00:00`,
          endTime: `${formatDate(today)}T13:00:00`,
          location: "Workshop Room A",
          maxAttendees: 50,
        },
      ],
    },
    {
      id: "2",
      title: "Data Science in Research Symposium",
      description: "Exploring the role of data science in academic research.",
      eventType: "Conference",
      startDate: formatDate(today),
      endDate: formatDate(tomorrow),
      location: "MIT, Cambridge, MA",
      isVirtual: false,
      maxAttendees: 300,
      registrationDeadline: formatDate(today),
      status: "Upcoming",
      sessions: [
        {
          id: "201",
          eventId: "2",
          title: "Data Visualization Techniques",
          description: "Advanced techniques for visualizing complex research data.",
          startTime: `${formatDate(today)}T10:00:00`,
          endTime: `${formatDate(today)}T12:00:00`,
          location: "Lecture Hall 1",
          maxAttendees: 100,
        },
      ],
    },
    {
      id: "3",
      title: "Academic Writing Workshop",
      description: "Improving academic writing skills for researchers and students.",
      eventType: "Workshop",
      startDate: formatDate(tomorrow),
      endDate: formatDate(tomorrow),
      location: "Online",
      isVirtual: true,
      maxAttendees: 100,
      registrationDeadline: formatDate(today),
      status: "Upcoming",
      sessions: [
        {
          id: "301",
          eventId: "3",
          title: "Effective Academic Writing Techniques",
          description: "Learn strategies for clear and impactful academic writing.",
          startTime: `${formatDate(tomorrow)}T14:00:00`,
          endTime: `${formatDate(tomorrow)}T16:00:00`,
          location: "Virtual Room 1",
          maxAttendees: 100,
        },
      ],
    },
  ];
};

const eventTypes = ["Conference", "Workshop", "Seminar"] as const;
type EventType = (typeof eventTypes)[number];

export default function AcademicEventsPage() {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [registeredSessions, setRegisteredSessions] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<EventType | "All">("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Always create new default events based on the current date
    const defaultEvents = createDefaultEvents();

    // Check if there are any stored events
    let storedEvents = JSON.parse(localStorage.getItem("academicEvents") || "[]");

    // If there are no stored events, or if we want to always use fresh data,
    // use the default events
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    if (storedEvents.length === 0 || true) {
      // Remove '|| true' if you want to keep stored events
      storedEvents = defaultEvents;
      localStorage.setItem("academicEvents", JSON.stringify(storedEvents));
    }

    setEvents(storedEvents);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(storedUser);

    if (storedUser) {
      const reservations = JSON.parse(localStorage.getItem("academicEventReservations") || "[]");
      const userReservations = reservations.filter((r: any) => r.userId === storedUser.id);
      setRegisteredSessions(userReservations.map((r: any) => r.sessionId));
    }
  }, []);

  const handleRegister = (eventId: string, sessionId: string) => {
    const event = events.find((e) => e.id === eventId);
    const session = event?.sessions.find((s) => s.id === sessionId);
    if (session && event) {
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
          title: "Already Registered",
          description: "You have already registered for this session.",
          variant: "default",
        });
        return;
      }

      const reservation = {
        id: uuidv4(),
        userId: currentUser.id,
        eventId: event.id,
        eventTitle: event.title,
        eventDescription: event.description,
        eventType: event.eventType,
        eventStartDate: event.startDate,
        eventEndDate: event.endDate,
        eventLocation: event.location,
        sessionId: session.id,
        sessionTitle: session.title,
        sessionDescription: session.description,
        sessionStartTime: session.startTime,
        sessionEndTime: session.endTime,
        sessionLocation: session.location,
      };

      const reservations = JSON.parse(localStorage.getItem("academicEventReservations") || "[]");
      reservations.push(reservation);
      localStorage.setItem("academicEventReservations", JSON.stringify(reservations));

      setRegisteredSessions((prev) => [...prev, sessionId]);
      toast({
        title: "Registration Successful",
        description: `You have been registered for the session: ${session.title}`,
      });

      router.push("/reservations");
    }
  };

  const handleAddEvent = () => {
    router.push("/add-academic-event");
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId],
    );
  };

  const filteredEvents =
    selectedType === "All" ? events : events.filter((event) => event.eventType === selectedType);

  const calendarEvents = filteredEvents.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return (
      selectedDate && (isSameDay(selectedDate, eventStart) || isSameDay(selectedDate, eventEnd))
    );
  });

  return (
    <div className="w-full">
      <div className="bg-gray-100 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-3xl font-bold">Upcoming Academic Events</h2>
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <Select
              onValueChange={(value) => setSelectedType(value as EventType | "All")}
              defaultValue="All"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentUser?.role === "organizer" && (
              <Button onClick={handleAddEvent}>
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex justify-center items-start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className={cn(
                "rounded-md border",
                "bg-white", // Ensure white background
                "shadow-sm", // Add a subtle shadow for definition
              )}
            />
          </div>
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>
                Events on {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                {calendarEvents.length > 0 ? (
                  calendarEvents.map((event) => (
                    <Card key={event.id} className="mb-3 hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{event.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEventExpansion(event.id)}
                          >
                            {expandedEvents.includes(event.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="default" className="mb-2">
                          {event.eventType}
                        </Badge>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm">
                            {event.startDate} to {event.endDate}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm">{event.location}</p>
                        </div>
                        {expandedEvents.includes(event.id) && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Sessions:</h4>
                            {event.sessions.map((session) => (
                              <div key={session.id} className="mb-4 p-4 bg-gray-50 rounded-md">
                                <h5 className="font-medium">{session.title}</h5>
                                <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                                <div className="flex items-center mb-2">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <p className="text-sm">
                                    {format(parseISO(session.startTime), "h:mm a")} -{" "}
                                    {format(parseISO(session.endTime), "h:mm a")}
                                  </p>
                                </div>
                                <div className="flex items-center mb-2">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                  <p className="text-sm">{session.location}</p>
                                </div>
                                {currentUser?.role === "student" && (
                                  <Button
                                    className="mt-2 w-full"
                                    onClick={() => handleRegister(event.id, session.id)}
                                    disabled={registeredSessions.includes(session.id)}
                                  >
                                    {registeredSessions.includes(session.id)
                                      ? "Already Registered"
                                      : "Register for Session"}
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No events on this date.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
