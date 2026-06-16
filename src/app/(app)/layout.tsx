/** @format */

import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { TeamCookieSync } from "@/components/team-cookie-sync";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TeamCookieSync />
      <AppNav />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
