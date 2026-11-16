"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { useGenerations } from "@/hooks/use-generations";
import { formatGenerationStatus, statusColorClass, statusVariant } from "@/lib/generation-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeading } from "@/components/studio/page-heading";

export default function GenerationsPage() {
  const { data: generations, isLoading, isError, refetch } = useGenerations({ limit: 100 });

  return (
    <div className="studio-page">
      <PageHeading eyebrow="Your generation history" title={<>Made by<br /><span className="text-primary">you.</span></>} description="The ideas you've set in motion. Check a generation, follow its progress, or pick up your output.">
        <Button asChild><Link href="/discover">Make something new <ArrowUpRight data-icon="inline-end" /></Link></Button>
      </PageHeading>
      {isLoading ? <div className="flex flex-col gap-5" aria-label="Loading generations">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-24 w-full rounded-none" />)}</div>
        : isError ? <Alert variant="destructive"><AlertTitle>We couldn&apos;t load your generations.</AlertTitle><AlertDescription><p>Please try again in a moment.</p><Button variant="outline" onClick={() => refetch()}>Try again</Button></AlertDescription></Alert>
        : !generations?.data?.length ? <section className="border-y py-16"><ImageIcon className="mb-5 size-8 text-muted-foreground" aria-hidden="true" /><h2 className="font-display text-3xl uppercase">Your next idea belongs here.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your generation history will appear here after your first run.</p><Link href="/discover" className="studio-text-link mt-4">Find a workflow <ArrowUpRight aria-hidden="true" /></Link></section>
        : <div className="studio-history">{generations.data.map(gen => <article key={gen.id} className="studio-history-row">
          <div className="studio-history-thumbnail">{gen.output_url ? <Image src={gen.output_url} alt="" fill sizes="72px" className="object-cover" /> : <ImageIcon className="size-5 text-muted-foreground" aria-hidden="true" />}</div>
          <div className="min-w-0"><Link href={`/generations/${gen.id}`} className="block truncate font-medium hover:text-primary">{gen.workflow.name}</Link><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{new Date(gen.enqueued_at).toLocaleString()}</p><p className="mt-1 text-xs text-muted-foreground">{gen.workflow.cost} credits</p></div>
          <Badge variant={statusVariant(gen.status)} className={statusColorClass(gen.status)}>{formatGenerationStatus(gen.status)}</Badge>
          <Link href={`/generations/${gen.id}`} className="studio-text-link" aria-label={`View ${gen.workflow.name} generation`}>View <ArrowUpRight aria-hidden="true" /></Link>
        </article>)}</div>}
    </div>
  );
}
