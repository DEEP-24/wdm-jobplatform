"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/app/types/user";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState<User & { confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNo: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: User) => u.email === formData.email)) {
      toast({
        title: "Error",
        description: "User already exists.",
        variant: "destructive",
      });
    } else {
      const { confirmPassword, ...userWithoutConfirmPassword } = formData;
      users.push(userWithoutConfirmPassword);
      localStorage.setItem("users", JSON.stringify(users));
      toast({
        title: "Success",
        description: "You have successfully registered.",
      });
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* <div>
          <h1 className="text-center text-4xl font-extrabold text-gray-900">
            Welcome to <span className="text-black">GrowthLink</span>
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">Empowering Your Growth Journey</p>
        </div> */}
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  required
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street
                </Label>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                  Zipcode
                </Label>
                <Input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  required
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Sign up
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="font-medium text-gray-900 hover:text-gray-700 hover:underline"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
