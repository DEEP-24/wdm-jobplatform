"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const eventTypes = ["Conference", "Workshop", "Seminar"] as const;
type EventType = (typeof eventTypes)[number];

interface EventForm {
  title: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  registrationDeadline: string;
  sessions: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    maxAttendees: number;
  }[];
}

export default function AddEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventForm>({
    defaultValues: {
      sessions: [
        { title: "", description: "", startTime: "", endTime: "", location: "", maxAttendees: 0 },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sessions",
  });

  const onSubmit = (data: EventForm) => {
    const newEvent = {
      id: uuidv4(),
      ...data,
      status: "Upcoming",
      sessions: data.sessions.map((session) => ({
        id: uuidv4(),
        eventId: uuidv4(), // This will be replaced with the actual event ID
        ...session,
      })),
    };

    // Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");

    // Add new event
    existingEvents.push(newEvent);

    // Save updated events to localStorage
    localStorage.setItem("events", JSON.stringify(existingEvents));

    toast({
      title: "Event Added",
      description: "Your event has been successfully added.",
    });

    router.push("/events");
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Add New Academic Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" {...register("title", { required: "Title is required" })} />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Controller
                    name="eventType"
                    control={control}
                    rules={{ required: "Event type is required" }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Location is required" })}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    {...register("startDate", { required: "Start date is required" })}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    {...register("endDate", { required: "End date is required" })}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    type="number"
                    id="maxAttendees"
                    {...register("maxAttendees", { required: "Max attendees is required", min: 1 })}
                  />
                  {errors.maxAttendees && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxAttendees.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    type="date"
                    id="registrationDeadline"
                    {...register("registrationDeadline", {
                      required: "Registration deadline is required",
                    })}
                  />
                  {errors.registrationDeadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.registrationDeadline.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Sessions</h3>
              {fields.map((field, index) => (
                <Card key={field.id} className="mb-4">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`sessions.${index}.title`}>Session Title</Label>
                        <Input
                          {...register(`sessions.${index}.title` as const, {
                            required: "Session title is required",
                          })}
                        />
                        {errors.sessions?.[index]?.title && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.sessions[index]?.title?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`sessions.${index}.description`}>Session Description</Label>
                        <Textarea
                          {...register(`sessions.${index}.description` as const, {
                            required: "Session description is required",
                          })}
                        />
                        {errors.sessions?.[index]?.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.sessions[index]?.description?.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`sessions.${index}.startTime`}>Start Time</Label>
                          <Input
                            type="datetime-local"
                            {...register(`sessions.${index}.startTime` as const, {
                              required: "Start time is required",
                            })}
                          />
                          {errors.sessions?.[index]?.startTime && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.sessions[index]?.startTime?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.endTime`}>End Time</Label>
                          <Input
                            type="datetime-local"
                            {...register(`sessions.${index}.endTime` as const, {
                              required: "End time is required",
                            })}
                          />
                          {errors.sessions?.[index]?.endTime && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.sessions[index]?.endTime?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.location`}>Location</Label>
                          <Input
                            {...register(`sessions.${index}.location` as const, {
                              required: "Session location is required",
                            })}
                          />
                          {errors.sessions?.[index]?.location && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.sessions[index]?.location?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.maxAttendees`}>Max Attendees</Label>
                          <Input
                            type="number"
                            {...register(`sessions.${index}.maxAttendees` as const, {
                              required: "Max attendees is required",
                              min: 1,
                            })}
                          />
                          {errors.sessions?.[index]?.maxAttendees && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.sessions[index]?.maxAttendees?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-4"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove Session
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    startTime: "",
                    endTime: "",
                    location: "",
                    maxAttendees: 0,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Session
              </Button>
            </div>

            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              Add Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
