"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import type { Job } from "@/app/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building, Briefcase, MapPin, DollarSign, Clock, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Poppins } from "next/font/google";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type JobType = "job" | "internship";

interface User {
  role: string;
}

const defaultJobs: Job[] = [
  // ... (keep your existing default jobs)
];

const JOBS_PER_PAGE = 10;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(defaultJobs);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "all">("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const { toast } = useToast();
  const { ref, inView } = useInView();

  const { register, handleSubmit, reset } = useForm();

  const jobDetailsSheetRef = useRef<HTMLButtonElement>(null);

  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedAppliedJobs = localStorage.getItem("appliedJobs");
    if (storedAppliedJobs) {
      setAppliedJobIds(JSON.parse(storedAppliedJobs));
    }

    const storedSavedJobs = localStorage.getItem("savedJobs");
    if (storedSavedJobs) {
      setSavedJobIds(JSON.parse(storedSavedJobs));
    }
  }, []);

  useEffect(() => {
    const filteredJobs = jobs.filter(
      (job) => jobTypeFilter === "all" || job.type === jobTypeFilter,
    );
    setDisplayedJobs(filteredJobs.slice(0, page * JOBS_PER_PAGE));
  }, [jobs, jobTypeFilter, page]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  const onSubmitApplication = (data: any) => {
    if (selectedJob) {
      const updatedAppliedJobIds = [...appliedJobIds, selectedJob.id];
      setAppliedJobIds(updatedAppliedJobIds);
      localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobIds));

      console.log("Application submitted:", data);
      reset();
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });

      // Close the application dialog
      setIsApplicationDialogOpen(false);
    }
  };

  const saveJob = (job: Job) => {
    if (!savedJobIds.includes(job.id)) {
      const updatedSavedJobIds = [...savedJobIds, job.id];
      setSavedJobIds(updatedSavedJobIds);
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobIds));
      toast({
        title: "Job Saved",
        description: "The job has been saved to your profile.",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-purple-800">Job Opportunities</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <Input type="text" placeholder="Search jobs..." className="pl-10 pr-4 py-2 w-full" />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Select
              value={jobTypeFilter}
              onValueChange={(value: JobType | "all") => setJobTypeFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
              </SelectContent>
            </Select>
            {currentUser?.role === "employer" && (
              <Button asChild className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                <Link href="/add-job">
                  <Plus className="mr-2 h-4 w-4" /> Add Job
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs.map((job) => (
            <Card
              key={job.id}
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-2">{job.title}</h2>
                <p className="text-sm text-gray-600 flex items-center mb-4">
                  <Building className="mr-2 h-4 w-4" /> {job.company}
                </p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center">
                    <DollarSign className="mr-1 h-3 w-3" /> {job.salary}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Briefcase className="mr-1 h-3 w-3" /> {job.type}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" /> {job.workMode}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> {job.postedAgo}
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => setSelectedJob(job)}
                      ref={jobDetailsSheetRef}
                    >
                      View Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader>
                      <SheetTitle>{job.title}</SheetTitle>
                      <SheetDescription>{job.company}</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center">
                          <DollarSign className="mr-1 h-3 w-3" /> {job.salary}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Briefcase className="mr-1 h-3 w-3" /> {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" /> {job.workMode}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {job.postedAgo}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {job.fullDescription}
                      </p>
                    </div>
                    {currentUser?.role === "student" && (
                      <SheetFooter className="mt-6 flex justify-end space-x-2">
                        <Button
                          variant={savedJobIds.includes(job.id) ? "secondary" : "outline"}
                          onClick={() => saveJob(job)}
                          disabled={savedJobIds.includes(job.id)}
                        >
                          {savedJobIds.includes(job.id) ? "Saved" : "Save Job"}
                        </Button>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={appliedJobIds.includes(job.id)}
                          onClick={() => {
                            jobDetailsSheetRef.current?.click(); // Close the sheet
                            setIsApplicationDialogOpen(true); // Open the dialog
                          }}
                        >
                          {appliedJobIds.includes(job.id) ? "Applied" : "Apply Now"}
                        </Button>
                      </SheetFooter>
                    )}
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div ref={ref} className="h-10" />

        <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email", { required: true })} />
              </div>
              <div>
                <Label htmlFor="resume">Resume Link</Label>
                <Input id="resume" {...register("resume", { required: true })} />
              </div>
              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea id="coverLetter" {...register("coverLetter", { required: true })} />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Submit Application
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
