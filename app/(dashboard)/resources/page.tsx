"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  BookOpenIcon,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Poppins } from "next/font/google";
import Link from "next/link";

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

const resourcesData = [
  {
    id: "1",
    title: "Introduction to React",
    description: "A comprehensive guide to getting started with React",
    type: "PDF",
    tags: ["React", "Frontend", "JavaScript"],
  },
  {
    id: "2",
    title: "CSS Grid Layout Tutorial",
    description: "Learn how to create responsive layouts with CSS Grid",
    type: "Video",
    tags: ["CSS", "Web Design", "Responsive"],
  },
  {
    id: "3",
    title: "JavaScript ES6 Cheat Sheet",
    description: "Quick reference for ES6 features and syntax",
    type: "PDF",
    tags: ["JavaScript", "ES6", "Cheat Sheet"],
  },
  {
    id: "4",
    title: "UI/UX Design Principles",
    description: "Key principles for creating effective user interfaces",
    type: "Image",
    tags: ["UI/UX", "Design", "Infographic"],
  },
  {
    id: "5",
    title: "Git Version Control Basics",
    description: "Understanding the fundamentals of Git for version control",
    type: "Text",
    tags: ["Git", "Version Control", "DevOps"],
  },
];

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileIcon className="h-4 w-4 text-red-500" />;
    case "video":
      return <VideoIcon className="h-4 w-4 text-blue-500" />;
    case "image":
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    default:
      return <FileTextIcon className="h-4 w-4 text-gray-500" />;
  }
};

export default function IntegratedCareerDevelopment() {
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
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8 ${poppins.className}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 text-center mb-4 sm:mb-6 md:mb-8">
          Career Development Center
        </h1>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="mentorship"
              className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
            >
              Mentorship
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2"
            >
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-purple-700 text-white rounded-t-lg p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Career Resources</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    {[
                      "Resume Writing Tips",
                      "Interview Preparation Guide",
                      "Networking Strategies",
                      "Professional Development Workshops",
                      "Career Assessment Tools",
                      "Salary Negotiation Techniques",
                    ].map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <li key={index} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mr-2 text-purple-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 sm:mt-6 bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-purple-700 text-white rounded-t-lg p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">
                    Mentorship Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    Connect with experienced mentors in your field for career guidance and support.
                  </p>
                  <ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    {[
                      "One-on-one mentoring sessions",
                      "Mentor matching based on career goals",
                      "Structured mentorship programs",
                      "Peer mentoring opportunities",
                    ].map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <li key={index} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mr-2 text-purple-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
                    asChild
                  >
                    <Link href="/mentors">Find a Mentor</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
              <CardHeader className="bg-purple-700 text-white p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
                  <BookOpenIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  Learning Resources
                </CardTitle>
                <p className="mt-2 text-xs sm:text-sm text-purple-100">
                  Explore our curated collection of educational materials to enhance your skills.
                </p>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)]">
                  <div className="grid gap-3 sm:gap-4">
                    {resourcesData.map((resource) => (
                      <Card
                        key={resource.id}
                        className="hover:bg-purple-50 transition-colors duration-200"
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex-shrink-0">
                              {getFileIcon(resource.type)}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                                <h3 className="text-sm sm:text-base font-semibold text-purple-800 truncate">
                                  {resource.title}
                                </h3>
                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-1 sm:mt-0">
                                  {resource.type}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                                {resource.description}
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {resource.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs px-1 py-0 sm:px-2 sm:py-1"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-purple-700 text-white p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Mentorship Program</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                  Our mentorship program connects you with experienced professionals in your field
                  of interest. Get personalized guidance, career advice, and support to help you
                  achieve your goals.
                </p>
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-800">
                    Program Benefits:
                  </h3>
                  <ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    {[
                      "One-on-one mentoring sessions with industry experts",
                      "Personalized career development plans",
                      "Networking opportunities with professionals in your field",
                      "Skill-building workshops and seminars",
                      "Resume and portfolio reviews",
                      "Mock interviews and feedback sessions",
                    ].map((benefit, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <li key={index} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mr-2 text-purple-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                      Apply for Mentorship
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
              <CardHeader className="bg-purple-700 text-white p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
                  Mentorship Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)]">
                  {applications.length > 0 ? (
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {applications.map((application) => (
                        <Card
                          key={application.id}
                          className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                          <CardHeader className="border-b border-gray-200 p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-base sm:text-lg text-purple-800">
                                {application.name}
                              </CardTitle>
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 text-xs"
                              >
                                {formatDistanceToNow(new Date(application.submittedAt), {
                                  addSuffix: true,
                                })}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm  text-gray-600">{application.email}</p>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4">
                            <ScrollArea className="h-20 sm:h-24 mb-3 sm:mb-4">
                              <p className="text-xs sm:text-sm text-gray-700">
                                {application.message}
                              </p>
                            </ScrollArea>
                            {mentors[application.mentor] && (
                              <div className="flex items-center mt-2 sm:mt-3 bg-gray-50 p-2 sm:p-3 rounded-lg">
                                <Avatar className="w-10 h-10 mr-3">
                                  <AvatarImage
                                    src={mentors[application.mentor].imageUrl}
                                    alt={mentors[application.mentor].name}
                                  />
                                  <AvatarFallback className="bg-purple-200 text-purple-800 font-semibold text-xs">
                                    {mentors[application.mentor].name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-sm text-purple-800">
                                    {mentors[application.mentor].name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {mentors[application.mentor].title}
                                  </p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-white shadow-lg text-center py-8 sm:py-12">
                      <CardContent className="space-y-3 sm:space-y-4">
                        <UserCircle className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300 mx-auto" />
                        <p className="text-lg sm:text-xl font-semibold text-purple-800">
                          No applications submitted yet
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                          Applications will appear here once students start applying for mentorship.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
