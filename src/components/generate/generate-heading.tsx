"use client";

import { useWorkflow } from "@/hooks/use-workflow";
import { PageHeading } from "@/components/studio/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

export default function GenerateHeading({ workflowId }: { workflowId: string }) {
  const { data, isLoading } = useWorkflow(workflowId);
  const workflow = data?.workflow;

  if (isLoading) return <div className="mb-10 flex flex-col gap-4" aria-label="Loading workflow"><Skeleton className="h-16 w-full max-w-md" /><Skeleton className="h-5 w-full max-w-lg" /></div>;

  return <PageHeading eyebrow={workflow?.team?.name ?? "Your creative workspace"} title={workflow?.name ?? "Make it your own."} description={workflow?.description ?? "Add your inputs, pick a priority, and bring your next idea to life."} />;
}
