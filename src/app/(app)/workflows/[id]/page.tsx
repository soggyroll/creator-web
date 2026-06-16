/** @format */

"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bookmark,
  BookmarkIcon,
  Heart,
  HeartIcon,
  Share2,
  ZapIcon,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useWorkflows } from "@/hooks/use-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

function fmtCount(n = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: workflows, isLoading } = useWorkflows();
  const ctaRef = useRef<HTMLDivElement>(null);

  const workflow = workflows?.find((w) => w.id === id);

  const { contextSafe } = useGSAP({ scope: ctaRef });

  const onBtnEnter = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, {
      y: -2,
      scale: 1.04,
      ease: "back.out(2)",
      duration: 0.25,
      overwrite: "auto",
    });
  });
  const onBtnLeave = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      ease: "back.out(1.5)",
      duration: 0.35,
      overwrite: "auto",
    });
  });
  const onBtnDown = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget, {
      scale: 0.96,
      duration: 0.1,
      ease: "power2.in",
      overwrite: "auto",
    });
  });
  const onBtnUp = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      ease: "back.out(2)",
      duration: 0.3,
      overwrite: "auto",
    });
  });

  if (!isLoading && workflows && !workflow) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
        Workflow not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[52vh] w-full overflow-hidden">
        {isLoading || !workflow ? (
          <Skeleton className="h-[52vh] w-full rounded-none" />
        ) : (
          <>
            <Image
              src={workflow.cover_url ?? ""}
              alt=""
              width={720}
              height={405}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-transparent" />

            {/* Back */}
            <div className="absolute left-8 top-6 md:left-14 md:top-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 rounded-md border border-foreground/20 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="size-3.5" />
                Back
              </button>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 px-8 pb-10 md:px-14 md:pb-14">
              <div className="flex flex-col gap-0 md:flex-row md:items-end md:justify-between md:gap-8">
                {/* Left: meta */}
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {workflow.team?.name ? (
                      <Badge variant="secondary" className="text-xs">
                        {workflow.team.name}
                      </Badge>
                    ) : null}
                  </div>
                  <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    {workflow.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                    {workflow.description}
                  </p>
                  {/* Stats row */}
                  <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <ZapIcon className="size-3.5" />
                      {fmtCount(workflow.stats?.runs)}
                      <span>runs</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HeartIcon className="size-3.5" />
                      {fmtCount(workflow.stats?.likes)}
                      <span>likes</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookmarkIcon className="size-3.5" />
                      {fmtCount(workflow.stats?.saves)}
                      <span>saves</span>
                    </span>
                  </div>
                  <div
                    ref={ctaRef}
                    className="mt-6 shrink-0 flex flex-wrap gap-3"
                  >
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={() =>
                        router.push(`/generate?workflow=${workflow.id}`)
                      }
                      onMouseEnter={onBtnEnter}
                      onMouseLeave={onBtnLeave}
                      onMouseDown={onBtnDown}
                      onMouseUp={onBtnUp}
                    >
                      Use this workflow
                      <ArrowRightIcon className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      onMouseEnter={onBtnEnter}
                      onMouseLeave={onBtnLeave}
                      onMouseDown={onBtnDown}
                      onMouseUp={onBtnUp}
                    >
                      Share
                      <Share2 className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="gap-2"
                      onMouseEnter={onBtnEnter}
                      onMouseLeave={onBtnLeave}
                      onMouseDown={onBtnDown}
                      onMouseUp={onBtnUp}
                    >
                      <Heart className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="gap-2"
                      onMouseEnter={onBtnEnter}
                      onMouseLeave={onBtnLeave}
                      onMouseDown={onBtnDown}
                      onMouseUp={onBtnUp}
                    >
                      <Bookmark className="size-4" />
                    </Button>
                  </div>
                </div>
                {/* Right: CTA — right of title on desktop, below stats on mobile */}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Sample outputs ── */}
      <section className="px-8 pt-8 md:px-14">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sample outputs
        </h2>
        {isLoading ? (
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-video w-64 shrink-0 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(workflow?.cover_url ? [workflow.cover_url] : []).map((src, i) => (
              <div
                key={i}
                className="aspect-video w-64 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={src}
                  alt={`Sample output ${i + 1}`}
                  className="h-full w-full object-cover"
                  width={256}
                  height={144}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
