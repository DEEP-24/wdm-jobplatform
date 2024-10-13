"use client";

import type { Job } from "@/app/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type JobType = "job" | "internship";

const defaultJobs: Job[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "Google",
    description: "We are looking for a skilled Full Stack developer...",
    salary: "$140k/yr",
    postedAgo: "5 hours ago",
    fullDescription:
      "We are looking for a skilled Full Stack developer to join our dynamic team at Google. The ideal candidate will have at least 5 years of experience in React and Node.js, with a proven track record of building and maintaining complex web applications. In this role, you will be responsible for developing and maintaining our cutting-edge web application, working closely with both front-end and back-end systems. You'll be involved in all stages of the development lifecycle, from conceptualization and design to implementation and deployment. We're seeking someone who is passionate about creating efficient, scalable, and user-friendly applications. You should have a strong understanding of web technologies and be comfortable working in a fast-paced, collaborative environment. Your expertise in both client-side and server-side programming will be crucial in delivering high-quality solutions that meet our users' needs. At Google, we value innovation and creativity. You'll have the opportunity to work on challenging projects, contribute your ideas, and make a significant impact on our products used by millions of people worldwide. If you're ready to take your career to the next level and work with some of the brightest minds in the industry, we encourage you to apply for this exciting position.",
    workMode: "onsite",
    type: "job",
  },
  {
    id: "2",
    title: "Software Engineer",
    company: "Microsoft",
    description: "We are looking for a skilled Software Engineer...",
    salary: "$120k/yr",
    postedAgo: "3 hours ago",
    fullDescription:
      "We are looking for a skilled Software Engineer to join our team at Microsoft. The ideal candidate will have 5+ years of experience in React and Node.js, with a strong background in building scalable web applications. In this role, you will be responsible for developing and maintaining our cutting-edge web platforms, working on both front-end and back-end systems. You'll collaborate with cross-functional teams to design, implement, and optimize new features, ensuring high performance and reliability. We're seeking someone who is passionate about clean, efficient code and stays up-to-date with the latest industry trends and best practices. Your expertise in modern web technologies will be crucial in delivering innovative solutions that meet our users' needs. At Microsoft, we offer a dynamic work environment where you'll have the opportunity to work on projects that impact millions of users worldwide. If you're ready to take on exciting challenges and grow your career in a supportive and innovative company, we encourage you to apply for this position.",
    workMode: "remote",
    type: "job",
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "Amazon",
    description: "We are looking for a skilled Data Scientist...",
    salary: "$150k/yr",
    postedAgo: "2 hours ago",
    fullDescription:
      "We are looking for a skilled Data Scientist to join our team at Amazon. The ideal candidate will have 5+ years of experience in React and Node.js, with a strong background in building scalable web applications. In this role, you will be responsible for developing and maintaining our cutting-edge web platforms, working on both front-end and back-end systems. You'll collaborate with cross-functional teams to design, implement, and optimize new features, ensuring high performance and reliability. We're seeking someone who is passionate about clean, efficient code and stays up-to-date with the latest industry trends and best practices. Your expertise in modern web technologies will be crucial in delivering innovative solutions that meet our users' needs. At Amazon, we offer a dynamic work environment where you'll have the opportunity to work on projects that impact millions of users worldwide. If you're ready to take on exciting challenges and grow your career in a supportive and innovative company, we encourage you to apply for this position.",
    workMode: "onsite",
    type: "job",
  },
  {
    id: "4",
    title: "Software Engineering Intern",
    company: "Facebook",
    description: "We are seeking a talented Software Engineering Intern...",
    salary: "$30/hr",
    postedAgo: "1 day ago",
    fullDescription:
      "We are seeking a talented Software Engineering Intern to join our team at Facebook for a summer internship. The ideal candidate will be pursuing a degree in Computer Science or a related field, with strong programming skills in languages such as Python, Java, or C++. This internship offers an exciting opportunity to work on real-world projects that impact millions of users worldwide. You'll collaborate with experienced engineers, learn about large-scale systems, and contribute to the development of innovative features. We're looking for someone who is passionate about technology, eager to learn, and ready to tackle complex challenges. This internship will provide valuable industry experience and the chance to grow your skills in a fast-paced, collaborative environment.",
    workMode: "onsite",
    type: "internship",
  },
  {
    id: "5",
    title: "Data Science Intern",
    company: "Netflix",
    description: "Join our Data Science team as an intern...",
    salary: "$28/hr",
    postedAgo: "2 days ago",
    fullDescription:
      "Join our Data Science team as an intern at Netflix and dive into the world of big data and machine learning. We're looking for a motivated student pursuing a degree in Data Science, Statistics, or a related field. As a Data Science Intern, you'll work on projects that help shape our content recommendations, optimize streaming quality, and improve user experience. You should have a strong foundation in statistical analysis, machine learning algorithms, and programming languages such as Python or R. This internship offers a unique opportunity to apply your academic knowledge to real-world problems, work with large datasets, and learn from industry experts. If you're passionate about using data to drive decision-making and create impactful solutions, we encourage you to apply for this exciting internship opportunity.",
    workMode: "hybrid",
    type: "internship",
  },
];

interface JobApplication {
  id: string;
  jobID: string;
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
  jobTitle: string;
  jobType: string;
  salary: string;
  workMode: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "all">("all");
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isLargeDevice = useMediaQuery("(min-width: 768px)");

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

    // Set default selected job only for medium and large devices
    if (isLargeDevice) {
      setSelectedJob(storedJobs[0] || null);
    }

    // Load saved and applied jobs
    const savedJobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobIds(new Set(savedJobs.map((job) => job.id)));

    const appliedJobs: JobApplication[] = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setAppliedJobIds(new Set(appliedJobs.map((app) => app.jobID)));

    // Load current user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setCurrentUser(storedUser);
  }, [isLargeDevice]);

  useEffect(() => {
    // Update selectedJob when jobTypeFilter changes (only for medium and large devices)
    if (
      isLargeDevice &&
      jobTypeFilter !== "all" &&
      selectedJob &&
      selectedJob.type !== jobTypeFilter
    ) {
      const firstMatchingJob = jobs.find((job) => job.type === jobTypeFilter);
      setSelectedJob(firstMatchingJob || null);
    }
  }, [jobTypeFilter, isLargeDevice, jobs, selectedJob]);

  const filteredJobs = jobs.filter((job) => jobTypeFilter === "all" || job.type === jobTypeFilter);

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
      jobType: selectedJob.type,
      salary: selectedJob.salary,
      workMode: selectedJob.workMode,
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
          <Select
            value={jobTypeFilter}
            onValueChange={(value: JobType | "all") => setJobTypeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="job">Jobs</SelectItem>
              <SelectItem value="internship">Internships</SelectItem>
            </SelectContent>
          </Select>
          {currentUser?.role === "employer" && (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/add-job">
                <Plus className="mr-2 h-4 w-4" /> Add Job
              </Link>
            </Button>
          )}
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
            {filteredJobs.map((job) => (
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
                <CardFooter className="flex flex-wrap items-center gap-2">
                  {job.salary && (
                    <Badge variant="secondary" className="mb-2">
                      {job.salary}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="mb-2">
                    {job.type}
                  </Badge>
                  <Badge variant="secondary" className="mb-2">
                    {job.workMode}
                  </Badge>
                  <span className="text-xs text-gray-500 w-full mt-1">{job.postedAgo}</span>
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
          {selectedJob ? (
            <>
              <Button
                variant="outline"
                className="mb-4 md:hidden"
                onClick={() => setSelectedJob(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>

              <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-lg text-gray-600">{selectedJob.company}</p>
                <div className="flex flex-wrap items-center mt-5">
                  <Badge variant="outline" className="mr-2 mb-2">
                    {selectedJob.salary || "Salary not specified"}
                  </Badge>
                  <Badge variant="outline" className="mr-2 mb-2 bg-gray-100">
                    {selectedJob.workMode}
                  </Badge>
                  <span className="mb-2 text-sm text-center text-gray-500">
                    {selectedJob.postedAgo}
                  </span>
                </div>

                <p className="text-gray-700 mb-6 mt-4">{selectedJob.fullDescription}</p>
                {currentUser?.role === "student" && (
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
                            <Input
                              id="additionalDocuments"
                              {...register("additionalDocumentsR2URL")}
                            />
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
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
