"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getEventTypeLabel } from "@/lib/event-type-labels";
import { cn } from "@/lib/utils";
import { EventType } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import type { DateRange } from "react-day-picker";

const eventTypes = Object.values(EventType);

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
  const [validationErrors, setValidationErrors] = React.useState<{
    dates?: string;
    sessions?: string;
    registration?: string;
    sessionTime?: string;
    sessionConflicts: { [key: number]: string | null };
  }>({
    sessionConflicts: {},
  });
  const [eventLocation, setEventLocation] = React.useState("");
  const [eventMaxAttendees, setEventMaxAttendees] = React.useState<number>(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const registrationDeadline = watch("registrationDeadline");
  const sessions = watch("sessions");

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });

  React.useEffect(() => {
    const newErrors: typeof validationErrors = {
      sessionConflicts: {},
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        newErrors.dates = "Event end date must be on or after start date";
      }
    }

    if (registrationDeadline && startDate) {
      const regDeadline = new Date(registrationDeadline);
      const start = new Date(startDate);
      if (regDeadline > start) {
        newErrors.registration = "Registration deadline must be on or before event start date";
      }
    }

    setValidationErrors(newErrors);
  }, [startDate, endDate, registrationDeadline]);

  React.useEffect(() => {
    if (!sessions || sessions.length === 0) {
      return;
    }

    const validateSessions = () => {
      const sessionConflicts: { [key: number]: string | null } = {};

      sessions.forEach((session, index) => {
        sessionConflicts[index] = null;

        if (!session.startTime || !session.endTime) {
          return;
        }

        const currentStart = new Date(session.startTime).getTime();
        const currentEnd = new Date(session.endTime).getTime();

        // Check if end time is before start time
        if (currentEnd <= currentStart) {
          sessionConflicts[index] = "Session end time must be after start time";
          return;
        }

        // Check for conflicts with other sessions
        sessions.forEach((otherSession, otherIndex) => {
          if (
            index === otherIndex ||
            !otherSession.startTime ||
            !otherSession.endTime ||
            sessionConflicts[index]
          ) {
            return;
          }

          const otherStart = new Date(otherSession.startTime).getTime();
          const otherEnd = new Date(otherSession.endTime).getTime();

          if (
            (currentStart >= otherStart && currentStart < otherEnd) ||
            (currentEnd > otherStart && currentEnd <= otherEnd) ||
            (currentStart <= otherStart && currentEnd >= otherEnd)
          ) {
            sessionConflicts[index] = `This session conflicts with Session ${otherIndex + 1}`;
          }
        });
      });

      setValidationErrors((prev) => ({
        ...prev,
        sessionConflicts,
      }));
    };

    // Create a subscription to watch all session times
    const subscription = watch((_value, { name }) => {
      if (
        name?.includes("sessions") &&
        (name?.includes("startTime") || name?.includes("endTime"))
      ) {
        validateSessions();
      }
    });

    // Run initial validation
    validateSessions();

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [sessions, watch]);

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setEventLocation(newLocation);
  };

  // Handle max attendees change
  const handleMaxAttendeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxAttendees = Number.parseInt(e.target.value) || 0;
    setEventMaxAttendees(newMaxAttendees);
  };

  const onSubmit = async (data: EventForm) => {
    // Check only for actual validation errors
    const hasErrors =
      validationErrors.dates ||
      validationErrors.registration ||
      Object.values(validationErrors.sessionConflicts).some((error) => error !== null);

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/academic-events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      toast({
        title: "Event Added",
        description: "Your event has been successfully added.",
      });

      router.push("/academic-events");
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }

    const eventStart = new Date(`${startDate}T00:00:00`);
    const eventEnd = new Date(`${endDate}T23:59:59`);

    // Check all sessions and clear times if they're outside the event range
    sessions?.forEach((session, index) => {
      if (session.startTime) {
        const sessionStart = new Date(session.startTime);
        if (sessionStart < eventStart || sessionStart > eventEnd) {
          setValue(`sessions.${index}.startTime`, "");
        }
      }
      if (session.endTime) {
        const sessionEnd = new Date(session.endTime);
        if (sessionEnd < eventStart || sessionEnd > eventEnd) {
          setValue(`sessions.${index}.endTime`, "");
        }
      }
    });
  }, [startDate, endDate, sessions, setValue]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Add New Academic Event</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show validation errors at the top */}
          {Object.entries(validationErrors).map(
            ([key, error]) =>
              error &&
              key !== "sessionConflicts" && (
                <Alert variant="destructive" className="mb-4" key={key}>
                  <AlertTitle className="capitalize">{key} Error</AlertTitle>
                  <AlertDescription>{error as string}</AlertDescription>
                </Alert>
              ),
          )}
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
                              {getEventTypeLabel(type)}
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
                    onChange={handleLocationChange}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Event Date Range</Label>
                  <DatePickerWithRange
                    dateRange={dateRange}
                    onDateRangeChange={(range: DateRange | undefined) => {
                      setDateRange(range);
                      if (range?.from) {
                        setValue("startDate", range.from.toISOString().split("T")[0]);
                      }
                      if (range?.to) {
                        setValue("endDate", range.to.toISOString().split("T")[0]);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    type="number"
                    id="maxAttendees"
                    {...register("maxAttendees", { required: "Max attendees is required", min: 1 })}
                    onChange={handleMaxAttendeesChange}
                  />
                  {errors.maxAttendees && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxAttendees.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !registrationDeadline && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {registrationDeadline ? (
                          format(new Date(registrationDeadline), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={registrationDeadline ? new Date(registrationDeadline) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const correctedDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000,
                            );
                            setValue(
                              "registrationDeadline",
                              correctedDate.toISOString().split("T")[0],
                            );
                          }
                        }}
                        disabled={(date) => {
                          if (!startDate) {
                            return false;
                          }
                          const startDateTime = new Date(startDate);
                          startDateTime.setHours(0, 0, 0, 0);
                          return date > startDateTime;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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

                      {(validationErrors.sessionConflicts[index] ||
                        (watch(`sessions.${index}.startTime`) &&
                          watch(`sessions.${index}.endTime`) &&
                          new Date(watch(`sessions.${index}.endTime`)) <=
                            new Date(watch(`sessions.${index}.startTime`)))) && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertTitle>Time Error</AlertTitle>
                          <AlertDescription>
                            {validationErrors.sessionConflicts[index] ||
                              "Session end time must be after start time"}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`sessions.${index}.startTime`}>Start Time</Label>
                          <Input
                            type="datetime-local"
                            {...register(`sessions.${index}.startTime` as const)}
                            min={startDate ? `${startDate}T00:00` : undefined}
                            max={endDate ? `${endDate}T23:59` : undefined}
                            onChange={(e) => {
                              const startTime = new Date(e.target.value);
                              const endTime = watch(`sessions.${index}.endTime`);

                              // Validate if the selected time is within event date range
                              if (startDate && endDate) {
                                const eventStart = new Date(`${startDate}T00:00:00`);
                                const eventEnd = new Date(`${endDate}T23:59:59`);

                                if (startTime < eventStart || startTime > eventEnd) {
                                  e.preventDefault();
                                  setValue(`sessions.${index}.startTime`, "");
                                  return;
                                }
                              }

                              // Clear end time if start time is after it
                              if (endTime && startTime > new Date(endTime)) {
                                setValue(`sessions.${index}.endTime`, "");
                              }

                              // Update the form value
                              setValue(`sessions.${index}.startTime`, e.target.value, {
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                            }}
                            placeholder="Select start time"
                            step="60"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.endTime`}>End Time</Label>
                          <Input
                            type="datetime-local"
                            {...register(`sessions.${index}.endTime` as const)}
                            min={
                              watch(`sessions.${index}.startTime`) ||
                              (startDate ? `${startDate}T00:00` : undefined)
                            }
                            max={endDate ? `${endDate}T23:59` : undefined}
                            placeholder="Select end time"
                            step="60"
                            disabled={!watch(`sessions.${index}.startTime`)}
                            onChange={(e) => {
                              const endTime = new Date(e.target.value);

                              // Validate if the selected time is within event date range
                              if (startDate && endDate) {
                                const eventStart = new Date(`${startDate}T00:00:00`);
                                const eventEnd = new Date(`${endDate}T23:59:59`);

                                if (endTime < eventStart || endTime > eventEnd) {
                                  e.preventDefault();
                                  setValue(`sessions.${index}.endTime`, "");
                                  return;
                                }
                              }

                              // Update the form value
                              setValue(`sessions.${index}.endTime`, e.target.value, {
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.location`}>Location</Label>
                          <Input
                            {...register(`sessions.${index}.location` as const)}
                            value={eventLocation}
                            disabled
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sessions.${index}.maxAttendees`}>Max Attendees</Label>
                          <Input
                            type="number"
                            {...register(`sessions.${index}.maxAttendees` as const)}
                            value={eventMaxAttendees}
                            disabled
                          />
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
                    location: eventLocation,
                    maxAttendees: eventMaxAttendees,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Session
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              disabled={
                !!validationErrors.dates ||
                !!validationErrors.registration ||
                Object.values(validationErrors.sessionConflicts).some((error) => error !== null)
              }
            >
              Add Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
