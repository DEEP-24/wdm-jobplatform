"use client";

import type { Job } from "@/app/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import Link from "next/link";

// Default jobs data
const defaultJobs: Job[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "Google",
    description: "We are looking for a skilled Full Stack developer...",
    salary: "$140k/yr",
    postedAgo: "5 hours ago",
    fullDescription:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX and all the major web related technologies...",
    jobType: "onsite",
  },
  {
    id: "2",
    title: "Software Engineer",
    company: "Microsoft",
    description: "We are looking for a skilled Software Engineer...",
    salary: "$120k/yr",
    postedAgo: "3 hours ago",
    fullDescription:
      "We are looking for a skilled Software Engineer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX and all the major web related technologies...",
    jobType: "remote",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Amazon",
    description: "We are looking for a skilled Data Scientist...",
    salary: "$150k/yr",
    postedAgo: "2 hours ago",
    fullDescription:
      "We are looking for a skilled Data Scientist who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX and all the major web related technologies...",
    jobType: "onsite",
  },
];

interface JobApplication {
  id: string;
  jobID: string;
  applicantName: string; // Add this line
  applicantEmail: string; // Add this line
  resumeURL: string;
  coverLetterURL: string;
  linkedinURL: string;
  additionalDocumentsR2URL: string;
  applicationStatus: string;
  submittedAt: string;
  lastUpdated: string;
  notes: string;
  jobTitle: string;
}

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(defaultJobs[0]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    // Load jobs from localStorage
    let storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");

    // Check if default jobs are already in stored jobs
    const defaultJobIds = defaultJobs.map((job) => job.id);
    const existingDefaultJobs = storedJobs.filter((job: Job) => defaultJobIds.includes(job.id));

    // If some default jobs are missing, add them
    if (existingDefaultJobs.length < defaultJobs.length) {
      const missingDefaultJobs = defaultJobs.filter(
        (job) => !storedJobs.some((storedJob: Job) => storedJob.id === job.id),
      );
      storedJobs = [...storedJobs, ...missingDefaultJobs];
      localStorage.setItem("jobs", JSON.stringify(storedJobs));
    }

    setJobs(storedJobs);

    // Load saved and applied jobs
    const savedJobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobIds(new Set(savedJobs.map((job) => job.id)));

    const appliedJobs: JobApplication[] = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setAppliedJobIds(new Set(appliedJobs.map((app) => app.jobID)));

    // Load current user from localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const saveJob = (job: Job) => {
    const savedJobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (!savedJobIds.has(job.id)) {
      savedJobs.push(job);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setSavedJobIds((prevIds) => {
        const newIds = new Set(prevIds);
        newIds.add(job.id);
        return newIds;
      });
      toast({
        title: "Job Saved",
        description: "The job has been added to your saved list.",
      });
    } else {
      toast({
        title: "Job Already Saved",
        description: "This job is already in your saved list.",
        variant: "destructive",
      });
    }
  };

  const onSubmitApplication = (data: any) => {
    if (!selectedJob || !currentUser) {
      return;
    }

    const fullName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobID: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName: fullName,
      applicantEmail: currentUser.email,
      ...data,
      applicationStatus: "Under Review",
      submittedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    const appliedJobs: JobApplication[] = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    appliedJobs.push(newApplication);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    setAppliedJobIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.add(selectedJob.id);
      return newIds;
    });

    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
    });
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Job Opportunities</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/career-development">Explore Career Resources</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/add-job">
              <Plus className="mr-2 h-4 w-4" /> Add Job
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
        {/* Job listings */}
        <div
          className={`w-full md:w-1/3 border-r border-gray-200 overflow-hidden ${
            selectedJob ? "hidden md:block" : "block"
          }`}
        >
          <ScrollArea className="h-full pr-4">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`m-2 cursor-pointer ${selectedJob?.id === job.id ? "border-black" : ""}`}
                onClick={() => {
                  setSelectedJob(job);
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  {job.salary && (
                    <Badge variant="default" className="mr-2 mb-2 bg-gray-800 text-white">
                      {job.salary}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{job.postedAgo}</span>
                </CardFooter>
              </Card>
            ))}
          </ScrollArea>
        </div>

        {/* Job details */}
        <div
          className={`w-full md:w-2/3 p-4 sm:p-6 overflow-auto ${
            selectedJob ? "block" : "hidden md:block"
          }`}
        >
          {selectedJob && (
            <>
              <Button
                variant="outline"
                className="mb-4 md:hidden"
                onClick={() => setSelectedJob(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-lg text-gray-600">{selectedJob.company}</p>
                <div className="flex flex-wrap items-center mt-2">
                  <Badge variant="outline" className="mr-2 mb-2">
                    {selectedJob.salary || "Salary not specified"}
                  </Badge>
                  <Badge variant="outline" className="mr-2 mb-2 bg-gray-100">
                    {selectedJob.jobType}
                  </Badge>
                  <span className="mb-2 text-sm text-center text-gray-500">
                    {selectedJob.postedAgo}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{selectedJob.fullDescription}</p>
              <div className="flex items-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="mr-4 bg-black text-white hover:bg-gray-800"
                      disabled={appliedJobIds.has(selectedJob.id)}
                    >
                      {appliedJobIds.has(selectedJob.id) ? "Applied" : "Apply"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Apply for {selectedJob.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4">
                      <div>
                        <Label htmlFor="applicantName">Full Name</Label>
                        <Input
                          id="applicantName"
                          value={
                            currentUser
                              ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
                              : ""
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="applicantEmail">Email</Label>
                        <Input
                          id="applicantEmail"
                          type="email"
                          value={currentUser?.email || ""}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="resumeURL">Resume URL</Label>
                        <Input id="resumeURL" {...register("resumeURL")} required />
                      </div>
                      <div>
                        <Label htmlFor="coverLetterURL">Cover Letter URL</Label>
                        <Input id="coverLetterURL" {...register("coverLetterURL")} />
                      </div>
                      <div>
                        <Label htmlFor="linkedinURL">LinkedIn URL</Label>
                        <Input id="linkedinURL" {...register("linkedinURL")} />
                      </div>
                      <div>
                        <Label htmlFor="additionalDocuments">Additional Documents</Label>
                        <Input id="additionalDocuments" {...register("additionalDocumentsR2URL")} />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" {...register("notes")} />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Submit Application</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant={savedJobIds.has(selectedJob.id) ? "secondary" : "outline"}
                  onClick={() => saveJob(selectedJob)}
                  disabled={savedJobIds.has(selectedJob.id)}
                >
                  {savedJobIds.has(selectedJob.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
