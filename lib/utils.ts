import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isWithinDateRange(testDate: Date, startDate: Date, endDate: Date): boolean {
  const test = new Date(testDate);
  const start = new Date(startDate);
  const end = new Date(endDate);

  test.setSeconds(0, 0);
  start.setSeconds(0, 0);
  end.setSeconds(0, 0);

  return test >= start && test <= end;
}

export function hasTimeConflict(
  startTime1: Date,
  endTime1: Date,
  startTime2: Date,
  endTime2: Date,
): boolean {
  const start1 = new Date(startTime1);
  const end1 = new Date(endTime1);
  const start2 = new Date(startTime2);
  const end2 = new Date(endTime2);

  start1.setSeconds(0, 0);
  end1.setSeconds(0, 0);
  start2.setSeconds(0, 0);
  end2.setSeconds(0, 0);

  return (
    (start1 <= start2 && end1 > start2) ||
    (start1 < end2 && end1 >= end2) ||
    (start2 <= start1 && end2 > start1) ||
    (start2 < end1 && end2 >= end1)
  );
}

export function getDisabledDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Disable past dates
  let date = new Date(currentDate);
  while (date < start) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  // Disable dates after end date
  date = new Date(end);
  date.setDate(date.getDate() + 1);
  while (date.getFullYear() === end.getFullYear() && date.getMonth() === end.getMonth()) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}
