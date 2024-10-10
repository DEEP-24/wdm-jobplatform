"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { User, UserRole } from "@/app/types/user";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon, UserIcon, CalendarIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USA_STATES } from "@/app/constants/usa-states";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Omit<User, "id"> & { confirmPassword: string }>({
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
    role: "student" as UserRole,
  });

  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData({ ...formData, role: value });
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
      const newId = users.length > 0 ? String(Number(users[users.length - 1].id) + 1) : "1";
      const newUser: User = {
        ...userWithoutConfirmPassword,
        id: newId,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      toast({
        title: "Success",
        description: "You have successfully registered.",
      });
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Create your account
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleRegister} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
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
                      value={formData.email}
                      onChange={handleChange}
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
                      autoComplete="new-password"
                      required
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <LockIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative">
                      <UserIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <div className="relative">
                      <UserIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNo" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <PhoneIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="phoneNo"
                      name="phoneNo"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.phoneNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                    Street Address
                  </Label>
                  <div className="relative">
                    <MapPinIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="street"
                      name="street"
                      type="text"
                      required
                      className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.street}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                      State
                    </Label>
                    <Select onValueChange={handleStateChange} value={formData.state}>
                      <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {USA_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-sm font-medium text-gray-700">
                    Zipcode
                  </Label>
                  <Input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    required
                    className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                    value={formData.zipcode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <Select onValueChange={handleRoleChange} value={formData.role}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-gray-500 focus:border-gray-500">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="organizer">Organizer</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" onClick={handlePrevStep} variant="outline">
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto bg-black text-white hover:bg-gray-800">
                  Sign up
                </Button>
              )}
            </div>
          </form>
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
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors hover:underline"
          >
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
