"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
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
import type { Job } from "@/app/types/job";

// Update the Job type to include type
type JobType = "job" | "internship";

export default function AddJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Job>();

  const onSubmit = (data: Job) => {
    const newJob = {
      ...data,
      id: uuidv4(),
      postedAgo: "Just now",
    };

    // Get existing jobs from localStorage
    const existingJobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]");

    // Add new job
    existingJobs.push(newJob);

    // Save updated jobs to localStorage
    localStorage.setItem("jobs", JSON.stringify(existingJobs));

    toast({
      title: "Job Added",
      description: "Your job has been successfully added.",
    });

    router.push("/jobs");
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" {...register("title", { required: "Title is required" })} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" {...register("company", { required: "Company is required" })} />
                {errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  {...register("fullDescription", { required: "Full description is required" })}
                />
                {errors.fullDescription && (
                  <p className="text-red-500 text-sm">{errors.fullDescription.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" {...register("salary", { required: "Salary is required" })} />
                  {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
                </div>
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("workMode", value as "onsite" | "remote" | "hybrid")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onsite">Onsite</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.workMode && (
                    <p className="text-red-500 text-sm">{errors.workMode.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="type">Opportunity Type</Label>
                <Select onValueChange={(value) => setValue("type", value as JobType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select opportunity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Add Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
