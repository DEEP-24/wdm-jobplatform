"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BriefcaseIcon,
  CalendarIcon,
  FileTextIcon,
  GraduationCapIcon,
  HomeIcon,
  LogOut,
  NetworkIcon,
  User,
  UserIcon,
  UserPenIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";

const navItems = [
  { name: "Home", icon: HomeIcon, href: "/dashboard" },
  { name: "Jobs", icon: BriefcaseIcon, href: "/dashboard/jobs" },
  { name: "Events", icon: CalendarIcon, href: "/dashboard/events" },
  { name: "Mentorship Programs", icon: UsersIcon, href: "/dashboard/mentorship" },
  { name: "Resources", icon: FileTextIcon, href: "/dashboard/resources" },
  { name: "Profile", icon: UserIcon, href: "/dashboard/profile" },
  { name: "Career Development", icon: GraduationCapIcon, href: "/dashboard/career" },
  { name: "Networking", icon: NetworkIcon, href: "/dashboard/networking" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    // For example:
    // localStorage.removeItem('token')
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">GrowthLink</h1>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Become a Mentor</h2>
          <p className="mt-1 text-sm text-gray-600">
            Unlock your mentorship skills and let others get privilege to listen to your teachings.
          </p>
          <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">mentor now</Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 flex justify-end items-center p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border border-gray-200 rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg rounded-md">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <UserPenIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
