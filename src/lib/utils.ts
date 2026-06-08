/** @format */

import { clsx, type ClassValue } from "clsx";
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
