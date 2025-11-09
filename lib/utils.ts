import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object into regular js object
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderError(error: any): { message: string } {
  console.log(error);

  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
}

// Normalize different error shapes into a plain string message
export function asStringMessage(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value) return "An error occurred";
  if (value instanceof Error) return value.message;
  try {
    const v = value as { message?: unknown };
    if (v && typeof v.message === "string") return v.message;
    return String(value);
  } catch {
    return "An error occurred";
  }
}

// Round num to 2 decimal places
export function roundToTwoDecimalPlaces(val: number | string) {
  if (typeof val === "number") {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  } else if (typeof val === "string") {
    return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is not a number or string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

// Format number as currency
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and time
export function formatDateTime(dateString: Date) {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const date = new Date(dateString);
  const formattedDateTime = date.toLocaleString("en-US", dateTimeOptions);
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return { formattedDateTime, formattedDate, formattedTime };
}
