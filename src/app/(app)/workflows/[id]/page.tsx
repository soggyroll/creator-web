"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ImageIcon } from "lucide-react";
import { useWorkflow } from "@/hooks/use-workflow";
import { PageHeading } from "@/components/studio/page-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError, refetch } = useWorkflow(id);
  const workflow = data?.workflow;

  return (
    <div className="studio-page">
      <Link href="/discover" className="studio-text-link"><ArrowLeft aria-hidden="true" />Back to workflows</Link>
      {isLoading ? <div className="studio-detail-grid" aria-label="Loading workflow"><Skeleton className="aspect-4/5 w-full rounded-none" /><div className="flex flex-col gap-6"><Skeleton className="h-20 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div></div>
        : isError ? <Alert variant="destructive" className="mt-8"><AlertTitle>We couldn&apos;t open this workflow.</AlertTitle><AlertDescription><p>It may be unavailable, or you may need to switch teams.</p><Button variant="outline" onClick={() => refetch()}>Try again</Button></AlertDescription></Alert>
        : !workflow ? <div className="mt-8"><PageHeading title="Workflow not found." description="This workflow is no longer available." /></div>
        : <section className="studio-detail-grid">
          <div className="studio-detail-media">{workflow.cover_url ? <Image src={workflow.cover_url} alt={`Preview of ${workflow.name}`} fill sizes="(max-width: 1100px) 85vw, 45vw" className="object-cover" /> : <ImageIcon className="size-10 text-muted-foreground" aria-label="No cover image" />}</div>
          <div className="studio-detail-copy">
            <PageHeading eyebrow={workflow.team?.name ?? "The workflow library"} title={workflow.name} description={workflow.description ?? "A new starting point for your next idea."} />
            <div className="studio-detail-stats"><span>{(workflow.stats?.runs ?? 0).toLocaleString()} runs</span><span>{(workflow.stats?.likes ?? 0).toLocaleString()} likes</span><span>{(workflow.stats?.saves ?? 0).toLocaleString()} saves</span></div>
            <dl className="studio-detail-meta"><div><dt>Cost per generation</dt><dd>{workflow.cost.toLocaleString()} credits</dd></div>{workflow.avg_time > 0 && <div><dt>Average execution</dt><dd>{Math.max(1, Math.round(workflow.avg_time / 60))} min</dd></div>}<div><dt>Workflow inputs</dt><dd>{workflow.replaceable_nodes?.length ?? 0} configurable</dd></div></dl>
            <Link href={`/generate?workflow=${workflow.id}`} className="studio-action"><span>Make it<br />your own.</span><ArrowUpRight aria-hidden="true" /></Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Add your inputs and choose a priority on the next screen. We&apos;ll take it from there.</p>
          </div>
        </section>}
    </div>
  );
}
