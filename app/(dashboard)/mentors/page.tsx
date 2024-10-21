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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  imageUrl: string;
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    title: "Senior Data Scientist",
    company: "TechCorp",
    expertise: ["Machine Learning", "AI Ethics", "Data Visualization"],
    bio: "With over 10 years of experience in data science, Dr. Chen specializes in developing ethical AI solutions.",
    imageUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Full Stack Developer",
    company: "WebSolutions Inc.",
    expertise: ["React", "Node.js", "Cloud Architecture"],
    bio: "Michael is passionate about building scalable web applications and mentoring junior developers.",
    imageUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    title: "UX/UI Design Lead",
    company: "DesignMasters",
    expertise: ["User Research", "Interaction Design", "Accessibility"],
    bio: "Sarah has a keen eye for design and a deep understanding of user-centered design principles.",
    imageUrl: "https://i.pravatar.cc/150?img=5",
  },
];

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
});

function ApplicationForm({ mentors, onClose }: { mentors: Mentor[]; onClose: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mentor: "",
      message: "",
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      form.setValue("name", fullName);
      form.setValue("email", user.email);
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const application = {
      id: uuidv4(),
      ...values,
      submittedAt: new Date().toISOString(),
    };

    const existingApplications = JSON.parse(localStorage.getItem("mentorshipApplications") || "[]");
    const updatedApplications = [...existingApplications, application];
    localStorage.setItem("mentorshipApplications", JSON.stringify(updatedApplications));

    toast({
      title: "Application Submitted",
      description: "Your mentorship application has been successfully submitted.",
    });
    form.reset();
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mentor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Mentor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us why you're interested in the mentorship program"
                  className="resize-none bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Submit Application
        </Button>
      </form>
    </Form>
  );
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isMentor, setIsMentor] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedMentors: Mentor[] = JSON.parse(localStorage.getItem("mentors") || "[]");
    setMentors([...mockMentors, ...storedMentors]);

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsMentor(storedMentors.some((mentor) => mentor.id === user.id));
    }
  }, []);

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

  return (
    <div className={`min-h-screen bg-gray-50 ${poppins.className}`}>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 text-center">
          Mentorship Program
        </h1>

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white mt-4"
                >
                  Apply for Mentorship
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-purple-800">Apply for Mentorship</DialogTitle>
                </DialogHeader>
                <ApplicationForm mentors={mentors} onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
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

        {mentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card
                key={mentor.id}
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-2">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                    <AvatarFallback className="bg-purple-200 text-purple-800 text-xl font-bold">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-xl text-purple-800">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {mentor.title} at {mentor.company}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
