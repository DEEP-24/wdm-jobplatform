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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDate } from "@/hooks/misc";
import { useToast } from "@/hooks/use-toast";
import { getEventTypeLabel } from "@/lib/event-type-labels";
import { cn } from "@/lib/utils";
import { EventType, UserRole } from "@prisma/client";
import { format, parseISO } from "date-fns";
import { Clock, MapPin, Plus } from "lucide-react";
import { Montserrat, Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import * as React from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
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

const eventTypes = Object.values(EventType);
type EventTypeWithAll = EventType | "All";

export default function AcademicEventsPage() {
  const [events, setEvents] = React.useState<AcademicEvent[]>([]);
  const [registeredSessions, setRegisteredSessions] = React.useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedType, setSelectedType] = React.useState<EventTypeWithAll>("All");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [currentUser, setCurrentUser] = React.useState<{
    id: string;
    role: UserRole;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<AcademicEvent | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/academic-events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to load academic events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserAndRegistrations = async () => {
      try {
        // Fetch current user using the auth check endpoint
        const userResponse = await fetch("/api/auth/check");
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.authenticated && userData.user) {
            setCurrentUser({
              id: userData.user.id,
              role: userData.user.role, // This will now get the correct role from auth check
            });

            // Fetch user's registrations
            // const registrationsResponse = await fetch("/api/academic-events/registrations");
            // if (registrationsResponse.ok) {
            //   const registrationsData = await registrationsResponse.json();
            //   setRegisteredSessions(registrationsData.map((r: any) => r.sessionId));
            // }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchEvents();
    fetchUserAndRegistrations();
  }, [toast]);

  const handleRegister = async (eventId: string, sessionId: string) => {
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

    try {
      const response = await fetch("/api/academic-events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      setRegisteredSessions((prev) => [...prev, sessionId]);
      toast({
        title: "Registration Successful",
        description: "You have been registered for the session",
      });

      router.push("/reservations");
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to register for the session",
        variant: "destructive",
      });
    }
  };

  const filteredEvents =
    selectedType === "All" ? events : events.filter((event) => event.eventType === selectedType);

  const calendarEvents = filteredEvents.filter((event) => {
    const eventStart = parseISO(event.startDate);
    const eventEnd = parseISO(event.endDate);
    return (
      selectedDate &&
      selectedDate.setHours(0, 0, 0, 0) >= eventStart.setHours(0, 0, 0, 0) &&
      selectedDate.setHours(0, 0, 0, 0) <= eventEnd.setHours(0, 0, 0, 0)
    );
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className={`w-full ${openSans.className}`}>
      <div className="bg-purple-500 text-white p-6 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <h2 className={`text-3xl font-bold ${montserrat.className}`}>Upcoming Academic Events</h2>
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <Select
              onValueChange={(value) => setSelectedType(value as EventTypeWithAll)}
              defaultValue="All"
            >
              <SelectTrigger className="w-[180px] bg-white text-purple-900">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getEventTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentUser?.role === UserRole.ORGANIZER && (
              <Button
                onClick={() => router.push("/add-event")}
                className="bg-white text-purple-700 hover:bg-purple-100"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6">
          <div className="w-full flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className={cn("rounded-md border", "bg-white", "shadow-md")}
            />
          </div>
          <Card className="w-full bg-white shadow-lg">
            <CardHeader>
              <CardTitle className={`text-2xl ${montserrat.className}`}>
                Events on {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                {calendarEvents.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {calendarEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500"
                      >
                        <CardHeader>
                          <CardTitle className={`text-lg ${montserrat.className}`}>
                            {event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="mb-2">
                            {getEventTypeLabel(event.eventType)}
                          </Badge>
                          <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <p className="text-sm">
                              {format(new Date(event.startDate), "MMM d, yyyy")} -{" "}
                              {format(new Date(event.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center mb-4">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <p className="text-sm">{event.location}</p>
                          </div>
                          <div className="space-y-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  View Details
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:w-[540px] lg:w-[720px] max-w-[90vw]">
                                <SheetHeader>
                                  <SheetTitle className={`text-2xl ${montserrat.className}`}>
                                    {selectedEvent?.title}
                                  </SheetTitle>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                                  <SheetDescription>
                                    {selectedEvent && (
                                      <>
                                        <Badge variant="secondary" className="mb-2">
                                          {getEventTypeLabel(selectedEvent.eventType)}
                                        </Badge>
                                        <p className="text-sm text-gray-600 mb-2">
                                          {selectedEvent.description}
                                        </p>
                                        <div className="flex items-center mb-2">
                                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                          <p className="text-sm">
                                            {format(
                                              new Date(selectedEvent.startDate),
                                              "MMM d, yyyy",
                                            )}{" "}
                                            -{" "}
                                            {format(new Date(selectedEvent.endDate), "MMM d, yyyy")}
                                          </p>
                                        </div>
                                        <div className="flex items-center mb-4">
                                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                          <p className="text-sm">{selectedEvent.location}</p>
                                        </div>
                                        <h4
                                          className={`font-semibold mb-2 text-lg ${montserrat.className}`}
                                        >
                                          Sessions:
                                        </h4>
                                        {/* Sort sessions by title number */}
                                        {[...selectedEvent.sessions]
                                          .sort((a, b) => {
                                            const aNum = Number.parseInt(a.title.split(" ")[1]);
                                            const bNum = Number.parseInt(b.title.split(" ")[1]);
                                            return aNum - bNum;
                                          })
                                          .map((session) => (
                                            <div
                                              key={session.id}
                                              className="mb-4 p-4 bg-gray-50 rounded-md"
                                            >
                                              <h5 className={`font-medium ${montserrat.className}`}>
                                                {session.title}
                                              </h5>
                                              <p className="text-sm text-gray-600 mb-2">
                                                {session.description}
                                              </p>
                                              <div className="flex items-center mb-2">
                                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                                <p className="text-sm">
                                                  {format(
                                                    new Date(session.startTime),
                                                    "MMM d, yyyy h:mm a",
                                                  )}{" "}
                                                  - {format(new Date(session.endTime), "h:mm a")}
                                                </p>
                                              </div>
                                              <div className="flex items-center mb-2">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                <p className="text-sm">{session.location}</p>
                                              </div>
                                              {currentUser?.role === UserRole.USER && (
                                                <Button
                                                  className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
                                                  onClick={() =>
                                                    handleRegister(selectedEvent.id, session.id)
                                                  }
                                                  disabled={registeredSessions.includes(session.id)}
                                                >
                                                  {registeredSessions.includes(session.id)
                                                    ? "Already Registered"
                                                    : "Register for Session"}
                                                </Button>
                                              )}
                                            </div>
                                          ))}
                                      </>
                                    )}
                                  </SheetDescription>
                                </ScrollArea>
                              </SheetContent>
                            </Sheet>
                            {currentUser?.role === UserRole.ORGANIZER && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => router.push(`/edit-event/${event.id}`)}
                              >
                                Edit Event
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
