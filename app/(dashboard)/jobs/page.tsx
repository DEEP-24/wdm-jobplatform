"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  Search,
  CalendarIcon,
  BuildingIcon,
  BriefcaseIcon,
  MapPinIcon,
  DollarSignIcon,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Poppins } from "next/font/google";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type JobType = "job" | "internship";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  fullDescription: string;
  salary: string;
  postedAgo: string;
  workMode: "onsite" | "remote" | "hybrid";
  type: JobType;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  name: string;
  email: string;
  resume: string;
  coverLetter: string;
  submittedAt: string;
  job: Job;
}

const defaultJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    description: "We are looking for a skilled frontend developer...",
    fullDescription:
      "We are looking for a skilled frontend developer with experience in React, TypeScript, and modern CSS frameworks. The ideal candidate will have a strong understanding of web accessibility and performance optimization techniques.",
    salary: "$80,000 - $120,000",
    type: "job",
    workMode: "remote",
    postedAgo: "2 days ago",
  },
  {
    id: "2",
    title: "UX Design Intern",
    company: "DesignHub",
    description: "Exciting opportunity for a UX Design intern...",
    fullDescription:
      "Exciting opportunity for a UX Design intern to work on real-world projects. You'll be part of a dynamic team, learning the latest design tools and methodologies. This internship is perfect for students or recent graduates looking to kickstart their design career.",
    salary: "$20/hour",
    type: "internship",
    workMode: "hybrid",
    postedAgo: "1 week ago",
  },
  // Add more mock jobs as needed
];

const JOBS_PER_PAGE = 10;

export default function IntegratedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(defaultJobs);
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "all">("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const { toast } = useToast();
  const { ref, inView } = useInView();

  const { register, handleSubmit, reset } = useForm();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicationFormVisible, setIsApplicationFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

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
      setAppliedJobs(JSON.parse(storedAppliedJobs));
    }

    const storedSavedJobs = localStorage.getItem("savedJobs");
    if (storedSavedJobs) {
      setSavedJobs(JSON.parse(storedSavedJobs));
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
    if (selectedJob && currentUser) {
      const newApplication: JobApplication = {
        id: Date.now().toString(),
        jobId: selectedJob.id,
        userId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        resume: data.resume,
        coverLetter: data.coverLetter,
        submittedAt: new Date().toISOString(),
        job: {
          id: selectedJob.id,
          title: selectedJob.title,
          company: selectedJob.company,
          description: selectedJob.description,
          fullDescription: selectedJob.fullDescription,
          salary: selectedJob.salary,
          type: selectedJob.type,
          workMode: selectedJob.workMode,
          postedAgo: selectedJob.postedAgo,
        },
      };

      const updatedAppliedJobs = [...appliedJobs, newApplication];
      setAppliedJobs(updatedAppliedJobs);
      localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));

      reset();
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });

      setIsApplicationFormVisible(false);
      setIsJobModalOpen(false);
    }
  };

  const saveJob = (job: Job) => {
    if (!savedJobs.some((savedJob) => savedJob.id === job.id)) {
      const updatedSavedJobs = [...savedJobs, job];
      setSavedJobs(updatedSavedJobs);
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      toast({
        title: "Job Saved",
        description: "The job has been saved to your profile.",
      });
    }
  };

  const renderJobCard = (job: Job) => (
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
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            setSelectedJob(job);
            setIsJobModalOpen(true);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className={`min-h-screen bg-gray-100 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-purple-800">Job Center</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 pr-4 py-2 w-full"
                  />
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
              {displayedJobs.map((job) => renderJobCard(job))}
            </div>
            <div ref={ref} className="h-10" />
          </TabsContent>

          <TabsContent value="applied">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Applied Jobs</h2>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {appliedJobs.length > 0 ? (
                  <div className="space-y-6">
                    {appliedJobs.map((application) => (
                      <Card
                        key={application.id}
                        className="w-full hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                          <CardTitle className="text-lg sm:text-xl font-bold text-purple-800">
                            {application.job?.title || "Untitled Job"}
                          </CardTitle>
                          <p className="text-sm text-gray-600 flex items-center">
                            <BuildingIcon className="w-4 h-4 mr-2" />
                            {application.job?.company || "Unknown Company"}
                          </p>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <CalendarIcon className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Applied On</p>
                                <p className="text-sm">
                                  {new Date(application.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BriefcaseIcon className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Job Type</p>
                                <p className="text-sm">
                                  {application.job?.type || "Not specified"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSignIcon className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Salary</p>
                                <p className="text-sm">
                                  {application.job?.salary || "Not specified"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPinIcon className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Work Mode</p>
                                <p className="text-sm">
                                  {application.job?.workMode || "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xl font-semibold mb-4">No jobs applied yet</p>
                    <Button
                      onClick={() => setActiveTab("browse")}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Browse available jobs
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Saved Jobs</h2>
              {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((job) => renderJobCard(job))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xl font-semibold mb-4">No saved jobs yet</p>
                  <Button
                    onClick={() => setActiveTab("browse")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Browse and save jobs
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedJob && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedJob.company}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" /> {selectedJob.salary}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" /> {selectedJob.type}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" /> {selectedJob.workMode}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" /> {selectedJob.postedAgo}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{selectedJob.fullDescription}</p>

                  {!isApplicationFormVisible && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => saveJob(selectedJob)}
                        disabled={savedJobs.some((job) => job.id === selectedJob.id)}
                      >
                        {savedJobs.some((job) => job.id === selectedJob.id) ? "Saved" : "Save Job"}
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => setIsApplicationFormVisible(true)}
                        disabled={appliedJobs.some((app) => app.jobId === selectedJob.id)}
                      >
                        {appliedJobs.some((app) => app.jobId === selectedJob.id)
                          ? "Applied"
                          : "Apply Now"}
                      </Button>
                    </div>
                  )}

                  {isApplicationFormVisible && (
                    <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          defaultValue={currentUser?.name || ""}
                          {...register("name")}
                          disabled={!!currentUser?.name}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={currentUser?.email || ""}
                          {...register("email")}
                          disabled={!!currentUser?.email}
                        />
                      </div>
                      <div>
                        <Label htmlFor="resume">Resume Link</Label>
                        <Input id="resume" {...register("resume", { required: true })} />
                      </div>
                      <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <Textarea
                          id="coverLetter"
                          {...register("coverLetter", { required: true })}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        Submit Application
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <div ref={ref} className="h-10" />
      </div>
    </div>
  );
}
