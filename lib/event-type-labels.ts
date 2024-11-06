import type { EventType } from "@prisma/client";

export const eventTypeLabels: Record<EventType, string> = {
  CONFERENCE: "Conference",
  WORKSHOP: "Workshop",
  SEMINAR: "Seminar",
};

export function getEventTypeLabel(type: EventType): string {
  return eventTypeLabels[type] || type;
}
