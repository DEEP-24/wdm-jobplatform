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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

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
    onClose(); // Close the dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
                <Input placeholder="Your email" {...field} />
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
                  <SelectTrigger>
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
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Application</Button>
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
    // This will hide any floating buttons or arrows
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
    <div className="space-y-6 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Mentorship Program</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About Our Mentorship Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our mentorship program connects students with experienced professionals in their field
            of interest. Mentors provide guidance, share industry insights, and help students
            navigate their career paths.
          </p>
          <h3 className="text-lg font-semibold mb-2">Benefits of joining:</h3>
          <ul className="list-disc list-inside mb-4">
            <li>One-on-one guidance from industry experts</li>
            <li>Networking opportunities</li>
            <li>Career advice and skill development</li>
            <li>Exposure to real-world projects and challenges</li>
          </ul>
          <h3 className="text-lg font-semibold mb-2">Application Process:</h3>
          <ol className="list-decimal list-inside mb-4">
            <li>Submit your application</li>
            <li>Interview with potential mentors</li>
            <li>Get matched with a mentor</li>
            <li>Start your mentorship journey</li>
          </ol>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>Apply for Mentorship</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Apply for Mentorship</DialogTitle>
              </DialogHeader>
              <ApplicationForm mentors={mentors} onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Available Mentors</h2>
        {!isMentor && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/become-a-mentor">Become a Mentor</Link>
          </Button>
        )}
      </div>

      {mentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{mentor.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {mentor.title} at {mentor.company}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">{mentor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {/* <CardContent className="pt-0">
                <Button className="w-full">Request Mentorship</Button>
              </CardContent> */}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl font-semibold mb-4">No mentors available right now</p>
          <p className="text-gray-600 mb-6">Be the first to become a mentor!</p>
          <Button asChild>
            <Link href="/become-a-mentor">Become a Mentor</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
