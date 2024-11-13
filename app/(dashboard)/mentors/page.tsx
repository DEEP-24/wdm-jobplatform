"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Profile {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  title?: string;
  company?: string;
  city?: string;
  state?: string;
  academicBackground?: string;
  skills?: string;
}

interface MentorProfile {
  expertise: string;
  yearsOfExperience: number;
  maxMentees: number;
}

interface Mentor {
  id: string;
  email: string;
  role: string;
  profile: Profile | null;
  mentorProfile?: MentorProfile | null;
}

interface MentorshipApplication {
  id: string;
  mentor: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      imageUrl?: string;
    };
    email: string;
  };
  academicLevel: string;
  fieldOfStudy: string;
  careerGoals: string;
  areasOfInterest: string;
  expectedGraduationDate: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  sessionDate: string | null;
  startTime: string | null;
  endTime: string | null;
  sessionType: string | null;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mentor: z.string().min(1, {
    message: "Please select a mentor.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  sessionDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  sessionType: z.string().min(1, {
    message: "Please select a session type.",
  }),
  academicLevel: z.string().min(1, {
    message: "Please select your academic level.",
  }),
  fieldOfStudy: z.string().min(1, {
    message: "Please enter your field of study.",
  }),
  careerGoals: z.string().min(10, {
    message: "Please describe your career goals.",
  }),
  areasOfInterest: z.string().min(1, {
    message: "Please enter your areas of interest.",
  }),
  expectedGraduationDate: z.string().min(1, {
    message: "Please select your expected graduation date.",
  }),
});

function ApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
}: {
  application: MentorshipApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-purple-800">
            Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mentor Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Mentor Information</h3>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={application.mentor?.profile?.imageUrl} />
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {`${application.mentor?.profile?.firstName?.[0] || ""}${
                    application.mentor?.profile?.lastName?.[0] || ""
                  }`}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {`${application.mentor?.profile?.firstName} ${application.mentor?.profile?.lastName}`}
                </p>
                <p className="text-sm text-gray-500">{application.mentor?.email}</p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Session Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {application.sessionDate && (
                <div>
                  <p className="font-medium text-gray-600">Session Date</p>
                  <p className="text-sm">
                    {format(new Date(application.sessionDate), "dd MMM yyyy")}
                  </p>
                </div>
              )}
              {application.sessionType && (
                <div>
                  <p className="font-medium text-gray-600">Session Type</p>
                  <p className="text-sm">{application.sessionType}</p>
                </div>
              )}
              {application.startTime && (
                <div>
                  <p className="font-medium text-gray-600">Start Time</p>
                  <p className="text-sm">{format(new Date(application.startTime), "hh:mm a")}</p>
                </div>
              )}
              {application.endTime && (
                <div>
                  <p className="font-medium text-gray-600">End Time</p>
                  <p className="text-sm">{format(new Date(application.endTime), "hh:mm a")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Academic Information</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600">Academic Level</p>
                <p className="text-sm">{application.academicLevel}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Field of Study</p>
                <p className="text-sm">{application.fieldOfStudy}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Expected Graduation</p>
                <p className="text-sm">
                  {format(new Date(application.expectedGraduationDate), "MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Applied On</p>
                <p className="text-sm">{format(new Date(application.createdAt), "dd MMM yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Career Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Career Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-600">Career Goals</p>
                <p className="text-sm mt-1">{application.careerGoals}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Areas of Interest</p>
                <p className="text-sm mt-1">{application.areasOfInterest}</p>
              </div>
            </div>
          </div>

          {/* Application Message */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Your Message</h3>
            </div>
            <p className="text-sm whitespace-pre-wrap">{application.message}</p>
          </div>

          {/* Application Status */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full" />
              <h3 className="text-lg font-semibold text-purple-800">Application Status</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-600">Current Status</p>
              <Badge
                className={
                  application.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : application.status === "ACCEPTED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {application.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationForm({ mentors, onClose }: { mentors: Mentor[]; onClose: () => void }) {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mentor: "",
      message: "",
      sessionDate: "",
      startTime: "",
      endTime: "",
      sessionType: "",
      academicLevel: "",
      fieldOfStudy: "",
      careerGoals: "",
      areasOfInterest: "",
      expectedGraduationDate: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/check");
      const data = await response.json();
      if (data.authenticated && data.user) {
        setCurrentUserId(data.user.id);
        if (data.user.profile) {
          const fullName = `${data.user.profile.firstName} ${data.user.profile.lastName}`.trim();
          form.setValue("name", fullName);
          form.setValue("email", data.user.email);
        }
      }
    };

    checkAuth();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/mentorship-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: values.mentor,
          message: values.message,
          sessionDate: values.sessionDate ? new Date(values.sessionDate) : null,
          startTime: values.startTime ? new Date(values.startTime) : null,
          endTime: values.endTime ? new Date(values.endTime) : null,
          sessionType: values.sessionType,
          academicLevel: values.academicLevel,
          fieldOfStudy: values.fieldOfStudy,
          careerGoals: values.careerGoals,
          areasOfInterest: values.areasOfInterest,
          expectedGraduationDate: new Date(values.expectedGraduationDate),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Application Submitted",
        description: "Your mentorship application has been successfully submitted.",
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-[80vh] overflow-y-auto px-1"
      >
        {/* Personal Information Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full" />
            <h3 className="text-lg font-semibold text-purple-800">Personal Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-50 border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-50 border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Session Details Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full" />
            <h3 className="text-lg font-semibold text-purple-800">Session Details</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sessionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Preferred Session Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Session Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one-on-one">One-on-One</SelectItem>
                      <SelectItem value="group">Group Session</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Preferred Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Preferred End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full" />
            <h3 className="text-lg font-semibold text-purple-800">Academic Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="academicLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Academic Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select your academic level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedGraduationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Expected Graduation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fieldOfStudy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Field of Study</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-200"
                    placeholder="e.g., Computer Science"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Career Information Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full" />
            <h3 className="text-lg font-semibold text-purple-800">Career Information</h3>
          </div>
          <FormField
            control={form.control}
            name="careerGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Career Goals</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your career goals"
                    className="resize-none min-h-[100px] bg-white border-gray-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areasOfInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Areas of Interest</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-200"
                    placeholder="e.g., Web Development, AI, Data Science"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Mentorship Request Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-1 bg-purple-600 rounded-full" />
            <h3 className="text-lg font-semibold text-purple-800">Mentorship Request</h3>
          </div>
          <FormField
            control={form.control}
            name="mentor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Select Mentor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue placeholder="Select a mentor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mentors
                      .filter((mentor) => mentor.id !== currentUserId)
                      .map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.profile
                            ? `${mentor.profile.firstName} ${mentor.profile.lastName}`.trim()
                            : mentor.email}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Message to Mentor</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Introduce yourself and explain why you'd like to be mentored"
                    className="resize-none min-h-[120px] bg-white border-gray-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isMentor, setIsMentor] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<MentorshipApplication | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check user status first
        const authResponse = await fetch("/api/auth/check");
        const authData = await authResponse.json();
        if (authData.authenticated) {
          setIsMentor(authData.user.role === "MENTOR");
          setCurrentUserId(authData.user.id);
        }

        // Fetch mentors
        const mentorsResponse = await fetch("/api/mentors");
        if (!mentorsResponse.ok) {
          throw new Error("Failed to fetch mentors");
        }
        const mentorsData = await mentorsResponse.json();
        console.log("Fetched mentors:", mentorsData);

        // Set all mentors without filtering
        setMentors(mentorsData);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .floating-button, .scroll-arrow, [class*="scroll-arrow"] {
        display: none !important;
      }
    `;
    document.head.append(style);

    return () => {
      style.remove();
    };
  }, []);

  const handleViewApplication = async (mentorId: string) => {
    try {
      const response = await fetch("/api/mentorship-sessions/my-applications");
      const applications = await response.json();
      const application = applications.find(
        (app: MentorshipApplication) => app.mentor.id === mentorId,
      );

      if (application) {
        setSelectedApplication(application);
        setShowDetails(true);
      } else {
        toast({
          title: "No Application Found",
          description: "You haven't submitted an application to this mentor yet.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 text-center">
          Mentorship Program
        </h1>

        {/* Replace the grid of three cards with this single card */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">About Our Mentorship Program</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              Our mentorship program connects students with experienced professionals in their field
              of interest. Mentors provide guidance, share industry insights, and help students
              navigate their career paths.
            </p>
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Benefits of joining:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>One-on-one guidance from industry experts</li>
                <li>Networking opportunities</li>
                <li>Career advice and skill development</li>
                <li>Exposure to real-world projects and challenges</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Application Process:</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Submit your application</li>
                <li>Interview with potential mentors</li>
                <li>Get matched with a mentor</li>
                <li>Start your mentorship journey</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-800">Available Mentors</h2>
          {!isMentor && (
            <Button
              asChild
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/become-a-mentor">Become a Mentor</Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-2">
                  <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => {
              // Get the full name from profile
              const fullName = mentor.profile
                ? `${mentor.profile.firstName} ${mentor.profile.lastName}`.trim()
                : mentor.email;

              // Get initials for avatar
              const initials = mentor.profile
                ? `${mentor.profile.firstName?.[0] || ""}${mentor.profile.lastName?.[0] || ""}`
                : mentor.email[0];

              return (
                <Card
                  key={mentor.id}
                  className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    mentor.id === currentUserId ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-2">
                    <Avatar className="w-20 h-20">
                      {mentor.profile?.imageUrl ? (
                        <AvatarImage src={mentor.profile.imageUrl} alt={fullName} />
                      ) : (
                        <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-bold">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <CardTitle className="text-xl text-purple-800">{fullName}</CardTitle>
                        {mentor.id === currentUserId && (
                          <Badge className="bg-purple-100 text-purple-800">You</Badge>
                        )}
                      </div>
                      {mentor.profile?.title && (
                        <p className="text-sm text-gray-600 font-medium">{mentor.profile.title}</p>
                      )}
                      {mentor.profile?.company && (
                        <p className="text-sm text-gray-500">{mentor.profile.company}</p>
                      )}
                      {mentor.profile?.city && mentor.profile?.state && (
                        <p className="text-sm text-gray-500">
                          {mentor.profile.city}, {mentor.profile.state}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mentor.profile?.academicBackground && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-800 mb-1">
                          Academic Background
                        </h4>
                        <p className="text-sm text-gray-700">{mentor.profile.academicBackground}</p>
                      </div>
                    )}

                    {!mentor.mentorProfile && (
                      <div className="text-sm text-gray-500 italic text-center py-2 border rounded-md bg-gray-50">
                        This mentor hasn't set up their profile yet
                      </div>
                    )}

                    {mentor.mentorProfile?.expertise && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-800 mb-2">
                          Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {mentor.mentorProfile.expertise.split(",").map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-purple-100 text-purple-800"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {mentor.profile?.skills && (
                      <div>
                        <h4 className="text-sm font-semibold text-purple-800 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {mentor.profile.skills.split(",").map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-purple-100 text-purple-800 opacity-80"
                            >
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {mentor.mentorProfile && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2 pt-2 border-t">
                        <div>
                          <span className="font-medium">Experience: </span>
                          {mentor.mentorProfile.yearsOfExperience} years
                        </div>
                        <div>
                          <span className="font-medium">Max Mentees: </span>
                          {mentor.mentorProfile.maxMentees}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleViewApplication(mentor.id)}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      View Application
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : !isMentor ? (
          <Card className="bg-white shadow-lg text-center py-10">
            <CardContent className="space-y-4">
              <p className="text-xl font-semibold text-purple-800">
                No mentors available right now
              </p>
              <p className="text-gray-600">Be the first to become a mentor!</p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/become-a-mentor">Become a Mentor</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setDialogOpen(true)}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white mt-4"
            >
              Apply for Mentorship
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-purple-800">
                Apply for Mentorship
              </DialogTitle>
            </DialogHeader>
            <ApplicationForm mentors={mentors} onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        {selectedApplication && (
          <ApplicationDetailsDialog
            application={selectedApplication}
            open={showDetails}
            onOpenChange={setShowDetails}
          />
        )}
      </div>
    </div>
  );
}
