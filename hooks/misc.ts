import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string, type: "date" | "time" = "date") => {
  const date = parseISO(dateString);
  if (type === "time") {
    return format(date, "h:mm a");
  }
  return format(date, "MMM d, h:mm a");
};
