"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import type { Job } from "@/app/types/job";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobList, setShowJobList] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const jobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(jobs);
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, []);

  const removeJob = (jobId: string) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
    setSavedJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    toast({
      title: "Job Removed",
      description: "The job has been removed from your saved list.",
    });
    if (updatedJobs.length > 0) {
      setSelectedJob(updatedJobs[0]);
    } else {
      setSelectedJob(null);
    }
  };

  if (savedJobs.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
        <p className="mb-4">You haven't saved any jobs yet.</p>
        <Link href="/jobs" className="text-blue-600 hover:underline">
          Go to Jobs Page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Job listings */}
      <div
        className={`w-full md:w-1/3 border-r border-gray-200 overflow-hidden ${
          showJobList ? "block" : "hidden md:block"
        }`}
      >
        <ScrollArea className="h-full pr-4 [&>div]:!overflow-x-hidden [&>div>div]:!mr-0">
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              className={`m-2 cursor-pointer ${selectedJob?.id === job.id ? "border-black" : ""}`}
              onClick={() => {
                setSelectedJob(job);
                setShowJobList(false);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-gray-500">{job.company}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                {job.salary && (
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {job.salary}
                  </Badge>
                )}
                {job.type && (
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {job.type}
                  </Badge>
                )}
                {job.workMode && (
                  <Badge variant="secondary" className="mr-2 mb-2">
                    {job.workMode}
                  </Badge>
                )}
                <span className="text-xs mb-2 text-gray-500">{job.postedAgo}</span>
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Job details */}
      {selectedJob && (
        <div
          className={`w-full md:w-2/3 p-6 overflow-auto ${
            showJobList ? "hidden md:block" : "block"
          }`}
        >
          <Button variant="outline" className="mb-4 md:hidden" onClick={() => setShowJobList(true)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Saved Jobs
          </Button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
            <p className="text-lg text-gray-600">{selectedJob.company}</p>
            <div className="flex flex-wrap items-center mt-2">
              <Badge variant="outline" className="mr-2 mb-2">
                {selectedJob.salary || "Salary not specified"}
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2 bg-gray-100">
                {selectedJob.type}
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2 bg-gray-100">
                {selectedJob.workMode}
              </Badge>
              <span className="text-sm mb-2 text-gray-500">{selectedJob.postedAgo}</span>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{selectedJob.fullDescription}</p>
          <div className="flex items-center">
            <Button className="mr-4 bg-black text-white hover:bg-gray-800">Apply</Button>
            <Button
              variant="outline"
              onClick={() => removeJob(selectedJob.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Remove Job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
