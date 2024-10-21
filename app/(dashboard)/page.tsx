"use client";

import ChatComponent from "@/app/(dashboard)/_components/chat";
import type { User } from "@/app/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import {
  CalendarDaysIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  NewspaperIcon,
  SendIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Montserrat, Open_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

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

const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"];

interface Session {
  id: string;
  eventId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees: number;
}

interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  eventType: "Conference" | "Workshop" | "Seminar";
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  registrationDeadline: string;
  status: string;
  sessions: Session[];
}

function EventRegistrationModal({
  event,
  isOpen,
  onClose,
}: { event: AcademicEvent; isOpen: boolean; onClose: () => void }) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleRegister = () => {
    // Implement registration logic here
    console.log(`Registered for session: ${selectedSession}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-purple-50 text-purple-900">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-purple-800">{event.title}</DialogTitle>
          <DialogDescription className="text-purple-600">Event Registration</DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">
                {format(parseISO(event.startDate), "MMMM d, yyyy")} -{" "}
                {format(parseISO(event.endDate), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">{event.location}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">Max Attendees: {event.maxAttendees}</span>
            </div>
          </div>
          <Separator className="bg-purple-200" />
          <p className="text-sm text-purple-700">{event.description}</p>
          <Separator className="bg-purple-200" />
          <div>
            <h4 className="mb-4 text-sm font-medium text-purple-800">Available Sessions:</h4>
            <ScrollArea className="h-[200px] w-full rounded-md border border-purple-200 p-4">
              {event.sessions.map((session) => (
                <div key={session.id} className="mb-4 last:mb-0">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="session"
                      value={session.id}
                      checked={selectedSession === session.id}
                      onChange={() => setSelectedSession(session.id)}
                      className="form-radio text-purple-600"
                    />
                    <span className="text-sm font-medium text-purple-800">{session.title}</span>
                  </label>
                  <p className="ml-6 text-xs text-purple-600">
                    {format(parseISO(session.startTime), "h:mm a")} -{" "}
                    {format(parseISO(session.endTime), "h:mm a")}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleRegister}
            disabled={!selectedSession}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EventScheduleModal({
  event,
  isOpen,
  onClose,
}: { event: AcademicEvent; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-purple-50 text-purple-900">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-purple-800">{event.title}</DialogTitle>
          <DialogDescription className="text-purple-600">Event Schedule</DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">
                {format(parseISO(event.startDate), "MMMM d, yyyy")} -{" "}
                {format(parseISO(event.endDate), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-700">{event.location}</span>
            </div>
          </div>
          <Separator className="bg-purple-200" />
          <ScrollArea className="h-[300px] w-full rounded-md border border-purple-200 p-4">
            {event.sessions.map((session) => (
              <div key={session.id} className="mb-4 last:mb-0">
                <h4 className="text-sm font-medium text-purple-800">{session.title}</h4>
                <div className="ml-4 mt-1 text-xs text-purple-600">
                  <div className="flex items-center">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    {format(parseISO(session.startTime), "h:mm a")} -{" "}
                    {format(parseISO(session.endTime), "h:mm a")}
                  </div>
                  <div className="flex items-center mt-1">
                    <MapPinIcon className="mr-1 h-3 w-3" />
                    {session.location}
                  </div>
                </div>
                <p className="mt-1 text-xs text-purple-700">{session.description}</p>
                <Separator className="my-2 bg-purple-200" />
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/login");
    }

    const academicEventsString = localStorage.getItem("academicEvents");
    if (academicEventsString) {
      const allEvents: AcademicEvent[] = JSON.parse(academicEventsString);
      setEvents(allEvents);
      console.log("Fetched all events:", allEvents);
    } else {
      console.log("No events found in localStorage");
    }
  }, [router]);

  const handleRegisterClick = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const handleViewScheduleClick = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className={`space-y-6 bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-lg ${openSans.className}`}>
      {/* Welcome Card */}
      <Card className="bg-white text-purple-900 border border-purple-200">
        <CardHeader>
          <CardTitle
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${montserrat.className}`}
          >
            Welcome to GrowthLink, {currentUser?.firstName} {currentUser?.lastName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm sm:text-base md:text-lg text-purple-700">
            Explore cutting-edge technologies, network with industry leaders, and boost your career
            through our workshops, seminars, and various academic events.
          </p>
          <div className="mt-4 flex space-x-4">
            <Button
              asChild
              variant="outline"
              className={`w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
            >
              <Link href="/academic-events">View All Academic Events</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Academic Events */}
      <Card className="bg-white text-purple-900 border border-purple-200">
        <CardHeader>
          <CardTitle className={`text-xl sm:text-2xl font-bold ${montserrat.className}`}>
            Upcoming Academic Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="border-b border-purple-200 pb-4 last:border-b-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <h3
                      className={`text-lg sm:text-xl font-semibold text-purple-800 ${montserrat.className}`}
                    >
                      {event.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 mt-2 sm:mt-0"
                    >
                      {event.eventType}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-purple-700">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {format(parseISO(event.startDate), "MMMM d, yyyy")} -{" "}
                        {format(parseISO(event.endDate), "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-purple-600">{event.description}</p>
                  <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                      size="sm"
                      className={`w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
                      onClick={() => handleRegisterClick(event)}
                    >
                      Register Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`w-full sm:w-auto text-purple-600 hover:bg-purple-100  ${montserrat.className}`}
                      onClick={() => handleViewScheduleClick(event)}
                    >
                      View Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-purple-700">No upcoming events found. Check back later!</p>
          )}
        </CardContent>
      </Card>

      {/* Call for Papers Component */}
      <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
        <CardHeader>
          <CardTitle
            className={`text-xl sm:text-2xl font-bold flex items-center ${montserrat.className}`}
          >
            <FileTextIcon className="mr-2" />
            Call for Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm sm:text-base">
            Share your research and insights at our upcoming conference. We're accepting papers on
            AI, Cloud Computing, and Cybersecurity.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <CalendarDaysIcon className="mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Deadline: August 15, 2023</span>
            </div>
            <div className="flex items-center">
              <FileTextIcon className="mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Max 10 pages, IEEE format</span>
            </div>
            <div className="flex items-center">
              <SendIcon className="mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Submit via EasyChair</span>
            </div>
          </div>
          <Button
            asChild
            variant="secondary"
            className={`w-full bg-white text-purple-600 hover:bg-purple-100 ${montserrat.className}`}
          >
            <Link href="/">Submit Your Paper</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Latest News and Announcements */}
      <Card className="bg-white text-purple-900 border border-purple-200">
        <CardHeader>
          <CardTitle
            className={`text-xl sm:text-2xl font-bold flex items-center ${montserrat.className}`}
          >
            <NewspaperIcon className="mr-2" />
            Latest News and Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsAndAnnouncements.map((item) => (
              <Card key={item.id} className="bg-purple-50">
                <CardHeader>
                  <CardTitle
                    className={`text-base sm:text-lg text-purple-800 ${montserrat.className}`}
                  >
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-purple-600 mb-2">{item.date}</p>
                  <p className="text-xs sm:text-sm mb-4 text-purple-700">{item.excerpt}</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={`w-full sm:w-auto bg-purple-100 text-purple-700 hover:bg-purple-200 ${montserrat.className}`}
                  >
                    <Link href={item.link}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Resources Card */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs sm:text-sm text-purple-700">
              Access a wealth of learning materials, tutorials, and guides.
            </p>
            <Button
              asChild
              variant="outline"
              className={`w-full bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
            >
              <Link href="/resources">Explore Resources</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Networking Card */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Networking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs sm:text-sm text-purple-700">
              Connect with peers, industry experts, and potential collaborators.
            </p>
            <Button
              asChild
              variant="outline"
              className={`w-full bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
            >
              <Link href="/networking">Start Networking</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mentors Card */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs sm:text-sm text-purple-700">
              Find guidance from experienced professionals in your field.
            </p>
            <Button
              asChild
              variant="outline"
              className={`w-full bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
            >
              <Link href="/mentors">Find a Mentor</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Job Opportunities Card */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Job Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs sm:text-sm text-purple-700">
              Discover career opportunities from top companies in the industry.
            </p>
            <Button
              asChild
              variant="outline"
              className={`w-full bg-purple-600 text-white hover:bg-purple-700 ${montserrat.className}`}
            >
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Event Highlights */}
      <Card className="bg-white text-purple-900 border border-purple-200">
        <CardHeader>
          <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
            Event Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-purple-700">
            <li>Diverse range of events including conferences, workshops, and seminars</li>
            <li>120+ industry-leading speakers and presenters</li>
            <li>Hands-on workshops and technical talks across various disciplines</li>
            <li>Networking opportunities with professionals and academics</li>
            <li>Career fair with 50+ companies hiring</li>
            <li>Latest trends in AI, Cloud Computing, Cybersecurity, and more</li>
          </ul>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Attendees Chart */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Monthly Attendees
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendeeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                <XAxis dataKey="month" stroke="#6B21A8" />
                <YAxis stroke="#6B21A8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendees" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Types Distribution Chart */}
        <Card className="bg-white text-purple-900 border border-purple-200">
          <CardHeader>
            <CardTitle className={`text-base sm:text-lg ${montserrat.className}`}>
              Event Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8B5CF6"
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

      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
        />
      )}

      {selectedEvent && (
        <EventScheduleModal
          event={selectedEvent}
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}

      <ChatComponent />
    </div>
  );
}
