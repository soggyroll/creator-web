/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover",
  description: "Browse and run ComfyUI workflows on Soggy Roll.",
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
