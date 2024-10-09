"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Mock data for mentorship programs
const mentorshipProgramsData = [
  {
    id: "1",
    name: "Tech Leadership Mentorship",
    description:
      "A program designed to develop future tech leaders through one-on-one mentorship with industry experts.",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    programType: "One-on-One",
    maxParticipants: 50,
    status: "Open",
    createdBy: "Admin1",
    createdAt: "2023-11-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Women in STEM Mentorship",
    description:
      "Empowering women in STEM fields through mentorship, networking, and skill development.",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    programType: "Group",
    maxParticipants: 100,
    status: "Open",
    createdBy: "Admin2",
    createdAt: "2023-11-15T00:00:00Z",
  },
  {
    id: "3",
    name: "Early Career Developer Mentorship",
    description:
      "Guiding early career developers in building their skills and navigating the tech industry.",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    programType: "One-on-One",
    maxParticipants: 75,
    status: "Open",
    createdBy: "Admin1",
    createdAt: "2023-12-01T00:00:00Z",
  },
];

export default function MentorshipProgramsPage() {
  const { toast } = useToast();
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>([]);

  const handleEnroll = (programId: string) => {
    if (enrolledPrograms.includes(programId)) {
      toast({
        title: "Already Enrolled",
        description: "You are already enrolled in this program.",
      });
    } else {
      setEnrolledPrograms([...enrolledPrograms, programId]);
      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in the mentorship program.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {mentorshipProgramsData.map((program) => (
        <Card key={program.id} className="mb-4">
          <CardHeader>
            <CardTitle>{program.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Start Date:</strong> {program.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {program.endDate}
              </p>
              <p>
                <strong>Type:</strong> {program.programType}
              </p>
              <p>
                <strong>Max Participants:</strong> {program.maxParticipants}
              </p>
              <p>
                <strong>Status:</strong> {program.status}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => handleEnroll(program.id)}
              disabled={enrolledPrograms.includes(program.id)}
            >
              {enrolledPrograms.includes(program.id) ? "Enrolled" : "Enroll"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
