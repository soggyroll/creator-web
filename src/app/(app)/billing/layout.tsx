/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your Soggy Roll credit balance and purchase history.",
};

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
