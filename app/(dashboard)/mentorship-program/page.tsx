"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

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
    <div className="space-y-6 p-4 sm:p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mentorship Applications</h1>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{application.name}</CardTitle>
                  <Badge variant="secondary">
                    {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{application.email}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">{application.message}</p>
                {mentors[application.mentor] && (
                  <div className="flex items-center mt-4">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage
                        src={mentors[application.mentor].imageUrl}
                        alt={mentors[application.mentor].name}
                      />
                      <AvatarFallback>
                        {mentors[application.mentor].name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{mentors[application.mentor].name}</p>
                      <p className="text-sm text-gray-500">{mentors[application.mentor].title}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl font-semibold mb-4">No applications submitted yet</p>
          <p className="text-gray-600">
            Applications will appear here once students start applying for mentorship.
          </p>
        </div>
      )}
    </div>
  );
}
