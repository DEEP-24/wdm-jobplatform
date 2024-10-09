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

// Mock data for charts
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
  { name: "conference", value: 300 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-white text-black border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Welcome to GrowthLink,{" "}
            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guest"}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Explore cutting-edge technologies, network with industry leaders, and boost your career
            through our workshops, seminars, and various academic events.
          </p>
          <div className="mt-4 flex space-x-4">
            <Button asChild variant="outline" className="bg-black text-white">
              <Link href="/academic-events">View Academic Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
              <Link href="/resources">Explore Resources</Link>
            </Button>
          </CardContent>
        </Card>

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
              <Link href="/networking">Start Networking</Link>
            </Button>
          </CardContent>
        </Card>

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
              <Link href="/mentors">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>

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
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white text-black border border-gray-200">
          <CardHeader>
            <CardTitle>Academic Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Join interest-based groups and public forums for academic discussions.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link href="/forums">Explore Forums</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
                  {/* biome-ignore lint/correctness/noUnusedVariables: <explanation> */}
                  {eventTypeData.map((event, index) => (
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
    </div>
  );
}
