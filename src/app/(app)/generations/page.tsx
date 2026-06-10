/** @format */

"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { useGenerations } from "@/hooks/use-generations";
import {
  formatGenerationStatus,
  statusColorClass,
  statusVariant,
} from "@/lib/generation-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function GenerationsPage() {
  const { data: generations, isLoading } = useGenerations({ limit: 100 });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Generations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All your image generation requests
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col divide-y rounded-lg border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="size-12 shrink-0 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : !generations?.data?.length ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-20 text-center">
          <ImageIcon className="size-10 opacity-30" />
          <div>
            <p className="text-sm font-medium">No generations yet</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your generation history will appear here
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/generate">Create your first one</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y rounded-lg border">
          {generations.data.map((item) => {
            const gen = item.generation;
            const thumbnail = gen.attachments?.find(
              (a) => a.type === "image",
            )?.url;

            return (
              <div
                key={gen?.id}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                {/* Thumbnail */}
                <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-5 opacity-30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {gen?.prompt ?? "Untitled generation"}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {gen?.id?.slice(0, 8)}…
                    {gen?.enqueued_at && (
                      <span className="ml-2 not-mono font-sans">
                        · {new Date(gen.enqueued_at).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>

                {/* Credits */}
                {
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {"0"} cr
                  </span>
                }

                {/* Status */}
                <Badge
                  variant={statusVariant(gen?.status)}
                  className={statusColorClass(gen?.status)}
                >
                  {formatGenerationStatus(gen?.status)}
                </Badge>

                {/* Action */}
                <Button variant="ghost" size="sm" asChild className="shrink-0">
                  <Link href={`/generations/${gen?.id}`}>View</Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
