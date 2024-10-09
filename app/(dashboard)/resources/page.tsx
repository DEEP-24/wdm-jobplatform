"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, FileTextIcon, ImageIcon, VideoIcon } from "lucide-react";

// Mock data for resources
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
      return <FileIcon className="h-4 w-4" />;
    case "video":
      return <VideoIcon className="h-4 w-4" />;
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    default:
      return <FileTextIcon className="h-4 w-4" />;
  }
};

export default function ResourcePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Resources</CardTitle>
          <CardDescription>
            Browse through our curated list of educational materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resourcesData.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-muted-foreground">{resource.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        {getFileIcon(resource.type)}
                        <span className="ml-2">{resource.type}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
