/** @format */

"use client";

import Image from "next/image";
import {
  CopyIcon,
  ImageIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { MediaInputStatus } from "./types";

interface BatchRailProps {
  batchItems: BatchRailItem[];
  activeItemId: string;
  priority: string;
  canRunBatch: boolean;
  runLabel: string;
  onSelectItem: (id: string) => void;
  onAddItem: () => void;
  onDuplicateItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onPriorityChange: (priority: string) => void;
}

export interface BatchRailItem {
  id: string;
  prompt: string;
  previewUrl: string | null;
  mediaStatus: MediaInputStatus;
}

function getStatusLabel(status: MediaInputStatus) {
  if (status === "idle") return "No media";
  return status;
}

export function BatchRail({
  batchItems,
  activeItemId,
  priority,
  canRunBatch,
  runLabel,
  onSelectItem,
  onAddItem,
  onDuplicateItem,
  onRemoveItem,
  onPriorityChange,
}: BatchRailProps) {
  return (
    <aside className="flex max-h-64 w-full shrink-0 flex-col border-t border-border pt-4 lg:max-h-none lg:w-72 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
      <div className="flex items-start justify-between gap-3 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Batch
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {batchItems.length} generation{batchItems.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onAddItem}
        >
          <PlusIcon />
        </Button>
      </div>

      <div className="pb-4">
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <div className="flex flex-col gap-2">
          {batchItems.map((item, index) => {
            const isActive = item.id === activeItemId;
            const prompt = item.prompt.trim() || "Untitled generation";

            return (
              <div
                key={item.id}
                className={cn(
                  "group rounded-lg border bg-background p-2 transition-colors",
                  isActive
                    ? "border-foreground/35 bg-muted/40"
                    : "border-border/70 hover:bg-muted/30",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => onSelectItem(item.id)}
                >
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-muted/40">
                    {item.previewUrl ? (
                      <Image
                        src={item.previewUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground/45" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        #{index + 1}
                      </p>
                      <Badge
                        variant={
                          item.mediaStatus === "failed"
                            ? "destructive"
                            : "outline"
                        }
                        className="h-4 px-1.5 text-[10px]"
                      >
                        {getStatusLabel(item.mediaStatus)}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm">{prompt}</p>
                  </div>
                </button>

                <div className="mt-2 flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDuplicateItem(item.id)}
                    title="Duplicate generation"
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove generation"
                    disabled={batchItems.length === 1}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <Button type="submit" className="w-full" disabled={!canRunBatch}>
          <SparklesIcon />
          {runLabel}
        </Button>
      </div>
    </aside>
  );
}
