/** @format */

"use client";

import Image from "next/image";
import { AlertCircleIcon, FileVideoIcon, ImageIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";

import type { DraftMediaInput, WorkflowMediaInput } from "./types";

interface MediaPreviewDrawerProps {
  input?: WorkflowMediaInput;
  media?: DraftMediaInput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear?: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPreviewDrawer({
  input,
  media,
  open,
  onOpenChange,
  onClear,
}: MediaPreviewDrawerProps) {
  const isImage = media?.contentType.startsWith("image/");
  const isVideo = media?.contentType.startsWith("video/");

  return (
    <Drawer direction="bottom" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto w-full max-w-6xl">
        <DrawerHeader className="px-6 pt-6 text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DrawerTitle>{input?.label ?? "Media preview"}</DrawerTitle>
              <DrawerDescription className="truncate">
                {media?.fileName ?? "No media selected"}
              </DrawerDescription>
            </div>
            {media && (
              <Badge
                variant={
                  media.status === "failed" ? "destructive" : "secondary"
                }
              >
                {media.status}
              </Badge>
            )}
          </div>
        </DrawerHeader>

        <div className="grid min-h-0 gap-5 px-6 pb-2 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="flex min-h-65 items-center justify-center overflow-hidden rounded-lg md:min-h-105">
            {media?.previewUrl && isImage ? (
              <Image
                src={media.previewUrl}
                alt={media.fileName}
                width={1400}
                height={1000}
                className="max-h-[56vh] w-auto object-contain"
                unoptimized
              />
            ) : media?.previewUrl && isVideo ? (
              <video
                src={media.previewUrl}
                controls
                className="max-h-[56vh] max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircleIcon className="size-9 text-muted-foreground/45" />
                <div>
                  <p className="text-sm font-medium">No preview available</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {media?.error ?? "Choose a media file from the input slot."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                File
              </p>
              <p className="mt-1 truncate text-sm font-medium">
                {media?.fileName ?? "Empty"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="mt-1 flex items-center gap-2 truncate">
                  {isVideo ? <FileVideoIcon /> : <ImageIcon />}
                  {media?.contentType ?? input?.kind ?? "media"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="mt-1 tabular-nums">
                  {media ? formatBytes(media.sizeBytes) : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Input</p>
                <p className="mt-1 truncate">{input?.id ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Asset</p>
                <p className="mt-1 truncate font-mono text-xs">
                  {media?.assetId ?? "Pending"}
                </p>
              </div>
            </div>

            {media?.status === "uploading" && (
              <div className="flex flex-col gap-2">
                <Progress value={media.progress} />
                <p className="text-xs text-muted-foreground">
                  Uploading media...
                </p>
              </div>
            )}

            {media?.status === "failed" && (
              <p className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircleIcon />
                <span>{media.error}</span>
              </p>
            )}
          </div>
        </div>

        <DrawerFooter className="flex-row justify-end px-6 pb-6">
          {media && onClear && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClear();
                onOpenChange(false);
              }}
              className="text-muted-foreground"
            >
              <XIcon />
              Clear
            </Button>
          )}
          <DrawerClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
