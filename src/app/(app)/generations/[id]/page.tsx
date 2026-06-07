/** @format */

"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  Loader2Icon,
  TimerIcon,
  XCircleIcon,
} from "lucide-react";

import { useGeneration } from "@/hooks/use-generation";
import {
  formatGenerationStatus,
  statusColorClass,
  statusVariant,
} from "@/lib/generation-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STEPS = [
  { key: "queued", label: "Queued", icon: ClockIcon },
  { key: "running", label: "Processing", icon: Loader2Icon },
  { key: "completed", label: "Done", icon: CheckCircle2Icon },
] as const;

function getStepIndex(status: string | undefined) {
  if (status === "failed" || status === "retrying") return 1;
  if (status === "completed") return 2;
  if (status === "running") return 1;
  return 0;
}

export default function GenerationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: result, isLoading } = useGeneration(id);

  const gen = result?.generation;
  const activeStep = getStepIndex(gen?.status);
  const isFailed = gen?.status === "failed";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Back */}
      <Link
        href="/generations"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Generations
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">
            {gen?.prompt ?? "Untitled generation"}
          </h1>
          {gen?.id && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {gen.id}
            </p>
          )}
        </div>
        {gen?.status && (
          <Badge
            variant={statusVariant(gen.status)}
            className={statusColorClass(gen.status)}
          >
            {formatGenerationStatus(gen.status)}
          </Badge>
        )}
      </div>

      {/* Progress stepper */}
      <ol className="mt-8 flex items-center">
        {STEPS.map((step, i) => {
          const isDone = activeStep > i;
          const isCurrent = activeStep === i;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    "flex size-7 items-center justify-center rounded-full border-2 transition-colors",
                    isFailed && i === 1
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : isDone || isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground",
                  ].join(" ")}
                >
                  {isFailed && i === 1 ? (
                    <XCircleIcon className="size-3.5" />
                  ) : (
                    <step.icon
                      className={[
                        "size-3.5",
                        isCurrent && gen?.status === "running"
                          ? "animate-spin"
                          : "",
                      ].join(" ")}
                    />
                  )}
                </div>
                <span
                  className={[
                    "text-xs font-medium",
                    isFailed && i === 1
                      ? "text-destructive"
                      : isDone || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={[
                    "mx-3 mb-5 h-px flex-1 transition-colors",
                    isDone ? "bg-primary" : "bg-border",
                  ].join(" ")}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Main content */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Details */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Details
          </p>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <dl className="divide-y text-sm">
              <DetailRow
                label="Submitted"
                value={
                  gen?.enqueued_at
                    ? new Date(gen.enqueued_at).toLocaleString()
                    : "—"
                }
              />
              <DetailRow
                label="Started"
                value={
                  gen?.started_at
                    ? new Date(gen.started_at).toLocaleString()
                    : "—"
                }
              />
              <DetailRow
                label="Finished"
                value={
                  gen?.finished_at
                    ? new Date(gen.finished_at).toLocaleString()
                    : "—"
                }
              />
              <DetailRow label="Credit cost" value={"0"} />
              {gen?.prompt && (
                <div className="py-3">
                  <dt className="mb-1 text-xs text-muted-foreground">Prompt</dt>
                  <dd className="text-xs leading-relaxed">{gen.prompt}</dd>
                </div>
              )}
            </dl>
          )}

          {gen?.error_log && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <p className="mb-1 text-xs font-medium text-destructive">Error</p>
              <p className="font-mono text-xs text-destructive">
                {gen.error_log}
              </p>
            </div>
          )}
        </div>

        {/* Output */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Output
            </p>
            {result?.output_url && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="-mr-2 h-7 gap-1.5 text-xs"
              >
                <a
                  href={result.output_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DownloadIcon className="size-3.5" />
                  Download
                </a>
              </Button>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="aspect-square w-full rounded-xl" />
          ) : result?.output_url ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={result.output_url}
                alt="Generation output"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
              <Loader2Icon
                className={[
                  "size-6 opacity-40",
                  gen?.status === "running" ? "animate-spin" : "",
                ].join(" ")}
              />
              <p className="text-xs">
                {gen?.status === "completed"
                  ? "Output unavailable"
                  : "Waiting for output…"}
              </p>
            </div>
          )}

          {result?.output_expiry && (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <TimerIcon className="size-3" />
              Expires {new Date(result.output_expiry).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xs font-medium tabular-nums">{value}</dd>
    </div>
  );
}
