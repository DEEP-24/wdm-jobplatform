"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  imageUrl: string;
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    title: "Senior Data Scientist",
    company: "TechCorp",
    expertise: ["Machine Learning", "AI Ethics", "Data Visualization"],
    bio: "With over 10 years of experience in data science, Dr. Chen specializes in developing ethical AI solutions.",
    imageUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Full Stack Developer",
    company: "WebSolutions Inc.",
    expertise: ["React", "Node.js", "Cloud Architecture"],
    bio: "Michael is passionate about building scalable web applications and mentoring junior developers.",
    imageUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    title: "UX/UI Design Lead",
    company: "DesignMasters",
    expertise: ["User Research", "Interaction Design", "Accessibility"],
    bio: "Sarah has a keen eye for design and a deep understanding of user-centered design principles.",
    imageUrl: "https://i.pravatar.cc/150?img=5",
  },
];

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const storedMentors: Mentor[] = JSON.parse(localStorage.getItem("mentors") || "[]");
    setMentors([...mockMentors, ...storedMentors]);

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsMentor(storedMentors.some((mentor) => mentor.id === user.id));
    }
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Available Mentors</h1>
        {!isMentor && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/become-a-mentor">Become a Mentor</Link>
          </Button>
        )}
      </div>

      {mentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{mentor.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {mentor.title} at {mentor.company}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button className="w-full">Request Mentorship</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl font-semibold mb-4">No mentors available right now</p>
          <p className="text-gray-600 mb-6">Be the first to become a mentor!</p>
          <Button asChild>
            <Link href="/become-a-mentor">Become a Mentor</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
