"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  BookOpenIcon,
  ChevronRight,
  ExternalLink,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  Pencil,
  Trash2,
  UserCircle,
  VideoIcon,
  Plus,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  url: string;
  tags: string | null;
  user: {
    email: string;
    profile: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "pdf":
      return <FileIcon className="h-4 w-4 text-red-500" />;
    case "video":
      return <VideoIcon className="h-4 w-4 text-blue-500" />;
    case "image":
      return <ImageIcon className="h-4 w-4 text-green-500" />;
    case "article":
      return <FileTextIcon className="h-4 w-4 text-purple-500" />;
    default:
      return <FileTextIcon className="h-4 w-4 text-gray-500" />;
  }
};

export default function IntegratedCareerDevelopment() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; role: UserRole } | null>(null);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [mentors, setMentors] = useState<Record<string, any>>({});
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    type: "",
    url: "",
    tags: "",
  });

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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setCurrentUser({
              id: data.user.id,
              role: data.user.role,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      // Update the resources list with edited data
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === resourceId
            ? {
                ...resource,
                ...editFormData,
              }
            : resource,
        ),
      );

      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      setResourceToEdit(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
      console.error("Error updating resource:", error);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      setResources((prev) => prev.filter((resource) => resource.id !== resourceId));
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      setResourceToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
      console.error("Error deleting resource:", error);
    }
  };

  const renderResourceCard = (resource: Resource) => (
    <Card key={resource.id} className="hover:bg-purple-50 transition-colors duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex-shrink-0">
            {getFileIcon(resource.type || "default")}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-base font-semibold text-purple-800 truncate">
                {resource.title}
              </h3>
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full mt-1 sm:mt-0">
                {resource.type || "Other"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
              {resource.description}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {resource.tags?.split(",").map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs px-1 py-0 sm:px-2 sm:py-1"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  onClick={() => window.open(resource.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
                {currentUser?.role === "ADMIN" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setResourceToEdit(resource);
                        setEditFormData({
                          title: resource.title,
                          description: resource.description || "",
                          type: resource.type || "",
                          url: resource.url,
                          tags: resource.tags || "",
                        });
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setResourceToDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
                      <BookOpenIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                      Learning Resources
                    </CardTitle>
                    <p className="mt-2 text-xs sm:text-sm text-purple-100">
                      Explore our curated collection of educational materials to enhance your
                      skills.
                    </p>
                  </div>
                  {currentUser?.role === "ADMIN" && (
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/add-resource")}
                      className="bg-white text-purple-700 hover:bg-purple-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)]">
                  {isLoadingResources ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 px-4">
                      <BookOpenIcon className="h-16 w-16 text-purple-200 mb-4" />
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">
                        No Resources Available
                      </h3>
                      <p className="text-gray-600 text-center mb-6 max-w-md">
                        {currentUser?.role === "ADMIN"
                          ? "Start building the resource library by adding educational materials."
                          : "Check back later for educational resources and materials."}
                      </p>
                      {currentUser?.role === "ADMIN" && (
                        <Button
                          onClick={() => router.push("/add-resource")}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Resource
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:gap-4">
                      {resources.map((resource) => renderResourceCard(resource))}
                    </div>
                  )}
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
      <Dialog open={!!resourceToEdit} onOpenChange={() => setResourceToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Make changes to the resource details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type">Type</label>
              <Input
                id="type"
                value={editFormData.type}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, type: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url">URL</label>
              <Input
                id="url"
                type="url"
                value={editFormData.url}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="tags">Tags</label>
              <Input
                id="tags"
                value={editFormData.tags}
                onChange={(e) => setEditFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="Separate tags with commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResourceToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={() => resourceToEdit && handleEdit(resourceToEdit.id)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!resourceToDelete} onOpenChange={() => setResourceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResourceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resourceToDelete && handleDelete(resourceToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
