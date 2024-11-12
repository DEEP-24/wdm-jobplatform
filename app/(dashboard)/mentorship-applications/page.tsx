"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface MentorshipApplication {
  id: string;
  mentee: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      imageUrl?: string;
    };
    email: string;
  };
  academicLevel: string;
  fieldOfStudy: string;
  careerGoals: string;
  areasOfInterest: string;
  expectedGraduationDate: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function MentorshipApplicationsPage() {
  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndFetchApplications = async () => {
      try {
        // Check if user is mentor
        const authResponse = await fetch("/api/auth/check");
        const authData = await authResponse.json();

        if (!authData.authenticated) {
          window.location.href = "/login";
          return;
        }

        setIsMentor(authData.user.role === "MENTOR");

        // Fetch applications
        const response = await fetch("/api/mentorship-sessions");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndFetchApplications();
  }, [toast]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/mentorship-sessions/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus as any } : app)),
      );

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!isMentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only mentors can access this page. Please contact support if you think this is an
              error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Mentorship Applications</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.mentee.profile.imageUrl} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {`${application.mentee.profile.firstName[0]}${application.mentee.profile.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {`${application.mentee.profile.firstName} ${application.mentee.profile.lastName}`}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{application.mentee.email}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Academic Level</p>
                    <p>{application.academicLevel}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Field of Study</p>
                    <p>{application.fieldOfStudy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Graduation Date</p>
                    <p>{format(new Date(application.expectedGraduationDate), "MMM yyyy")}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Applied On</p>
                    <p>{format(new Date(application.createdAt), "dd MMM yyyy")}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mb-1">Career Goals</p>
                  <p className="text-sm line-clamp-2">{application.careerGoals}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mb-1">Areas of Interest</p>
                  <p className="text-sm">{application.areasOfInterest}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mb-1">Message</p>
                  <p className="text-sm line-clamp-3">{application.message}</p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-600">Status</p>
                    <Badge className={statusColors[application.status]}>{application.status}</Badge>
                  </div>

                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) => handleStatusChange(application.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accept</SelectItem>
                      <SelectItem value="REJECTED">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}

          {applications.length === 0 && (
            <div className="col-span-full">
              <Card className="bg-white shadow-lg text-center py-10">
                <CardContent>
                  <p className="text-xl font-semibold text-purple-800">No Applications Yet</p>
                  <p className="text-gray-600 mt-2">
                    You haven't received any mentorship applications yet.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
