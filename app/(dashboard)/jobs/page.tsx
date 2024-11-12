"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  BriefcaseIcon,
  Building,
  BuildingIcon,
  CalendarIcon,
  Clock,
  DollarSign,
  DollarSignIcon,
  MapPin,
  MapPinIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
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
  requirements: string;
  responsibilities: string;
  salary: string;
  location: string | null;
  postedAgo: string;
  workMode: "onsite" | "remote" | "hybrid";
  type: JobType;
  jobType: "Full_time" | "Part_time" | "Contract";
  applicationDeadline: string | null;
  startDate: string | null;
  duration: string | null;
  isInternshipPaid: boolean | null;
  requiredSkills: string[];
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

interface AuthUser {
  id: string;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export default function IntegratedJobsPage() {
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<JobType | "all">("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const { toast } = useToast();
  const { ref } = useInView();

  const { register, handleSubmit, reset } = useForm();

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicationFormVisible, setIsApplicationFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/jobs?type=${jobTypeFilter}`);
        const data = await response.json();
        setDisplayedJobs(data);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to fetch jobs",
          variant: "destructive",
        });
      }
    };

    fetchJobs();
  }, [jobTypeFilter, toast]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/jobs/applications");
        const data = await response.json();
        setAppliedJobs(data);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to fetch applications",
          variant: "destructive",
        });
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
        }
      } catch (error: unknown) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const onSubmitApplication = async (data: any) => {
    if (selectedJob && currentUser) {
      try {
        const response = await fetch("/api/jobs/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId: selectedJob.id,
            resumeURL: data.resume,
            coverLetterURL: data.coverLetter,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }

        const newApplication = await response.json();
        setAppliedJobs((prev) => [...prev, newApplication]);

        reset();
        toast({
          title: "Success",
          description: "Your application has been successfully submitted.",
        });

        setIsApplicationFormVisible(false);
        setIsJobModalOpen(false);
      } catch (error: unknown) {
        console.error("Error submitting application:", error);
        toast({
          title: "Error",
          description: "Failed to submit application",
          variant: "destructive",
        });
      }
    }
  };

  const saveJob = (job: Job) => {
    if (!savedJobs.some((savedJob) => savedJob.id === job.id)) {
      const updatedSavedJobs = [...savedJobs, job];
      setSavedJobs(updatedSavedJobs);
      toast({
        title: "Job Saved",
        description: "The job has been saved to your profile.",
      });
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setDisplayedJobs((prev) => prev.filter((job) => job.id !== jobId));

      toast({
        title: "Success",
        description: "Job has been successfully deleted.",
      });

      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const renderJobCard = (job: Job) => (
    <Card
      key={job.id}
      className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Company */}
          <div>
            <h2 className="text-xl font-semibold text-purple-800 mb-2">{job.title}</h2>
            <p className="text-sm text-gray-600 flex items-center mb-2">
              <Building className="mr-2 h-4 w-4" /> {job.company}
            </p>
            {job.workMode === "onsite" && job.location && (
              <p className="text-sm text-gray-600 flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" /> {job.location}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>

          {/* Primary Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center">
              <DollarSign className="mr-1 h-3 w-3" /> {job.salary}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Briefcase className="mr-1 h-3 w-3" /> {job.jobType.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" /> {job.workMode}
            </Badge>
          </div>

          {/* Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.requiredSkills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.requiredSkills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            {job.applicationDeadline && (
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
              </div>
            )}
            {job.type === "internship" && (
              <>
                {job.duration && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Duration: {job.duration}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-3 w-3" />
                  <span>{job.isInternshipPaid ? "Paid" : "Unpaid"} Internship</span>
                </div>
              </>
            )}
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>Posted {job.postedAgo}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 flex flex-col gap-2">
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            setSelectedJob(job);
            setIsJobModalOpen(true);
          }}
        >
          View Details
        </Button>
        {currentUser?.role === UserRole.EMPLOYER && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push(`/edit-job/${job.id}`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setJobToDelete(job);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );

  const renderApplicationForm = () => (
    <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          defaultValue={
            currentUser?.profile
              ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
              : ""
          }
          {...register("name")}
          disabled={!!currentUser?.profile}
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
        <Textarea id="coverLetter" {...register("coverLetter", { required: true })} />
      </div>
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
        Submit Application
      </Button>
    </form>
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
                            {application.job.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 flex items-center">
                            <BuildingIcon className="w-4 h-4 mr-2" />
                            {application.job.company}
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
                                <p className="text-sm capitalize">
                                  {application.job.jobType.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSignIcon className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Salary</p>
                                <p className="text-sm">{application.job.salary}</p>
                              </div>
                            </div>
                            {application.job.workMode === "onsite" && application.job.location && (
                              <div className="flex items-center space-x-2">
                                <MapPinIcon className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Location</p>
                                  <p className="text-sm">{application.job.location}</p>
                                </div>
                              </div>
                            )}
                            {application.job.applicationDeadline && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    Application Deadline
                                  </p>
                                  <p className="text-sm">
                                    {new Date(
                                      application.job.applicationDeadline,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            )}
                            {application.job.startDate && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                                  <p className="text-sm">
                                    {new Date(application.job.startDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 space-y-4">
                            {application.job.requirements && (
                              <div>
                                <h3 className="text-sm font-semibold text-purple-800">
                                  Requirements
                                </h3>
                                <p className="text-sm text-gray-700">
                                  {application.job.requirements}
                                </p>
                              </div>
                            )}
                            {application.job.responsibilities && (
                              <div>
                                <h3 className="text-sm font-semibold text-purple-800">
                                  Responsibilities
                                </h3>
                                <p className="text-sm text-gray-700">
                                  {application.job.responsibilities}
                                </p>
                              </div>
                            )}
                            {application.job.requiredSkills &&
                              application.job.requiredSkills.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-semibold text-purple-800">
                                    Required Skills
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {application.job.requiredSkills.map((skill, index) => (
                                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                      <Badge key={index} variant="secondary">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
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

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the job listing "
                {jobToDelete?.title}" and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setJobToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => jobToDelete && handleDelete(jobToDelete.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isJobModalOpen} onOpenChange={setIsJobModalOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-2xl font-bold text-purple-800">
                  {selectedJob?.title}
                </DialogTitle>
                {currentUser?.role === "employer" && (
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-100"
                    onClick={() => {
                      setIsJobModalOpen(false);
                      router.push(`/edit-job/${selectedJob?.id}`);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              {selectedJob && (
                <div className="space-y-6">
                  {/* Company and Location */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-medium">{selectedJob.company}</p>
                    </div>
                    {selectedJob.workMode === "onsite" && selectedJob.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <p className="text-sm">{selectedJob.location}</p>
                      </div>
                    )}
                  </div>

                  {/* Job Details Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" /> {selectedJob.salary}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Briefcase className="mr-1 h-3 w-3" /> {selectedJob.type}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" /> {selectedJob.jobType.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" /> {selectedJob.workMode}
                    </Badge>
                  </div>

                  {/* Important Dates and Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600">Posted</h3>
                      <p className="text-sm">{selectedJob.postedAgo}</p>
                    </div>
                    {selectedJob.applicationDeadline && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600">
                          Application Deadline
                        </h3>
                        <p className="text-sm">
                          {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedJob.startDate && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600">Start Date</h3>
                        <p className="text-sm">
                          {new Date(selectedJob.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedJob.duration && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-600">Duration</h3>
                        <p className="text-sm">{selectedJob.duration}</p>
                      </div>
                    )}
                  </div>

                  {/* Job Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-purple-800">Description</h3>
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                        {selectedJob.description}
                      </p>
                    </div>

                    {selectedJob.responsibilities && (
                      <div>
                        <h3 className="text-sm font-semibold text-purple-800">Responsibilities</h3>
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                          {selectedJob.responsibilities}
                        </p>
                      </div>
                    )}

                    {selectedJob.requirements && (
                      <div>
                        <h3 className="text-sm font-semibold text-purple-800">Requirements</h3>
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                          {selectedJob.requirements}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Required Skills */}
                  {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-purple-800 mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill, index) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!isApplicationFormVisible && (
                    <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
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

                  {/* Application Form */}
                  {isApplicationFormVisible && renderApplicationForm()}
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
