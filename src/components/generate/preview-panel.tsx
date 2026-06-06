/** @format */

"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  CopyIcon,
  ImageIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  sampleImages: string[];
  previewUrl: string | null;
  onPreviewUrlChange: (url: string | null) => void;
  batchItems: BatchPreviewItem[];
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

export interface BatchPreviewItem {
  id: string;
  prompt: string;
  previewUrl: string | null;
}

export function PreviewPanel({
  sampleImages,
  previewUrl,
  onPreviewUrlChange,
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
}: PreviewPanelProps) {
  const previewInputRef = useRef<HTMLInputElement>(null);
  const hasCustomPreview = previewUrl !== null;

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onPreviewUrlChange(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    clearPreview();
    onPreviewUrlChange(URL.createObjectURL(file));
    e.target.value = "";
  }

  const displaySrc = previewUrl ?? sampleImages[0] ?? null;

  return (
    <div className="flex w-[55%] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Input Preview
        </p>
        {hasCustomPreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearPreview}
            className="text-muted-foreground"
          >
            <XIcon />
            Clear
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-8">
        {displaySrc ? (
          <>
            <div className="relative max-h-full overflow-hidden rounded-lg">
              <Image
                src={displaySrc}
                alt="Input preview"
                width={800}
                height={800}
                className="max-h-[calc(100svh-200px)] w-auto rounded-lg object-contain"
                unoptimized={hasCustomPreview}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => previewInputRef.current?.click()}
              className="text-muted-foreground"
            >
              <UploadIcon />
              {hasCustomPreview ? "Replace media" : "Upload input media"}
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => previewInputRef.current?.click()}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/50 px-14 py-16 text-center transition-colors hover:border-border hover:bg-muted/20"
          >
            <UploadIcon className="size-8 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upload input media
              </p>
              <p className="mt-1 text-xs text-muted-foreground/50">
                Image or video for reference
              </p>
            </div>
          </button>
        )}
      </div>

      <div className="border-t border-border">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Batch
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {batchItems.length} generation{batchItems.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={priority} onValueChange={onPriorityChange}>
              <SelectTrigger className="h-8 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
              <PlusIcon />
              New
            </Button>
            <Button type="submit" size="sm" disabled={!canRunBatch}>
              <SparklesIcon />
              {runLabel}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 pb-4 scrollbar-hide">
          {batchItems.map((item, index) => {
            const isActive = item.id === activeItemId;
            const prompt = item.prompt.trim() || "Untitled generation";
            return (
              <div
                key={item.id}
                className={cn(
                  "group flex w-56 shrink-0 items-center gap-3 rounded-lg border bg-background p-2 text-left transition-colors hover:bg-muted/50",
                  isActive
                    ? "border-foreground/35 bg-muted/50"
                    : "border-border/70",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectItem(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-muted/40">
                    {item.previewUrl ? (
                      <Image
                        src={item.previewUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground/45" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      #{index + 1}
                    </p>
                    <p className="truncate text-sm">{prompt}</p>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateItem(item.id);
                    }}
                    title="Duplicate generation"
                  >
                    <CopyIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
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

      <input
        ref={previewInputRef}
        type="file"
        accept="image/*,video/*"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Upload input media"
      />
    </div>
  );
}
