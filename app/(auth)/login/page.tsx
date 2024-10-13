"use client";

import type { User, UserRole } from "@/app/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hard-coded users for testing
const testUsers: User[] = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@app.com",
    password: "password",
    dob: "1990-01-01",
    phoneNo: "1234567890",
    street: "123 Admin St",
    city: "Admin City",
    state: "CA",
    zipcode: "12345",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    firstName: "Employer",
    lastName: "User",
    email: "employer@app.com",
    password: "password",
    dob: "1985-05-15",
    phoneNo: "2345678901",
    street: "456 Employer Ave",
    city: "Employer City",
    state: "NY",
    zipcode: "23456",
    role: "employer" as UserRole,
  },
  {
    id: "3",
    firstName: "Organizer",
    lastName: "User",
    email: "organizer@app.com",
    password: "password",
    dob: "1988-09-20",
    phoneNo: "3456789012",
    street: "789 Organizer Blvd",
    city: "Organizer City",
    state: "TX",
    zipcode: "34567",
    role: "organizer" as UserRole,
  },
  {
    id: "4",
    firstName: "Mentor",
    lastName: "User",
    email: "mentor@app.com",
    password: "password",
    dob: "1982-03-10",
    phoneNo: "4567890123",
    street: "101 Mentor Rd",
    city: "Mentor City",
    state: "FL",
    zipcode: "45678",
    role: "mentor" as UserRole,
  },
  {
    id: "5",
    firstName: "Student",
    lastName: "User",
    email: "student@app.com",
    password: "password",
    dob: "2000-07-30",
    phoneNo: "5678901234",
    street: "202 Student Ln",
    city: "Student City",
    state: "IL",
    zipcode: "56789",
    role: "student" as UserRole,
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const newUsers = testUsers.filter(
      (testUser) => !storedUsers.some((storedUser) => storedUser.email === testUser.email),
    );
    if (newUsers.length > 0) {
      localStorage.setItem("users", JSON.stringify([...storedUsers, ...newUsers]));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: User) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/");
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="relative">
                <MailIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <LockIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              Sign in
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600 flex flex-col items-center justify-center">
            <p className="font-semibold">Testing credentials:</p>
            <div className="flex flex-col items-center gap-2 justify-center">
              <div className="flex items-center gap-2 justify-center">
                <p className="font-semibold">Role: Admin</p>
                <p>admin@app.com</p>
                <p>password</p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-semibold">Role: Employer</p>
                <p>employer@app.com</p>
                <p>password</p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-semibold">Role: Organizer</p>
                <p>organizer@app.com</p>
                <p>password</p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-semibold">Role: Mentor</p>
                <p>mentor@app.com</p>
                <p>password</p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p className="font-semibold">Role: Student</p>
                <p>student@app.com</p>
                <p>password</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          <Link
            href="/register"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors hover:underline"
          >
            Create a new account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
