"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, FileTextIcon, ImageIcon, VideoIcon, BookOpenIcon } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
      return <FileIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
    case "video":
      return <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    case "image":
      return <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
    default:
      return <FileTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
  }
};

export default function ResourcePage() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-2 sm:p-4 md:p-6 lg:p-8 ${poppins.className}`}
    >
      <Card className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-purple-700 text-white p-3 sm:p-4 md:p-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
            <BookOpenIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            Learning Resources
          </CardTitle>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-purple-100">
            Explore our curated collection of educational materials to enhance your skills.
          </p>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] md:h-[calc(100vh-220px)]">
            <div className="grid gap-2 sm:gap-4 md:gap-6">
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-purple-800 truncate">
                            {resource.title}
                          </h3>
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-1 sm:mt-0">
                            {resource.type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
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
    </div>
  );
}
