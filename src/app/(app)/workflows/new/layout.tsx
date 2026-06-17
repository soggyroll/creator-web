/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workflow",
  description: "Publish a new ComfyUI workflow on Soggy Roll.",
};

export default function CreateWorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
