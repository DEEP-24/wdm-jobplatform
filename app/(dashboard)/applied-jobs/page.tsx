"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useEffect, useState } from "react";

interface JobApplication {
  id: string;
  jobID: string;
  resumeURL: string;
  coverLetterURL: string;
  linkedinURL: string; // Add this line
  additionalDocumentsR2URL: string;
  applicationStatus: string;
  submittedAt: string;
  lastUpdated: string;
  notes: string;
  jobTitle: string;
  jobType: string;
  salary: string;
  workMode: string;
}

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const appliedJobs: JobApplication[] = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setApplications(appliedJobs);
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Applied Jobs</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-bold">
                    {application.jobTitle || "Untitled Job"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p>{new Date(application.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p>{new Date(application.lastUpdated).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Resume</p>
                      <a
                        href={application.resumeURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cover Letter</p>
                      <a
                        href={application.coverLetterURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Cover Letter
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                      <a
                        href={application.linkedinURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View LinkedIn Profile
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Type</p>
                      <p>{application.jobType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salary</p>
                      <p>{application.salary}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Work Mode</p>
                      <p>{application.workMode}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="mt-1 text-sm text-gray-600">{application.notes}</p>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="mr-2">
                      {application.applicationStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl font-semibold mb-4">No jobs applied yet</p>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              Browse available jobs
            </Link>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
