"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
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

export default function AddJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
      };

      console.log("Submitting data:", formattedData);

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to add job");
      }

      toast({
        title: "Success",
        description: "Job has been successfully added.",
      });

      router.push("/jobs");
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong while adding the job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Add New {selectedType === "Internship" ? "Internship" : "Job"}
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
                <Select onValueChange={(value) => setValue("listingType", value as ListingType)}>
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
                <Select onValueChange={(value) => setValue("jobType", value as JobType)}>
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
                <Select onValueChange={(value) => setValue("workArrangement", value as WorkMode)}>
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
                <Select onValueChange={(value) => setValue("status", value as Status)}>
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
              {isLoading ? "Adding..." : `Add ${selectedType}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
