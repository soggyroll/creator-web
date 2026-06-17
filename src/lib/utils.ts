/** @format */

import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLedgerEntryKind(kind: "charge" | "refund") {
  switch (kind) {
    case "charge":
      return "Charge";
    case "refund":
      return "Refund";
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
