"use client";

import { USA_STATES } from "@/app/constants/usa-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { registerSchema } from "@/app/schema";
import { toast } from "@/hooks/use-toast";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [step, setStep] = React.useState(1);
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
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
      role: UserRole.USER,
    },
  });

  const handleNextStep = async () => {
    try {
      if (step === 1) {
        const stepValid = await form.trigger(["email", "password", "confirmPassword"]);
        if (!stepValid) {
          return;
        }
        setStep(2);
      } else if (step === 2) {
        const stepValid = await form.trigger(["firstName", "lastName", "dob", "phoneNo"]);
        if (!stepValid) {
          return;
        }
        setStep(3);
      }
    } catch (error) {
      console.error("Step validation error:", error);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    if (step !== 3) {
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          if (Array.isArray(data.error)) {
            data.error.forEach((err: any) => {
              form.setError(err.path[0] as any, {
                message: err.message,
              });
            });
          } else {
            form.setError("root", {
              message: data.error || "Registration failed",
            });
          }
          return;
        }

        throw new Error(data.error || "Registration failed");
      }

      if (data.success) {
        toast({
          title: "Registration successful",
          description: "Please login to continue",
        });

        router.push("/login");
      } else {
        form.setError("root", {
          message: "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      form.setError("root", {
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-lg border border-purple-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Create your account
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.formState.errors.root && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <MailIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...form.register("email")}
                    type="email"
                    className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
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
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
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
                    {...form.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
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
                      {...form.register("firstName")}
                      type="text"
                      className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
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
                      {...form.register("lastName")}
                      type="text"
                      className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                  )}
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
                    {...form.register("dob")}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {form.formState.errors.dob && (
                  <p className="text-sm text-red-500">{form.formState.errors.dob.message}</p>
                )}
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
                    {...form.register("phoneNo")}
                    type="tel"
                    className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {form.formState.errors.phoneNo && (
                  <p className="text-sm text-red-500">{form.formState.errors.phoneNo.message}</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
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
                    {...form.register("street")}
                    type="text"
                    className="pl-10 bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                {form.formState.errors.street && (
                  <p className="text-sm text-red-500">{form.formState.errors.street.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City
                  </Label>
                  <Input
                    {...form.register("city")}
                    type="text"
                    className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State
                  </Label>
                  <Controller
                    name="state"
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500">
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
                    )}
                  />
                  {form.formState.errors.state && (
                    <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipcode" className="text-sm font-medium text-gray-700">
                  Zipcode
                </Label>
                <Input
                  {...form.register("zipcode")}
                  type="text"
                  maxLength={5}
                  className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                />
                {form.formState.errors.zipcode && (
                  <p className="text-sm text-red-500">{form.formState.errors.zipcode.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                        <SelectItem value={UserRole.EMPLOYER}>Employer</SelectItem>
                        <SelectItem value={UserRole.ORGANIZER}>Organizer</SelectItem>
                        <SelectItem value={UserRole.MENTOR}>Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.role && (
                  <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" onClick={handlePrevStep} variant="outline">
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="ml-auto bg-purple-600 text-white hover:bg-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto bg-purple-600 text-white hover:bg-purple-700"
              >
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
          className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors hover:underline"
        >
          Already have an account? Login
        </Link>
      </CardFooter>
    </Card>
  );
}
