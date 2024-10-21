"use client";

import type { User, UserRole } from "@/app/types/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Roboto, Poppins } from "next/font/google";
import {
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  GraduationCapIcon,
  HomeIcon,
  LogOutIcon,
  Menu,
  MessageSquareCodeIcon,
  UserIcon,
  UserPenIcon,
  Users2Icon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LoadingComponent } from "./_components/loading";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const navItems = [
  { name: "Home", icon: HomeIcon, href: "/", roles: ["admin", "student"] },
  {
    name: "Forums",
    icon: MessageSquareCodeIcon,
    href: "/forums",
    roles: ["admin", "student"],
  },
  {
    name: "Opportunities",
    icon: BriefcaseIcon,
    href: "/jobs",
    roles: ["admin", "employer", "student"],
  },
  {
    name: "Events",
    icon: CalendarIcon,
    href: "/academic-events",
    roles: ["admin", "organizer", "student"],
  },
  { name: "Mentors", icon: Users2Icon, href: "/mentors", roles: ["admin", "mentor", "student"] },
  { name: "Resources", icon: FileTextIcon, href: "/resources", roles: ["admin", "student"] },
  {
    name: "Career",
    icon: GraduationCapIcon,
    href: "/career-development",
    roles: ["admin", "student"],
  },
];

interface ModernLayoutProps {
  children: React.ReactNode;
}

export default function ModernLayout({ children }: ModernLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("student");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      router.push("/login");
    } else {
      const user: User = JSON.parse(storedUser);
      setUserRole(user.role);
      const mentors = JSON.parse(localStorage.getItem("mentors") || "[]");
      setIsMentor(mentors.some((mentor: any) => mentor.id === user.id));
    }
  }, [router]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${roboto.className}`}>
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 bg-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className={`text-2xl font-bold flex items-center space-x-2 ${poppins.className}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
              <span className="font-extrabold tracking-tight">GrowthLink</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems
                .filter((item) => item.roles.includes(userRole))
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                      pathname === item.href
                        ? "bg-purple-800 text-white"
                        : "text-purple-100 hover:bg-purple-600"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
            </nav>
            <div className="flex items-center space-x-2">
              {userRole === "student" && !isMentor && (
                <Button
                  asChild
                  className={`bg-purple-500 text-white hover:bg-purple-400 transition-colors duration-150 font-semibold shadow-md hidden md:flex ${poppins.className}`}
                >
                  <Link href="/become-a-mentor">Become a Mentor</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-purple-600 rounded-full transition-colors duration-150"
                  >
                    <UserIcon className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 p-2 rounded-md shadow-lg bg-white"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors duration-150"
                    >
                      <UserPenIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-purple-600 transition-colors duration-150"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-purple-700 text-white transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-purple-600">
            <Link
              href="/"
              className={`text-2xl font-bold flex items-center space-x-2 ${poppins.className}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
              <span className="font-extrabold tracking-tight">GrowthLink</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-purple-600 transition-colors duration-150"
              onClick={toggleMobileMenu}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-grow px-4 py-6 overflow-y-auto">
            {navItems
              .filter((item) => item.roles.includes(userRole))
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-lg font-medium transition-colors duration-150 ${
                    pathname === item.href
                      ? "bg-purple-800 text-white"
                      : "text-purple-100 hover:bg-purple-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            {userRole === "student" && !isMentor && (
              <Link
                href="/become-a-mentor"
                className={`flex items-center px-3 py-2 mt-4 rounded-md text-lg font-medium bg-purple-500 text-white hover:bg-purple-400 transition-colors duration-150 shadow-md ${poppins.className}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users2Icon className="mr-3 h-5 w-5" />
                Become a Mentor
              </Link>
            )}
          </nav>
          <div className="p-4 border-t border-purple-600">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOutIcon className="mr-2 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
      </main>
    </div>
  );
}
