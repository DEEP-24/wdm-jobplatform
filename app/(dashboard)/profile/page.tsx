"use client";

import { format } from "date-fns";
import { CalendarIcon, UserCircle, Mail, Phone, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Poppins } from "next/font/google";

import type { User } from "@/app/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { USA_STATES } from "@/app/constants/usa-states";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function ProfilePage() {
  const form = useForm<User & { notificationPreferences: string[]; notificationMessage: string }>({
    defaultValues: {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dob: "",
      phoneNo: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      notificationPreferences: [],
      notificationMessage: "",
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user: User & { notificationPreferences?: string[]; notificationMessage?: string } =
        JSON.parse(storedUser);
      console.log("Loaded user data:", user);
      form.reset({
        ...user,
        notificationPreferences: user.notificationPreferences || [],
        notificationMessage: user.notificationMessage || "",
      });
    }
  }, [form]);

  function onSubmit(
    values: User & { notificationPreferences: string[]; notificationMessage: string },
  ) {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((user) => user.id === values.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...values,
      };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(values));

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      form.reset(values);
    } else {
      toast({
        title: "Error",
        description: "User not found. Unable to update profile.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-purple-100 to-white ${poppins.className}`}>
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="text-center bg-purple-700 text-white p-8">
            <div className="mx-auto mb-6">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile picture" />
                <AvatarFallback>
                  <UserCircle className="w-32 h-32" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-4xl font-bold mb-2">Your Profile</CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Update your profile details and preferences
            </CardDescription>
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
                              placeholder="johndoe@example.com"
                              {...field}
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
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-800 font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="bg-gray-50 border-purple-200"
                          />
                        </FormControl>
                        <FormDescription>Leave blank to keep current password</FormDescription>
                      </FormItem>
                    )}
                  />
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
                                    format(new Date(field.value), "PPP")
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
                                onSelect={(date) =>
                                  field.onChange(date ? date.toISOString().split("T")[0] : "")
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
                      name="phoneNo"
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
                    name="street"
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
                      name="zipcode"
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
                        <FormLabel className="text-purple-800 font-semibold">
                          Choose your notification methods:
                        </FormLabel>
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
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value.includes("sms")}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...field.value, "sms"]
                                  : field.value.filter((v) => v !== "sms");
                                field.onChange(updatedValue);
                              }}
                            />
                            <label
                              htmlFor="sms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Text Message (SMS)
                            </label>
                          </div>
                        </div>
                        <FormDescription>Select one or more notification methods.</FormDescription>
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
