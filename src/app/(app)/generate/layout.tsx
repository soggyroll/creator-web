/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Generation",
  description: "Configure and submit a new generation on Soggy Roll.",
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
