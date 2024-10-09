"use client";

import type { Job } from "@/app/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
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

// Update the jobsData to match the Job type
const jobsData: Job[] = [
  {
    id: "1", // Change to string to match the Job type
    title: "Full Stack Developer",
    company: "Google",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$140k/yr",
    postedAgo: "5 hours ago",
    fullDescription:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX and all the major web related technologies. It will be an onsite job. You will work on both frontend and backend technologies, collaborating with cross-functional teams to deliver high-quality solutions. Proficiency in JavaScript, HTML/CSS, and frameworks like React, Angular, or Vue.js is essential. Backend experience in Node.js, Python, or similar, along with database knowledge (SQL/NoSQL), is required. The ideal candidate has experience with version control (Git), cloud services, and a passion for writing clean, efficient code. Strong problem-solving skills and attention to detail are key.",
    jobType: "onsite",
  },
  {
    id: "2", // Change to string to match the Job type
    title: "UI/UX Developer",
    company: "BCBS",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$140k/yr",
    postedAgo: "15 days ago",
    fullDescription:
      "We are seeking a talented UI/UX Developer to join our team. This role involves creating intuitive and engaging user interfaces for web and mobile applications. Responsibilities include designing wireframes, creating mockups, and collaborating with developers to implement designs. Strong visual design skills with sensitivity to user-system interaction are essential. Proficiency in design tools like Adobe XD, Figma, or Sketch is required. Experience with responsive design and cross-browser compatibility is a plus. The ideal candidate has a keen eye for aesthetics, attention to detail, and a passion for creating user-friendly designs.",
    jobType: "remote",
  },
  {
    id: "3", // Change to string to match the Job type
    title: "Web Developer Intern",
    company: "ElderCareConnect Inc.",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    postedAgo: "1 month ago",
    salary: "$100k/yr",
    fullDescription:
      "We are offering an exciting internship opportunity for a Web Developer. This is a great opportunity to gain hands-on experience and learn from industry experts. The ideal candidate is a quick learner, has a strong work ethic, and is passionate about web development. Responsibilities include coding, debugging, and testing web applications. Proficiency in HTML, CSS, JavaScript, and React is required. Basic knowledge of web server technologies like Node.js or PHP is a plus. The candidate should be able to work independently and as part of a team, with excellent communication skills.",
    jobType: "hybrid",
  },
  {
    id: "4", // Change to string to match the Job type
    title: "React Developer",
    company: "meta",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX ...",
    salary: "$200k/yr",
    postedAgo: "3 months ago",
    fullDescription:
      "Join our team as a React Developer and work on cutting-edge projects. You will be responsible for developing and maintaining web applications using React.js. Proficiency in JavaScript, HTML/CSS, and React.js is essential. Experience with state management, RESTful APIs, and version control (Git) is required. Strong problem-solving skills and attention to detail are key. The ideal candidate has a passion for web development and a commitment to delivering high-quality code.",
    jobType: "remote",
  },
  {
    id: "5", // Change to string to match the Job type
    title: "Web Developer",
    company: "IBM",
    description:
      "We are looking for a skilled Full Stack developer who has a good knowledge on SEO, WebFlow, Framer, React, UI/UX.",
    salary: "$140k/yr",
    postedAgo: "4 months ago",
    fullDescription:
      "IBM is seeking a Web Developer to join our innovative team. The ideal candidate will have a strong foundation in web technologies and a passion for creating robust, scalable web applications. You'll be working on cutting-edge projects, collaborating with cross-functional teams to deliver high-quality solutions. Proficiency in HTML, CSS, JavaScript, and modern frameworks like React or Angular is essential. Experience with server-side technologies such as Node.js, Python, or Java is a plus. The role involves developing and maintaining web applications, optimizing performance, and ensuring cross-browser compatibility. Strong problem-solving skills, attention to detail, and the ability to work in an agile environment are crucial. Join IBM and be part of shaping the future of web technology!",
    jobType: "onsite",
  },
];

interface JobApplication {
  id: string;
  jobID: string;
  resumeURL: string;
  coverLetterURL: string;
  linkedinURL: string; // Ensure this is included
  additionalDocumentsR2URL: string;
  applicationStatus: string;
  submittedAt: string;
  lastUpdated: string;
  notes: string;
  jobTitle: string; // Add this line to match the applied-jobs interface
}

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job>(jobsData[0]);
  const [showJobList, setShowJobList] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const savedJobs: Job[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobIds(new Set(savedJobs.map((job) => job.id)));

    const appliedJobs: JobApplication[] = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setAppliedJobIds(new Set(appliedJobs.map((app) => app.jobID)));
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
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobID: selectedJob.id,
      jobTitle: selectedJob.title,
      ...data,
      applicationStatus: "Submitted",
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/career-development">Explore Career Resources</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Job listings */}
        <div
          className={`w-full md:w-1/3 border-r border-gray-200 overflow-hidden ${
            showJobList ? "block" : "hidden md:block"
          }`}
        >
          <ScrollArea className="h-full pr-4 [&>div]:!overflow-x-hidden [&>div>div]:!mr-0">
            {jobsData.map((job) => (
              <Card
                key={job.id}
                className={`m-2 cursor-pointer ${selectedJob.id === job.id ? "border-black" : ""}`}
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
          className={`w-full md:w-2/3 p-6 overflow-auto ${
            showJobList ? "hidden md:block" : "block"
          }`}
        >
          <Button variant="outline" className="mb-4 md:hidden" onClick={() => setShowJobList(true)}>
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
              <span className="text-sm text-gray-500">{selectedJob.postedAgo}</span>
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
        </div>
      </div>
    </div>
  );
}
