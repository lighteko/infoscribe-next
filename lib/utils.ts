import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weekday2Cron(weekday: string) {
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = weekdays.indexOf(weekday.toUpperCase());
  if (dayOfWeek === -1) throw new Error("Invalid weekday");
  return `cron(0 8 ? * ${dayOfWeek} *)`;
}

export function cron2Weekday(cron: string) {
  const dayOfWeek = parseInt(cron.split(" ")[4]);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `Every ${weekdays[dayOfWeek]}`;
}
