"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Info, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

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
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">You don't have any reservations yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map((reservation) => (
                <Card key={reservation.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      {reservation.eventTitle}
                      <Badge variant="default" className="ml-2">
                        {reservation.eventType}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{reservation.sessionTitle}</h3>
                      <p className="text-sm text-gray-600">{reservation.sessionDescription}</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(reservation.eventStartDate).toLocaleDateString()} -{" "}
                        {new Date(reservation.eventEndDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(reservation.sessionStartTime).toLocaleTimeString()} -{" "}
                        {new Date(reservation.sessionEndTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {reservation.sessionLocation}
                      </div>
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-2" />
                        Event: {reservation.eventDescription}
                      </div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0 space-y-2">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancel Reservation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
