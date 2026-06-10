/** @format */

"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  AlertCircleIcon,
  EyeIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { DraftMediaInput, WorkflowMediaInput } from "./types";

const IMAGE_MAX_BYTES = 25 * 1024 * 1024;
const VIDEO_MAX_BYTES = 500 * 1024 * 1024;

interface MediaInputCardProps {
  input: WorkflowMediaInput;
  media?: DraftMediaInput;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onFileSelect: (file: File) => void;
  onInvalidFile: (file: File, error: string) => void;
  onClear: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileError(file: File, input: WorkflowMediaInput) {
  if (!input.accept.includes(file.type)) {
    return "This file type is not supported.";
  }

  if (file.type.startsWith("image/") && file.size > IMAGE_MAX_BYTES) {
    return "Images must be 25 MB or smaller.";
  }

  if (file.type.startsWith("video/") && file.size > VIDEO_MAX_BYTES) {
    return "Videos must be 500 MB or smaller.";
  }

  return null;
}

export function MediaInputCard({
  input,
  media,
  selected,
  onSelect,
  onPreview,
  onFileSelect,
  onInvalidFile,
  onClear,
}: MediaInputCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = media?.contentType.startsWith("image/");
  const isVideo = media?.contentType.startsWith("video/");
  const canPreview = Boolean(media?.previewUrl);

  function chooseFile(file: File | undefined) {
    if (!file) return;

    const error = getFileError(file, input);
    if (error) {
      onInvalidFile(file, error);
      return;
    }

    onFileSelect(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    chooseFile(e.target.files?.[0]);
    e.target.value = "";
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background transition-colors",
        selected ? "border-foreground/35 bg-muted/30" : "border-border/70",
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onSelect();
        chooseFile(e.dataTransfer.files[0]);
      }}
    >
      <div className="flex items-center gap-3 p-2.5">
        <button
          type="button"
          className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/70 bg-muted/40 transition-colors hover:bg-muted/70"
          onClick={() => {
            onSelect();
            if (canPreview) {
              onPreview();
              return;
            }
            inputRef.current?.click();
          }}
          title={canPreview ? "Preview media" : "Upload media"}
        >
          {media && isImage ? (
            <Image
              src={media.previewUrl}
              alt=""
              width={96}
              height={96}
              className="size-full object-cover"
              unoptimized
            />
          ) : media && isVideo ? (
            <video
              src={media.previewUrl}
              className="size-full object-cover"
              muted
              playsInline
            />
          ) : media?.status === "failed" ? (
            <AlertCircleIcon className="size-6 text-destructive" />
          ) : (
            <PlusIcon className="size-5 text-muted-foreground/55" />
          )}
        </button>

        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => {
            onSelect();
            if (!media) inputRef.current?.click();
          }}
        >
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{input.label}</p>
            <Badge
              variant={media?.status === "failed" ? "destructive" : "outline"}
              className="h-4 px-1.5 text-[10px]"
            >
              {media?.status ?? "empty"}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {media?.fileName ?? input.description}
          </p>

          {media ? (
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{media.contentType}</span>
              <span className="shrink-0 tabular-nums">
                {formatBytes(media.sizeBytes)}
              </span>
              {media.status === "failed" && (
                <span className="truncate text-destructive">{media.error}</span>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground/70">
              Drop or click to upload.
            </p>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          {canPreview && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                onSelect();
                onPreview();
              }}
              title="Preview media"
            >
              <EyeIcon />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              onSelect();
              inputRef.current?.click();
            }}
            title={media ? "Replace media" : "Upload media"}
          >
            <UploadIcon />
          </Button>
          {media && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onClear}
              className="text-muted-foreground"
              title="Clear media"
            >
              <XIcon />
            </Button>
          )}
        </div>
      </div>

      {media?.status === "uploading" && (
        <Progress
          value={media.progress}
          className="absolute inset-x-0 bottom-0 h-0.5 rounded-none"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={input.accept.join(",")}
        className="sr-only"
        onChange={handleFileChange}
        aria-label={input.label}
      />
    </div>
  );
}
