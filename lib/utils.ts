import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function weeklyCron(weekday: string) {
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = weekdays.indexOf(weekday.toUpperCase());
  if (dayOfWeek === -1) throw new Error("Invalid weekday");
  return `cron(0 8 ? * ${dayOfWeek} *)`;
}
