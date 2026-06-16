/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generations",
  description: "View and manage your generations on Soggy Roll.",
};

export default function GenerationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
