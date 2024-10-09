"use client";

import { useState, useEffect } from "react";
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
  LogOutIcon,
  NetworkIcon,
  User,
  UserIcon,
  UserPenIcon,
  UsersIcon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation"; // Add this import

const navItems = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Jobs", icon: BriefcaseIcon, href: "/jobs" },
  { name: "Events", icon: CalendarIcon, href: "/events" },
  { name: "Mentorship Programs", icon: UsersIcon, href: "/mentorship-programs" },
  { name: "Resources", icon: FileTextIcon, href: "/resources" },
  { name: "Career Development", icon: GraduationCapIcon, href: "/career" },
  { name: "Networking", icon: NetworkIcon, href: "/networking" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname(); // Add this line
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">GrowthLink</h1>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="flex-grow overflow-y-auto">
          <nav className="px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Become a Mentor</h2>
            <p className="mt-1 text-sm text-gray-600">
              Unlock your mentorship skills and let others get privilege to listen to your
              teachings.
            </p>
            <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">
              mentor now
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 flex justify-between items-center p-3 lg:justify-end">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border border-gray-200 rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="shadow-lg rounded-md">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <UserPenIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
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
