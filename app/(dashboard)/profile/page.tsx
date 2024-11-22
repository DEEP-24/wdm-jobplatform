"use client";

import { format } from "date-fns";
import { CalendarIcon, Mail, MapPin, Phone, UserCircle } from "lucide-react";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { USA_STATES } from "@/app/constants/usa-states";
import type { User } from "@/app/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

type ProfileFormValues = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  dob: string;
  notificationPreferences: string[];
  password?: string;
  confirmPassword?: string;
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      dob: "",
      notificationPreferences: [],
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });

        const data = await response.json();

        if (!data.authenticated || !data.user) {
          router.push("/login");
          return;
        }

        const user = data.user;
        setUserData(user);

        // Parse notification preferences if it's a string
        let notificationPrefs: string[] = [];
        try {
          notificationPrefs = user.notificationPreferences
            ? JSON.parse(user.notificationPreferences)
            : [];
        } catch {
          notificationPrefs = [];
        }

        // Format the data for the form
        form.reset({
          id: user.id || "",
          email: user.email || "",
          firstName: user.profile?.firstName || "",
          lastName: user.profile?.lastName || "",
          phone: user.profile?.phone || "",
          streetAddress: user.profile?.streetAddress || "",
          city: user.profile?.city || "",
          state: user.profile?.state || "",
          postalCode: user.profile?.postalCode || "",
          dob: user.profile?.dob || "",
          notificationPreferences: notificationPrefs,
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router, form]);

  async function onSubmit(values: ProfileFormValues) {
    try {
      if (values.password !== values.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      const dataToSend = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        dob: values.dob,
        notificationPreferences: JSON.stringify(values.notificationPreferences),
        ...(values.password && { password: values.password }),
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUserData(data.user); // Update local state with new user data
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        form.setValue("password", "");
        form.setValue("confirmPassword", "");
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-700" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-purple-100 to-white ${poppins.className}`}>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-purple-700 text-white p-8">
            <div className="mx-auto mb-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage
                  src="/placeholder.svg?height=128&width=128"
                  alt={`${userData?.profile?.firstName || ""} ${userData?.profile?.lastName || ""}`}
                />
                <AvatarFallback>
                  {userData?.profile ? (
                    `${userData.profile.firstName[0]}${userData.profile.lastName[0]}`
                  ) : (
                    <UserCircle className="w-32 h-32" />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-4xl font-bold mb-2">
              {userData?.profile
                ? `${userData.profile.firstName} ${userData.profile.lastName}'s Profile`
                : "Your Profile"}
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg">{userData?.email}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-800 font-semibold">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="email@example.com"
                              className="bg-gray-50 border-purple-200 pl-10"
                            />
                            <Mail
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                              size={18}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                          <FormDescription>Leave blank to keep current password</FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">
                            Confirm New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 items-center justify-center">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel className="text-purple-800 font-semibold">
                            Date of Birth
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal bg-gray-50 border-purple-200 ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value ? new Date(field.value) : new Date(), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel className="text-purple-800 font-semibold">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="1234567890"
                                {...field}
                                className="bg-gray-50 border-purple-200 pl-10"
                              />
                              <Phone
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                                size={18}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator className="my-8 bg-purple-200" />
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-purple-800">Address Information</h3>
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-800 font-semibold">
                          Street Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="123 Main St"
                              {...field}
                              className="bg-gray-50 border-purple-200 pl-10"
                            />
                            <MapPin
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                              size={18}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-6 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Anytown"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">State</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-50 border-purple-200">
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {USA_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-semibold">Zip Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12345"
                              {...field}
                              className="bg-gray-50 border-purple-200"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator className="my-8 bg-purple-200" />
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-purple-800">
                    Notification Preferences
                  </h3>
                  <FormField
                    control={form.control}
                    name="notificationPreferences"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value.includes("email")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...field.value, "email"]
                                  : field.value.filter((v) => v !== "email");
                                field.onChange(updatedValue);
                              }}
                            />
                            <label
                              htmlFor="email"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Email
                            </label>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 rounded-lg transition-colors duration-300"
                >
                  Update Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
