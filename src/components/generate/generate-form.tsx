/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ChevronDownIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";

import { useCreateGeneration } from "@/hooks/use-create-generation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { BatchRail } from "./batch-rail";
import { MediaInputCard } from "./media-input-card";
import { MediaPreviewDrawer } from "./media-preview-drawer";
import {
  DEFAULT_FORM_VALUES,
  IMAGE_SIZE_PRESETS,
  WORKFLOW_MEDIA_INPUTS,
  type DraftMediaInput,
  type GenerateFormValues,
  type WorkflowMediaInput,
} from "./types";

interface GenerateFormProps {
  workflowId: string;
}

type BatchPriority = "urgent" | "standard" | "patient";

interface BatchDraft {
  id: string;
  values: GenerateFormValues;
  mediaInputs: Record<string, DraftMediaInput>;
}

function createDraft(id: string, values = DEFAULT_FORM_VALUES): BatchDraft {
  return {
    id,
    values: { ...values },
    mediaInputs: {},
  };
}

function createPlaceholderAssetId(inputId: string) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `placeholder-${inputId}-${id}`;
}

function getFirstMediaInput(draft: BatchDraft) {
  return Object.values(draft.mediaInputs)[0] ?? null;
}

function buildWorkflowInputs(mediaInputs: Record<string, DraftMediaInput>) {
  const image_asset_ids: Record<string, string> = {};
  const video_asset_ids: Record<string, string> = {};

  Object.values(mediaInputs).forEach((media) => {
    if (!media.assetId || media.status === "failed") return;

    if (media.contentType.startsWith("video/")) {
      video_asset_ids[media.inputId] = media.assetId;
      return;
    }

    image_asset_ids[media.inputId] = media.assetId;
  });

  return {
    primitive_inputs: {},
    ...(Object.keys(image_asset_ids).length ? { image_asset_ids } : {}),
    ...(Object.keys(video_asset_ids).length ? { video_asset_ids } : {}),
  };
}

export default function GenerateForm({ workflowId }: GenerateFormProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [showAdditional, setShowAdditional] = useState(false);
  const [priority, setPriority] = useState<BatchPriority>("standard");
  const nextDraftNumber = useRef(2);
  const [drafts, setDrafts] = useState<BatchDraft[]>([createDraft("draft-1")]);
  const [activeDraftId, setActiveDraftId] = useState("draft-1");
  const [selectedMediaInputId, setSelectedMediaInputId] = useState(
    WORKFLOW_MEDIA_INPUTS[0]?.id ?? "",
  );
  const [isMediaPreviewOpen, setIsMediaPreviewOpen] = useState(false);

  const {
    mutate: createGenerationBatch,
    isPending,
    error,
  } = useCreateGeneration();

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === activeDraftId) ?? drafts[0],
    [activeDraftId, drafts],
  );
  const activeIndex = drafts.findIndex((draft) => draft.id === activeDraft.id);
  const readyDrafts = drafts.filter(
    (draft) => draft.values.prompt.trim().length > 0,
  );
  const isBatchReady = readyDrafts.length === drafts.length;

  useEffect(() => {
    if (error) {
      toast.error(
        (error as Error).message ?? "Something went wrong. Please try again.",
      );
    }
  }, [error]);

  function makeDraftId() {
    const id = `draft-${nextDraftNumber.current}`;
    nextDraftNumber.current += 1;
    return id;
  }

  function updateActiveValues(patch: Partial<GenerateFormValues>) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === activeDraft.id
          ? { ...draft, values: { ...draft.values, ...patch } }
          : draft,
      ),
    );
  }

  function updateActiveMediaInput(
    input: WorkflowMediaInput,
    media: DraftMediaInput | null,
  ) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === activeDraft.id
          ? {
              ...draft,
              mediaInputs: media
                ? { ...draft.mediaInputs, [input.id]: media }
                : Object.fromEntries(
                    Object.entries(draft.mediaInputs).filter(
                      ([inputId]) => inputId !== input.id,
                    ),
                  ),
            }
          : draft,
      ),
    );
  }

  function handleMediaFileSelect(input: WorkflowMediaInput, file: File) {
    const previous = activeDraft.mediaInputs[input.id];
    if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);

    updateActiveMediaInput(input, {
      inputId: input.id,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      previewUrl: URL.createObjectURL(file),
      progress: 100,
      status: "ready",
      assetId: createPlaceholderAssetId(input.id),
    });
  }

  function handleInvalidMediaFile(
    input: WorkflowMediaInput,
    file: File,
    errorMessage: string,
  ) {
    const previous = activeDraft.mediaInputs[input.id];
    if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);

    updateActiveMediaInput(input, {
      inputId: input.id,
      fileName: file.name,
      contentType: file.type || "unknown",
      sizeBytes: file.size,
      previewUrl: "",
      progress: 0,
      status: "failed",
      error: errorMessage,
    });
  }

  function clearMediaInput(input: WorkflowMediaInput) {
    const previous = activeDraft.mediaInputs[input.id];
    if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
    updateActiveMediaInput(input, null);
  }

  function addDraft() {
    const id = makeDraftId();
    setDrafts((current) => [...current, createDraft(id)]);
    setActiveDraftId(id);
  }

  function duplicateDraft(id: string) {
    const source = drafts.find((draft) => draft.id === id);
    if (!source) return;

    const duplicateId = makeDraftId();
    const duplicate = {
      id: duplicateId,
      values: { ...source.values },
      mediaInputs: {},
    };

    setDrafts((current) => {
      const sourceIndex = current.findIndex((draft) => draft.id === id);
      const next = [...current];
      next.splice(sourceIndex + 1, 0, duplicate);
      return next;
    });
    setActiveDraftId(duplicateId);
  }

  function removeDraft(id: string) {
    if (drafts.length === 1) return;

    const draft = drafts.find((item) => item.id === id);
    Object.values(draft?.mediaInputs ?? {}).forEach((media) => {
      if (media.previewUrl) URL.revokeObjectURL(media.previewUrl);
    });

    setDrafts((current) => current.filter((item) => item.id !== id));
    if (activeDraftId === id) {
      const fallback = drafts.find((item) => item.id !== id);
      if (fallback) setActiveDraftId(fallback.id);
    }
  }

  function resetActiveDraft() {
    Object.values(activeDraft.mediaInputs).forEach((media) => {
      if (media.previewUrl) URL.revokeObjectURL(media.previewUrl);
    });
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === activeDraft.id
          ? createDraft(draft.id, DEFAULT_FORM_VALUES)
          : draft,
      ),
    );
  }

  function handleSubmit() {
    if (!isSignedIn) {
      const redirectUrl = workflowId
        ? `/generate?workflow=${workflowId}`
        : "/generate";
      router.push(`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (!isBatchReady) {
      toast.error("Every batch item needs a prompt before running.");
      return;
    }

    const generations = drafts.map((draft) => ({
      prompt: draft.values.prompt.trim(),
      workflow_id: workflowId,
      inputs: buildWorkflowInputs(draft.mediaInputs),
    }));

    createGenerationBatch(
      {
        generations,
        priority,
      },
      {
        onSuccess: () => {
          toast.success(
            generations.length === 1
              ? "Batch queued."
              : `${generations.length} generations queued as a ${priority} batch.`,
          );
          router.push("/generations");
        },
      },
    );
  }

  const values = activeDraft.values;
  const selectedMediaInput =
    WORKFLOW_MEDIA_INPUTS.find((input) => input.id === selectedMediaInputId) ??
    WORKFLOW_MEDIA_INPUTS[0];
  const selectedMedia = selectedMediaInput
    ? activeDraft.mediaInputs[selectedMediaInput.id]
    : undefined;
  const selectedPreset =
    IMAGE_SIZE_PRESETS.find(
      (preset) => preset.value === values.imageSizePreset,
    ) ?? IMAGE_SIZE_PRESETS[1];
  const canSubmit = !isSignedIn || (!isPending && isBatchReady);
  const runLabel = !isSignedIn
    ? "Sign in to run"
    : isPending
      ? "Running..."
      : `Run batch (${drafts.length})`;

  return (
    <div className="flex h-[calc(100vh-164px)] min-h-[640px] flex-col overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden lg:flex-row"
      >
        <div className="min-w-0 flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="mx-auto max-w-3xl pb-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Generation #{activeIndex + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={resetActiveDraft}
                className="text-muted-foreground"
              >
                Reset
              </Button>
            </div>

            <FieldGroup className="mb-5">
              <Field>
                <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="A serene mountain landscape at sunset with golden light"
                  rows={5}
                  value={values.prompt}
                  onChange={(e) =>
                    updateActiveValues({ prompt: e.target.value })
                  }
                  autoFocus
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="mb-5">
              <Field>
                <div>
                  <FieldLabel>Workflow inputs</FieldLabel>
                  <FieldDescription>
                    Add media directly to the workflow slot that uses it.
                  </FieldDescription>
                </div>
                <div className="flex flex-col gap-3">
                  {WORKFLOW_MEDIA_INPUTS.map((input) => (
                    <MediaInputCard
                      key={input.id}
                      input={input}
                      media={activeDraft.mediaInputs[input.id]}
                      selected={selectedMediaInputId === input.id}
                      onSelect={() => setSelectedMediaInputId(input.id)}
                      onPreview={() => setIsMediaPreviewOpen(true)}
                      onFileSelect={(file) => handleMediaFileSelect(input, file)}
                      onInvalidFile={(file, errorMessage) =>
                        handleInvalidMediaFile(input, file, errorMessage)
                      }
                      onClear={() => clearMediaInput(input)}
                    />
                  ))}
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdditional((v) => !v)}
              className="-ml-2 mb-5 w-fit font-medium"
            >
              Additional Settings
              <ChevronDownIcon
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  showAdditional ? "rotate-180" : ""
                }`}
              />
            </Button>

            {showAdditional && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="negativePrompt">
                    Negative Prompt
                  </FieldLabel>
                  <Textarea
                    id="negativePrompt"
                    name="negativePrompt"
                    rows={3}
                    value={values.negativePrompt}
                    onChange={(e) =>
                      updateActiveValues({ negativePrompt: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="imageSizePreset">Image Size</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Select
                      name="imageSizePreset"
                      value={values.imageSizePreset}
                      onValueChange={(value) =>
                        updateActiveValues({ imageSizePreset: value })
                      }
                    >
                      <SelectTrigger id="imageSizePreset" className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_SIZE_PRESETS.map((preset) => (
                          <SelectItem key={preset.value} value={preset.value}>
                            {preset.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono tabular-nums">
                        {selectedPreset.width}
                      </span>
                      <span>x</span>
                      <span className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono tabular-nums">
                        {selectedPreset.height}
                      </span>
                    </div>
                  </div>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="inferenceSteps">
                      Num Inference Steps
                    </FieldLabel>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {values.inferenceSteps}
                    </span>
                  </div>
                  <Slider
                    id="inferenceSteps"
                    min={1}
                    max={50}
                    step={1}
                    value={[values.inferenceSteps]}
                    onValueChange={([value]) =>
                      updateActiveValues({ inferenceSteps: value })
                    }
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="guidanceScale">
                      Guidance Scale
                    </FieldLabel>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {values.guidanceScale}
                    </span>
                  </div>
                  <Slider
                    id="guidanceScale"
                    min={0}
                    max={20}
                    step={0.1}
                    value={[values.guidanceScale]}
                    onValueChange={([value]) =>
                      updateActiveValues({ guidanceScale: value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="seed">Seed</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id="seed"
                      name="seed"
                      type="number"
                      placeholder="random"
                      value={values.seed}
                      onChange={(e) =>
                        updateActiveValues({ seed: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() =>
                        updateActiveValues({
                          seed: String(Math.floor(Math.random() * 2 ** 32)),
                        })
                      }
                      title="Randomize seed"
                    >
                      <RefreshCwIcon />
                    </Button>
                  </div>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="numImages">Num Images</FieldLabel>
                    <span className="w-10 rounded-md border border-border/60 px-2 py-1 text-center text-sm tabular-nums">
                      {values.numImages}
                    </span>
                  </div>
                  <Slider
                    id="numImages"
                    min={1}
                    max={8}
                    step={1}
                    value={[values.numImages]}
                    onValueChange={([value]) =>
                      updateActiveValues({ numImages: value })
                    }
                  />
                </Field>
              </FieldGroup>
            )}
          </div>
        </div>

        <BatchRail
          batchItems={drafts.map((draft) => ({
            id: draft.id,
            prompt: draft.values.prompt,
            previewUrl: getFirstMediaInput(draft)?.previewUrl ?? null,
            mediaStatus: getFirstMediaInput(draft)?.status ?? "idle",
          }))}
          activeItemId={activeDraft.id}
          priority={priority}
          canRunBatch={canSubmit}
          runLabel={runLabel}
          onSelectItem={setActiveDraftId}
          onAddItem={addDraft}
          onDuplicateItem={duplicateDraft}
          onRemoveItem={removeDraft}
          onPriorityChange={(value) => setPriority(value as BatchPriority)}
        />
      </form>

      <MediaPreviewDrawer
        input={selectedMediaInput}
        media={selectedMedia}
        open={isMediaPreviewOpen}
        onOpenChange={setIsMediaPreviewOpen}
        onClear={
          selectedMediaInput
            ? () => clearMediaInput(selectedMediaInput)
            : undefined
        }
      />
    </div>
  );
}
