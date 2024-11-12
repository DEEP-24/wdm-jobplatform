"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MentorFormData {
  title: string;
  company: string;
  city: string;
  state: string;
  academicBackground: string;
  skills: string;
  expertise: string;
  yearsOfExperience: number;
  maxMentees: number;
}

export default function BecomeAMentorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MentorFormData>({
    title: "",
    company: "",
    city: "",
    state: "",
    academicBackground: "",
    skills: "",
    expertise: "",
    yearsOfExperience: 0,
    maxMentees: 5,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      const data = await response.json();

      if (!data.authenticated) {
        router.push("/login");
        return;
      }

      if (data.user.role === "MENTOR") {
        toast({
          title: "Already a Mentor",
          description: "You are already registered as a mentor.",
        });
        router.push("/mentors");
      }
    };

    checkAuth();
  }, [router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mentors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: Number.parseInt(formData.yearsOfExperience.toString()),
          maxMentees: Number.parseInt(formData.maxMentees.toString()),
          expertise: formData.expertise
            .split(",")
            .map((skill) => skill.trim())
            .join(","),
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .join(","),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast({
        title: "Application Submitted",
        description: "Your mentor application has been successfully submitted.",
      });
      router.push("/mentors");
    } catch (error) {
      console.error("Error submitting mentor application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-purple-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Become a Mentor</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-gray-700">
                Professional Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-gray-700">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="e.g., Tech Corp"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="academicBackground" className="text-gray-700">
                Academic Background
              </Label>
              <Textarea
                id="academicBackground"
                name="academicBackground"
                value={formData.academicBackground}
                onChange={handleInputChange}
                required
                className="mt-1"
                placeholder="e.g., Bachelor's in Computer Science, Master's in Software Engineering"
              />
            </div>

            <div>
              <Label htmlFor="expertise" className="text-gray-700">
                Areas of Expertise (comma-separated)
              </Label>
              <Input
                id="expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                placeholder="e.g., Web Development, Cloud Architecture, Machine Learning"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="skills" className="text-gray-700">
                Technical Skills (comma-separated)
              </Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, AWS, Python"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearsOfExperience" className="text-gray-700">
                  Years of Experience
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxMentees" className="text-gray-700">
                  Maximum Mentees
                </Label>
                <Input
                  id="maxMentees"
                  name="maxMentees"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxMentees}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
