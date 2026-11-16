/** @format */

import GenerateForm from "@/components/generate/generate-form";
import GenerateHeading from "@/components/generate/generate-heading";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ workflow?: string }>;
};

export default async function GeneratePage({ searchParams }: Props) {
  const { workflow } = await searchParams;

  if (!workflow) {
    return notFound();
  }

  return (
    <div className="studio-page">
      <GenerateHeading workflowId={workflow} />
      <GenerateForm workflowId={workflow} />
    </div>
  );
}
