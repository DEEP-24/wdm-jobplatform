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
  name: string;
  title: string;
  company: string;
  expertise: string;
  bio: string;
  imageUrl: string;
  yearsOfExperience: number;
  maxMentees: number;
}

export default function BecomeAMentorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MentorFormData>({
    name: "",
    title: "",
    company: "",
    expertise: "",
    bio: "",
    imageUrl: "",
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

      const user = data.user;
      if (user.profile) {
        setFormData((prev) => ({
          ...prev,
          name: `${user.profile.firstName} ${user.profile.lastName}`,
        }));
      }

      if (user.role === "MENTOR") {
        toast({
          title: "Already a Mentor",
          description: "You are already registered as a mentor.",
        });
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
          expertise: formData.expertise
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
              <Label htmlFor="name" className="text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled
                className="mt-1 bg-gray-100"
              />
            </div>

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
                placeholder="React, Node.js, Cloud Architecture"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-gray-700">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your experience and what you can offer as a mentor"
                rows={4}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl" className="text-gray-700">
                Profile Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/your-image.jpg"
                required
                className="mt-1"
              />
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
