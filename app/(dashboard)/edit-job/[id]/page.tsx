"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

type JobType = "Full_time" | "Part_time" | "Contract";
type WorkMode = "On_site" | "Remote" | "Hybrid";
type ListingType = "Job" | "Internship";
type Status = "Open" | "Closed" | "Filled";

type JobFormData = {
  title: string;
  company: string;
  location: string | null;
  listingType: ListingType;
  jobType: JobType;
  workArrangement: WorkMode;
  isInternshipPaid: boolean | null;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  salaryRange: string | null;
  applicationDeadline: string | null;
  startDate: string | null;
  duration: string | null;
  status: Status;
  requiredSkills: string;
};

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<JobFormData>({
    defaultValues: {
      status: "Open",
      listingType: "Job",
      jobType: "Full_time",
      workArrangement: "On_site",
    },
  });

  const selectedType = watch("listingType");
  const selectedWorkArrangement = watch("workArrangement");

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log("Fetching job with ID:", params.id);
        const response = await fetch(`/api/jobs/${params.id}`);
        console.log("Response status:", response.status);

        const text = await response.text();
        console.log("Raw response:", text);

        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
          throw new Error("Invalid JSON response from server");
        }

        if (!response.ok) {
          console.error("Error response data:", data);
          throw new Error(data.error || "Failed to fetch job");
        }

        console.log("Fetched job data:", data);

        // Format the job data for the form
        const formattedJob = {
          ...data,
          applicationDeadline: data.applicationDeadline
            ? new Date(data.applicationDeadline).toISOString().split("T")[0]
            : null,
          startDate: data.startDate ? new Date(data.startDate).toISOString().split("T")[0] : null,
          listingType: data.type === "internship" ? "Internship" : "Job",
          workArrangement:
            data.workMode === "onsite"
              ? "On_site"
              : data.workMode === "remote"
                ? "Remote"
                : "Hybrid",
          salaryRange: data.salary,
          requiredSkills: data.requiredSkills.join(", "),
        };

        console.log("Formatted job data:", formattedJob);
        reset(formattedJob);
      } catch (error) {
        console.error("Detailed error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch job details",
          variant: "destructive",
        });
        router.push("/jobs");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchJob();
  }, [params.id, reset, router, toast]);

  const onSubmit = async (data: JobFormData) => {
    try {
      setIsLoading(true);

      const formattedData = {
        title: data.title,
        company: data.company,
        location: data.location || null,
        description: data.description,
        requirements: data.requirements || null,
        responsibilities: data.responsibilities || null,
        salary: data.salaryRange || null,
        workMode:
          data.workArrangement === "On_site"
            ? "onsite"
            : data.workArrangement === "Remote"
              ? "remote"
              : "hybrid",
        type: data.listingType.toLowerCase(),
        jobType: data.jobType,
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline).toISOString()
          : null,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        duration: data.duration || null,
        isInternshipPaid: data.isInternshipPaid,
        requiredSkills: data.requiredSkills,
        status: data.status,
      };

      const response = await fetch(`/api/jobs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update job");
      }

      toast({
        title: "Success",
        description: "Job has been successfully updated.",
      });

      router.push("/jobs");
      router.refresh();
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong while updating the job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/jobs" className="flex items-center gap-2 hover:underline">
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="text-sm">Back to Jobs</span>
        </Link>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Edit {selectedType === "Internship" ? "Internship" : "Job"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title", { required: "Title is required" })} />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" {...register("company", { required: "Company is required" })} />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  value={watch("listingType")}
                  onValueChange={(value) => setValue("listingType", value as ListingType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Job">Job</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jobType">Employment Type</Label>
                <Select
                  value={watch("jobType")}
                  onValueChange={(value) => setValue("jobType", value as JobType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full_time">Full Time</SelectItem>
                    <SelectItem value="Part_time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workArrangement">Work Arrangement</Label>
                <Select
                  value={watch("workArrangement")}
                  onValueChange={(value) => setValue("workArrangement", value as WorkMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="On_site">On-site</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedWorkArrangement === "On_site" && (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
                </div>
              )}

              <div>
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Input id="salaryRange" {...register("salaryRange")} />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value as Status)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input type="date" id="applicationDeadline" {...register("applicationDeadline")} />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" {...register("startDate")} />
              </div>

              {selectedType === "Internship" && (
                <>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      {...register("duration", {
                        required:
                          selectedType === "Internship"
                            ? "Duration is required for internships"
                            : false,
                      })}
                      placeholder="e.g., 3 months"
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="isInternshipPaid">Paid Internship</Label>
                    <Select
                      value={watch("isInternshipPaid")?.toString()}
                      onValueChange={(value) => setValue("isInternshipPaid", value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select if paid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  {...register("requirements")}
                  placeholder="List the requirements for this position"
                />
              </div>

              <div>
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  {...register("responsibilities")}
                  placeholder="List the key responsibilities"
                />
              </div>

              <div>
                <Label htmlFor="requiredSkills">Required Skills</Label>
                <Textarea
                  id="requiredSkills"
                  {...register("requiredSkills")}
                  placeholder="Enter required skills (comma separated)"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : `Update ${selectedType}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
