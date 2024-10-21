"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Poppins } from "next/font/google";
import { ScrollArea } from "@/components/ui/scroll-area";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Application {
  id: string;
  name: string;
  email: string;
  mentor: string;
  message: string;
  submittedAt: string;
}

export default function MentorshipProgramPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [mentors, setMentors] = useState<Record<string, any>>({});

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("mentorshipApplications") || "[]");
    setApplications(storedApplications);

    const storedMentors = JSON.parse(localStorage.getItem("mentors") || "[]");
    const mentorsMap = storedMentors.reduce((acc: Record<string, any>, mentor: any) => {
      acc[mentor.id] = mentor;
      return acc;
    }, {});
    setMentors(mentorsMap);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 text-center mb-8">
          Mentorship Applications
        </h1>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card
                key={application.id}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-purple-800">{application.name}</CardTitle>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{application.email}</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <ScrollArea className="h-32 mb-4">
                    <p className="text-sm text-gray-700">{application.message}</p>
                  </ScrollArea>
                  {mentors[application.mentor] && (
                    <div className="flex items-center mt-4 bg-gray-50 p-3 rounded-lg">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage
                          src={mentors[application.mentor].imageUrl}
                          alt={mentors[application.mentor].name}
                        />
                        <AvatarFallback className="bg-purple-200 text-purple-800 font-semibold">
                          {mentors[application.mentor].name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-purple-800">
                          {mentors[application.mentor].name}
                        </p>
                        <p className="text-sm text-gray-600">{mentors[application.mentor].title}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-lg text-center py-10">
            <CardContent className="space-y-4">
              <p className="text-xl font-semibold text-purple-800">No applications submitted yet</p>
              <p className="text-gray-600">
                Applications will appear here once students start applying for mentorship.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
