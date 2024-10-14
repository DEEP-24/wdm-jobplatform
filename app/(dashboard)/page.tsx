"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@/app/types/user";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  FileTextIcon,
  NewspaperIcon,
  SendIcon,
  MessageCircleIcon,
} from "lucide-react";
import ChatComponent from "@/app/(dashboard)/_components/chat";

const attendeeData = [
  { month: "Jan", attendees: 400 },
  { month: "Feb", attendees: 300 },
  { month: "Mar", attendees: 500 },
  { month: "Apr", attendees: 280 },
  { month: "May", attendees: 200 },
  { month: "Jun", attendees: 600 },
];

const eventTypeData = [
  { name: "Workshops", value: 400 },
  { name: "Seminars", value: 300 },
  { name: "Conference", value: 300 },
];

const newsAndAnnouncements = [
  {
    id: 1,
    title: "New AI Workshop Series Announced",
    date: "2023-07-15",
    excerpt:
      "Join us for a 4-part workshop series on the latest AI technologies, starting next month.",
    link: "/",
  },
  {
    id: 2,
    title: "Call for Volunteers: Annual Tech Conference",
    date: "2023-07-10",
    excerpt:
      "We're seeking enthusiastic volunteers for our upcoming annual tech conference. Sign up now!",
    link: "/",
  },
  {
    id: 3,
    title: "Partnership Announcement: TechGiant Inc.",
    date: "2023-07-05",
    excerpt:
      "We're excited to announce our new partnership with TechGiant Inc., bringing more opportunities to our members.",
    link: "/",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Existing dashboard content */}
      <Card className="bg-white text-black border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Welcome to GrowthLink, {currentUser?.firstName} {currentUser?.lastName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Explore cutting-edge technologies, network with industry leaders, and boost your career
            through our workshops, seminars, and various academic events.
          </p>
          <div className="mt-4 flex space-x-4">
            <Button asChild variant="outline" className="bg-black text-white">
              <Link href="/">View Academic Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call for Papers Component */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <FileTextIcon className="mr-2" />
            Call for Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Share your research and insights at our upcoming conference. We're accepting papers on
            AI, Cloud Computing, and Cybersecurity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <CalendarDaysIcon className="mr-2" />
              <span>Deadline: August 15, 2023</span>
            </div>
            <div className="flex items-center">
              <FileTextIcon className="mr-2" />
              <span>Max 10 pages, IEEE format</span>
            </div>
            <div className="flex items-center">
              <SendIcon className="mr-2" />
              <span>Submit via EasyChair</span>
            </div>
          </div>
          <Button
            asChild
            variant="secondary"
            className="w-full bg-white text-purple-600 hover:bg-gray-100"
          >
            <Link href="/">Submit Your Paper</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Latest News and Announcements */}
      <Card className="bg-white text-black border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <NewspaperIcon className="mr-2" />
            Latest News and Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newsAndAnnouncements.map((item) => (
              <Card key={item.id} className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                  <p className="text-sm mb-4">{item.excerpt}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/">Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Resources Card */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access a wealth of learning materials, tutorials, and guides.</p>
            <Button
              asChild
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link href="/">Explore Resources</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Networking Card */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Networking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connect with peers, industry experts, and potential collaborators.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link href="/">Start Networking</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mentors Card */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Mentors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Find guidance from experienced professionals in your field.</p>
            <Button
              asChild
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link href="/">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Job Opportunities Card */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Job Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Discover career opportunities from top companies in the industry.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link href="/">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Conference Highlights */}
      <Card className="bg-white text-black border border-gray-200">
        <CardHeader>
          <CardTitle>Conference Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>75+ sessions across 3 days</li>
            <li>120 industry-leading speakers</li>
            <li>Hands-on workshops and technical talks</li>
            <li>Networking opportunities with tech professionals</li>
            <li>Career fair with 50+ companies hiring</li>
            <li>Latest trends in AI, Cloud Computing, and Cybersecurity</li>
          </ul>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Attendees Chart */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Monthly Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendees" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Types Distribution Chart */}
        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Event Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {eventTypeData.map((_entry, index) => (
                    <Cell
                      key={`cell-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <ChatComponent />
    </div>
  );
}
