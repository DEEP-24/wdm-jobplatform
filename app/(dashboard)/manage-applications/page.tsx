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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Applications</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/post-job">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/job-listings">View Job Listings</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
        {/* Application list */}
        <div
          className={`w-full md:w-1/3 border-r border-gray-200 overflow-hidden ${
            selectedApplication ? "hidden md:block" : "block"
          }`}
        >
          <ScrollArea className="h-full pr-4">
            {applications.length > 0 ? (
              applications.map((application) => (
                <Card
                  key={application.id}
                  className={`m-2 cursor-pointer ${
                    selectedApplication?.id === application.id ? "border-black" : ""
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {application.applicantName || "Unknown Applicant"}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{application.jobTitle}</p>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="mr-2">
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
                <p className="text-xl font-semibold mb-4">No applications received yet</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Application details */}
        <div
          className={`w-full md:w-2/3 p-4 sm:p-6 overflow-auto ${
            selectedApplication ? "block" : "hidden md:block"
          }`}
        >
          {selectedApplication ? (
            <>
              <Button
                variant="outline"
                className="mb-4 md:hidden"
                onClick={() => setSelectedApplication(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Button>
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedApplication.applicantName || "Unknown Applicant"}
                </h2>
                <p className="text-lg text-gray-600">{selectedApplication.jobTitle}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Application Status</p>
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
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedApplication.applicantEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted On</p>
                  <p>{new Date(selectedApplication.submittedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{new Date(selectedApplication.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <ApplicationLink label="Resume" url={selectedApplication.resumeURL} />
                <ApplicationLink label="Cover Letter" url={selectedApplication.coverLetterURL} />
                <ApplicationLink label="LinkedIn Profile" url={selectedApplication.linkedinURL} />
                <ApplicationLink
                  label="Additional Documents"
                  url={selectedApplication.additionalDocumentsR2URL}
                />
              </div>
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedApplication.notes}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl font-semibold mb-4">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>
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
        className="text-blue-600 hover:underline flex items-center"
      >
        View {label} <ExternalLink className="h-4 w-4 ml-1" />
      </a>
    </div>
  );
}
