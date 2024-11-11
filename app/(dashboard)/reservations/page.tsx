"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Info, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { getEventTypeLabel } from "@/lib/event-type-labels";
import { format } from "date-fns";
import type { EventType } from "@prisma/client";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  sessionId: string;
  event: {
    id: string;
    title: string;
    description: string;
    eventType: string;
    startDate: Date;
    endDate: Date;
    location: string;
  };
  session: {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
  };
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/academic-events/registrations");
      console.log("Fetch response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch reservations");
      }

      const data = await response.json();
      console.log("Fetched reservations:", data);
      setReservations(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load your reservations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      console.log("Attempting to cancel reservation:", reservationId);

      if (!reservationId) {
        throw new Error("Invalid reservation ID");
      }

      const url = new URL(`/api/academic-events/register/${reservationId}`, window.location.origin);
      console.log("Request URL:", url.toString());

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Cancel response status:", response.status);

      const data = await response.json();
      console.log("Cancel response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel reservation");
      }

      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      toast({
        title: "Success",
        description: "Your reservation has been cancelled successfully",
      });
    } catch (error) {
      console.error("Cancel reservation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel the reservation",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 ${poppins.className}`}
    >
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-purple-700 text-white p-6">
            <CardTitle className="text-3xl font-bold">Your Reservations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 mb-4">You don't have any reservations yet.</p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push("/academic-events")}
                >
                  Browse Events
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
                  >
                    <CardHeader className="bg-purple-600 text-white p-4">
                      <div className="flex flex-col gap-2">
                        <CardTitle className="text-xl font-semibold break-words">
                          {reservation.event.title}
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit bg-white text-purple-600">
                          {getEventTypeLabel(reservation.event.eventType as EventType)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-purple-800 mb-2">
                            {reservation.session.title}
                          </h3>
                          <p className="text-sm text-gray-600">{reservation.session.description}</p>
                        </div>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                            <span>
                              {format(new Date(reservation.event.startDate), "MMM d, yyyy")} -{" "}
                              {format(new Date(reservation.event.endDate), "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                            <span>
                              {format(new Date(reservation.session.startTime), "h:mm a")} -{" "}
                              {format(new Date(reservation.session.endTime), "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                            <span className="break-words">{reservation.session.location}</span>
                          </div>
                          <div className="flex items-start">
                            <Info className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0 mt-1" />
                            <span className="break-words">{reservation.event.description}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent className="p-4 bg-gray-50">
                      <Button
                        variant="destructive"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        <X className="w-4 h-4 mr-2" /> Cancel Reservation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
