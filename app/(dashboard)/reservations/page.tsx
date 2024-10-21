"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Info, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { ScrollArea } from "@/components/ui/scroll-area";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventType: string;
  sessionId: string;
  sessionTitle: string;
  sessionDescription: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionLocation: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const allReservations: Reservation[] = JSON.parse(
        localStorage.getItem("academicEventReservations") || "[]",
      );
      const userReservations = allReservations.filter((r) => r.userId === currentUser.id);
      setReservations(userReservations);
    }
  }, []);

  const handleCancelReservation = (reservationId: string) => {
    const updatedReservations = reservations.filter((r) => r.id !== reservationId);
    setReservations(updatedReservations);

    const allReservations: Reservation[] = JSON.parse(localStorage.getItem("reservations") || "[]");
    const updatedAllReservations = allReservations.filter((r) => r.id !== reservationId);
    localStorage.setItem("academicEventReservations", JSON.stringify(updatedAllReservations));

    toast({
      title: "Reservation Cancelled",
      description: "Your reservation has been successfully cancelled.",
    });
  };

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
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
                      <CardTitle className="text-xl font-semibold flex items-center justify-between">
                        <span className="truncate">{reservation.eventTitle}</span>
                        <Badge variant="secondary" className="ml-2 bg-white text-purple-600">
                          {reservation.eventType}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4 space-y-4">
                      <ScrollArea className="h-40">
                        <div>
                          <h3 className="text-lg font-medium mb-2 text-purple-800">
                            {reservation.sessionTitle}
                          </h3>
                          <p className="text-sm text-gray-600">{reservation.sessionDescription}</p>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mt-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                            {new Date(reservation.eventStartDate).toLocaleDateString()} -{" "}
                            {new Date(reservation.eventEndDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-purple-600" />
                            {new Date(reservation.sessionStartTime).toLocaleTimeString()} -{" "}
                            {new Date(reservation.sessionEndTime).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                            {reservation.sessionLocation}
                          </div>
                          <div className="flex items-start">
                            <Info className="w-4 h-4 mr-2 text-purple-600 mt-1" />
                            <span>Event: {reservation.eventDescription}</span>
                          </div>
                        </div>
                      </ScrollArea>
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
