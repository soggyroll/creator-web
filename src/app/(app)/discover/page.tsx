/** @format */

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, BookmarkIcon, HeartIcon, ZapIcon } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useWorkflows } from "@/hooks/use-workflows";
import { Workflow } from "@/types/entities";

gsap.registerPlugin(useGSAP);

function fmtCount(n = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return String(n);
}

function groupByCategory(workflows: Workflow[]) {
  const groups: Record<string, Workflow[]> = {};
  for (const w of workflows) {
    const category = w.team?.name ?? "Workflows";
    if (!groups[category]) groups[category] = [];
    groups[category].push(w);
  }
  return groups;
}

export default function DiscoverPage() {
  const router = useRouter();
  const { data: workflows, isLoading } = useWorkflows();
  const heroRef = useRef<HTMLDivElement>(null);

  const featured = workflows?.[0];
  const rest = workflows?.slice(1) ?? [];
  const groups = groupByCategory(rest);
  const categories = Object.keys(groups);

  const { contextSafe } = useGSAP({ scope: heroRef });

  useGSAP(
    () => {
      if (!featured) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".hero-item", {
        y: 16,
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: "power3.out",
      });
    },
    { scope: heroRef, dependencies: [!!featured], revertOnUpdate: true },
  );

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

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[58vh] w-full overflow-hidden">
        {isLoading || !featured ? (
          <Skeleton className="h-[58vh] w-full rounded-none" />
        ) : (
          <>
            <Image
              src={featured.cover_url ?? ""}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              width={1080}
              height={720}
            />
            {/* Layered gradient: darken edges + heavy bottom fade */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-transparent" />

            <div
              ref={heroRef}
              className="absolute inset-x-0 bottom-0 px-8 pb-12 md:px-14 md:pb-16"
            >
              {featured.team?.name ? (
                <Badge variant="secondary" className="hero-item mb-3 text-xs">
                  {featured.team.name}
                </Badge>
              ) : null}
              <h1 className="hero-item max-w-lg text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {featured.name}
              </h1>
              <p className="hero-item mt-2 max-w-md text-sm text-muted-foreground line-clamp-2">
                {featured.description}
              </p>
              {/* Stats row */}
              <div className="hero-item mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ZapIcon className="size-3" />
                  {fmtCount(featured.stats?.runs)} runs
                </span>
                <span className="flex items-center gap-1">
                  <HeartIcon className="size-3" />
                  {fmtCount(featured.stats?.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <BookmarkIcon className="size-3" />
                  {fmtCount(featured.stats?.saves)}
                </span>
              </div>
              <div className="hero-item mt-6 flex flex-wrap gap-3">
                <Button
                  size="default"
                  onClick={() =>
                    router.push(`/generate?workflow=${featured.id}`)
                  }
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onMouseDown={onBtnDown}
                  onMouseUp={onBtnUp}
                  className="gap-2"
                >
                  Use this workflow
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => router.push(`/workflows/${featured.id}`)}
                  onMouseEnter={onBtnEnter}
                  onMouseLeave={onBtnLeave}
                  onMouseDown={onBtnDown}
                  onMouseUp={onBtnUp}
                >
                  View details
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Category rows ── */}
      <div className="flex flex-col gap-10 px-8 py-10 md:px-14">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-4 w-28" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton
                      key={j}
                      className="aspect-2/3 w-full rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))
          : categories.map((category) => (
              <div key={category}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">{category}</h2>
                  <span className="text-xs text-muted-foreground">
                    {groups[category].length} workflow
                    {groups[category].length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {groups[category].map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const router = useRouter();
  const cardRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const reduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const onMouseEnter = () => {
        if (reduced()) return;
        gsap.to(card, {
          scale: 1.04,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onMouseMove = (e: MouseEvent) => {
        if (reduced()) return;
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        gsap.to(card, {
          rotationY: dx * 6,
          rotationX: -dy * 4,
          transformPerspective: 800,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: cardRef },
  );

  return (
    <button
      ref={cardRef}
      onClick={() => router.push(`/workflows/${workflow.id}`)}
      className="group relative aspect-2/3 w-full cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`View ${workflow.name} workflow`}
    >
      {/* Poster image */}
      <Image
        src={workflow.cover_url ?? ""}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        width={360}
        height={540}
      />

      {/* Gradient — solid black base covering the info panel, fades up */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

      {/* Hover tint */}
      <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Runs count — top right, social proof */}
      <div className="absolute right-2.5 top-2.5">
        <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
          <ZapIcon className="size-3" />
          {fmtCount(workflow.stats?.runs)}
        </span>
      </div>

      {/* "Use this →" CTA — fades in at center on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
          Use this
          <ArrowRightIcon className="size-3.5" />
        </span>
      </div>

      {/* Bottom info — always visible */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-base font-semibold text-start leading-tight text-white line-clamp-1">
          {workflow.name}
        </p>
        <p className="mt-1 text-sm text-start leading-snug text-white/65 line-clamp-1">
          {workflow.description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-sm text-white/55">
          <span className="flex items-center gap-1">
            <HeartIcon className="size-3" />
            {fmtCount(workflow.stats?.likes)}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkIcon className="size-3" />
            {fmtCount(workflow.stats?.saves)}
          </span>
        </div>
      </div>
    </button>
  );
}
