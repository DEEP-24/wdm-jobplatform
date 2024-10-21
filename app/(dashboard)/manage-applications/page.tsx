"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobApplication {
  id: string;
  jobID: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  resumeURL: string;
  coverLetterURL: string;
  linkedinURL: string;
  additionalDocumentsR2URL: string;
  applicationStatus: string;
  submittedAt: string;
  lastUpdated: string;
  notes: string;
}

const statusOptions = ["Under Review", "Interview Scheduled", "Hired", "Rejected"];

export default function ManageApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedApplications: JobApplication[] = JSON.parse(
      localStorage.getItem("appliedJobs") || "[]",
    );
    const updatedApplications = storedApplications.map((app) => ({
      ...app,
      applicationStatus: app.applicationStatus || "Under Review",
    }));
    setApplications(updatedApplications);
    if (updatedApplications.length > 0) {
      setSelectedApplication(updatedApplications[0]);
    }
    localStorage.setItem("appliedJobs", JSON.stringify(updatedApplications));
  }, []);

  const updateApplicationStatus = (id: string, newStatus: string) => {
    const updatedApplications = applications.map((app) =>
      app.id === id
        ? { ...app, applicationStatus: newStatus, lastUpdated: new Date().toISOString() }
        : app,
    );
    setApplications(updatedApplications);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedApplications));
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        applicationStatus: newStatus,
        lastUpdated: new Date().toISOString(),
      });
    }
    toast({
      title: "Application Status Updated",
      description: `Status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-800">Manage Applications</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            <Link href="/post-job">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/job-listings">View Job Listings</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="p-0">
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="w-full justify-start bg-gray-100 border-b border-gray-200 rounded-t-lg">
              <TabsTrigger value="applications" className="data-[state=active]:bg-white">
                Applications
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="m-0">
              <ScrollArea className="h-[calc(100vh-250px)]">
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <Card
                      key={application.id}
                      className={`m-2 cursor-pointer transition-all duration-200 ${
                        selectedApplication?.id === application.id
                          ? "border-purple-500 shadow-md"
                          : "hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-800">
                          {application.applicantName || "Unknown Applicant"}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{application.jobTitle}</p>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline" className="mr-2 bg-purple-100 text-purple-800">
                          {application.applicationStatus}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2">
                          Applied on: {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xl font-semibold mb-4 text-gray-600">
                      No applications received yet
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="details" className="m-0">
              <ScrollArea className="h-[calc(100vh-250px)] p-4 sm:p-6">
                {selectedApplication ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2 text-purple-800">
                        {selectedApplication.applicantName || "Unknown Applicant"}
                      </h2>
                      <p className="text-lg text-gray-600">{selectedApplication.jobTitle}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Application Status</p>
                        <Select
                          value={selectedApplication.applicationStatus}
                          onValueChange={(value) =>
                            updateApplicationStatus(selectedApplication.id, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-purple-700">{selectedApplication.applicantEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Submitted On</p>
                        <p>{new Date(selectedApplication.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                        <p>{new Date(selectedApplication.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <ApplicationLink label="Resume" url={selectedApplication.resumeURL} />
                      <ApplicationLink
                        label="Cover Letter"
                        url={selectedApplication.coverLetterURL}
                      />
                      <ApplicationLink
                        label="LinkedIn Profile"
                        url={selectedApplication.linkedinURL}
                      />
                      <ApplicationLink
                        label="Additional Documents"
                        url={selectedApplication.additionalDocumentsR2URL}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
                        {selectedApplication.notes || "No notes available."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xl font-semibold mb-4 text-gray-600">
                      Select an application to view details
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationLink({ label, url }: { label: string; url: string }) {
  if (!url) {
    return null;
  }
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 hover:text-purple-800 hover:underline flex items-center"
      >
        View {label} <ExternalLink className="h-4 w-4 ml-1" />
      </a>
    </div>
  );
}
