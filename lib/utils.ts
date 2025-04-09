import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function weekday2Cron(weekday: string, hour: number = 8) {
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayOfWeek = weekdays.indexOf(weekday.toUpperCase());
  if (dayOfWeek === -1) throw new Error("Invalid weekday");

  const targetTimezone = getBrowserTimezone();

  // Create a date object for the next occurrence of the specified weekday
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntilTarget);
  targetDate.setHours(hour, 0, 0, 0);

  // Convert to UTC
  const utcDate = new Date(
    targetDate.toLocaleString("en-US", { timeZone: targetTimezone })
  );
  const utcHour = utcDate.getUTCHours();
  const utcDayOfWeek = utcDate.getUTCDay();

  return `cron(0 ${utcHour} ? * ${utcDayOfWeek} *)`;
}

export function cron2Weekday(cron: string) {
  // Remove 'cron(' and ')' from the string and split
  const cronParts = cron.replace("cron(", "").replace(")", "").split(" ");
  const [minute, hour, , , dayOfWeek] = cronParts;

  const targetTimezone = getBrowserTimezone();

  // Create a date object in UTC
  const utcDate = new Date();
  utcDate.setUTCHours(parseInt(hour), parseInt(minute), 0, 0);
  utcDate.setUTCDate(
    utcDate.getUTCDate() + ((parseInt(dayOfWeek) - utcDate.getUTCDay() + 7) % 7)
  );

  // Convert to local time in the browser's timezone
  const localDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: targetTimezone })
  );
  const localHour = localDate.getHours();
  const localDayOfWeek = localDate.getDay();

  // Convert to 12-hour format with AM/PM
  const period = localHour >= 12 ? "P.M." : "A.M.";
  const displayHour = localHour % 12 || 12; // Convert 0 to 12 for 12 AM

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `Every ${weekdays[localDayOfWeek]} at ${displayHour}:00 ${period}`;
}

export function cron2LocalTimeFormat(cron: string): {
  weekday: string;
  hour: number;
  period: string;
} {
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [minute, hour, , , dayOfWeek] = cron
    .replace("cron(", "")
    .replace(")", "")
    .split(" ");
  const targetTimezone = getBrowserTimezone();
  const utcDate = new Date();
  utcDate.setUTCHours(parseInt(hour), parseInt(minute), 0, 0);
  utcDate.setUTCDate(
    utcDate.getUTCDate() + ((parseInt(dayOfWeek) - utcDate.getUTCDay() + 7) % 7)
  );

  const localDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: targetTimezone })
  );
  const localHour = localDate.getHours();
  const localDayOfWeek = localDate.getDay();

  const period = localHour >= 12 ? "P.M." : "A.M.";
  const displayHour = localHour % 12 || 12;

  return {
    weekday: weekdays[localDayOfWeek],
    hour: displayHour,
    period: period,
  };
}
