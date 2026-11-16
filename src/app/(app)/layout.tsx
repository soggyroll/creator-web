/** @format */

import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { TeamCookieSync } from "@/components/team-cookie-sync";
import { BrandRail } from "@/components/studio/brand-rail";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-frame">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <TeamCookieSync />
      <BrandRail href="/discover" note="More room for making" />
      <div className="studio-body">
        <AppNav />
        <main id="main-content" className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
