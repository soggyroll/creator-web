"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useWorkflows } from "@/hooks/use-workflows";
import type { Workflow } from "@/types/entities";
import { PageHeading } from "@/components/studio/page-heading";
import { WorkflowCard } from "@/components/studio/workflow-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverPage() {
  const { data: workflows, isLoading, isError, refetch } = useWorkflows();
  const groups: Record<string, Workflow[]> = {};
  for (const workflow of workflows ?? []) {
    const category = workflow.team?.name ?? "Workflows";
    (groups[category] ??= []).push(workflow);
  }

  return (
    <div className="studio-page">
      <PageHeading eyebrow="The workflow library" title={<>Find your<br /><span className="text-primary">starting point.</span></>} description="A workflow for your next idea. Pick one, make it your own, and let us handle the compute.">
        {!!workflows?.length && <a href="#all-workflows" className="studio-text-link">All workflows <ArrowDownRight aria-hidden="true" /></a>}
      </PageHeading>

      {isLoading ? <div className="studio-filmstrip" aria-label="Loading workflows"><div className="studio-featured-grid">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="aspect-3/4 w-full rounded-none" />)}</div></div>
        : isError ? <Alert variant="destructive"><AlertTitle>We couldn&apos;t load the workflows.</AlertTitle><AlertDescription><p>Please try again in a moment.</p><Button variant="outline" onClick={() => refetch()}>Try again</Button></AlertDescription></Alert>
        : !workflows?.length ? <section className="border-y py-16"><h2 className="font-display text-3xl uppercase">A little room for what&apos;s next.</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">There are no workflows available for this workspace yet. Check your team or come back soon.</p><Link href="/generations" className="studio-text-link mt-4">View your generations <ArrowUpRight aria-hidden="true" /></Link></section>
        : <>
          <section aria-label="Workflow starting points"><div className="studio-filmstrip"><div className="studio-featured-grid">{workflows.slice(0, 3).map(workflow => <WorkflowCard key={workflow.id} workflow={workflow} />)}</div></div><div className="studio-reel-caption"><span>Ready when you are.</span><span>{workflows.length} workflow{workflows.length === 1 ? "" : "s"} to explore</span></div></section>
          <div className="studio-library" id="all-workflows">{Object.entries(groups).map(([category, items]) => <section key={category}><div className="studio-section-heading"><h2>{category}</h2><span>{items.length} workflow{items.length === 1 ? "" : "s"}</span></div><div className="studio-workflow-grid">{items.map(workflow => <WorkflowCard key={workflow.id} workflow={workflow} />)}</div></section>)}</div>
        </>}
    </div>
  );
}
