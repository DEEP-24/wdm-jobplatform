"use client";

import { format } from "date-fns";
import { CalendarIcon, UserCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const form = useForm<User & { notificationPreferences: string[] }>({
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
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user: User & { notificationPreferences?: string[] } = JSON.parse(storedUser);
      console.log("Loaded user data:", user);
      form.reset({
        ...user,
        notificationPreferences: user.notificationPreferences || [],
      });
    }
  }, [form]);

  function onSubmit(values: User & { notificationPreferences: string[] }) {
    // Get all users from localStorage
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Find the index of the current user
    const userIndex = users.findIndex((user) => user.id === values.id);

    if (userIndex !== -1) {
      // Update the user in the users array
      users[userIndex] = {
        ...users[userIndex],
        ...values,
      };

      // Update users in localStorage
      localStorage.setItem("users", JSON.stringify(users));

      // Update currentUser in localStorage
      localStorage.setItem("currentUser", JSON.stringify(values));

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

      // Force a re-render by resetting the form with the new values
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
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
              <AvatarFallback>
                <UserCircle className="w-24 h-24" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">Profile</CardTitle>
          <CardDescription>Update your profile details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>Leave blank to keep current password</FormDescription>
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2 items-center justify-center">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preference</h3>
                <FormField
                  control={form.control}
                  name="notificationPreferences"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes("email")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange(["email"]);
                            } else {
                              field.onChange([]);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Email Notifications</FormLabel>
                        <FormDescription>Receive notifications via email.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
