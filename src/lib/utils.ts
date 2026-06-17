/** @format */

import { clsx, type ClassValue } from "clsx";
import { intervalToDuration, formatDate as formatDateFns } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLedgerEntryKind(
  kind: "charge" | "refund" | "purchase" | "grant" | "adjustment",
) {
  switch (kind) {
    case "charge":
      return "Charge";
    case "refund":
      return "Refund";
    case "purchase":
      return "Purchase";
    case "grant":
      return "Grant";
    case "adjustment":
      return "Adjustment";
    default:
      return kind;
  }
}

export function formatDurationCompact(
  startedAt: string | undefined,
  finishedAt: string | undefined,
): string {
  if (!startedAt || !finishedAt) return "—";
  const { hours, minutes, seconds } = intervalToDuration({
    start: new Date(startedAt),
    end: new Date(finishedAt),
  });
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds ?? 0}s`);
  return parts.join(" ");
}

export function formatDate(iso: string) {
  return formatDateFns(new Date(iso), "MMM d, yyyy");
}
