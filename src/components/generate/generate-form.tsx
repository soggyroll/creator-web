/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { useCreateGeneration } from "@/hooks/use-create-generation";
import { useWorkflow } from "@/hooks/use-workflow";
import { api } from "@/lib/api";
import { uploadFileToS3 } from "@/lib/upload";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { BatchRail } from "./batch-rail";
import { MediaInputCard } from "./media-input-card";
import { MediaPreviewDrawer } from "./media-preview-drawer";
import {
  fieldToMediaInput,
  normalizeNodes,
  type DraftMediaInput,
  type WorkflowField,
  type WorkflowMediaInput,
} from "./types";
import { WorkflowFieldInput } from "./workflow-field-input";

interface GenerateFormProps {
  workflowId: string;
}

type BatchPriority = "urgent" | "standard" | "patient";

interface BatchDraft {
  id: string;
  primitiveInputs: Record<string, string | number>;
  mediaInputs: Record<string, DraftMediaInput>;
}

function createDraft(id: string, fields: WorkflowField[]): BatchDraft {
  const primitiveInputs: Record<string, string | number> = {};
  fields.forEach((field) => {
    if (field.kind !== "media") {
      primitiveInputs[field.nodeId] = field.defaultValue;
    }
  });
  return { id, primitiveInputs, mediaInputs: {} };
}

function createUploadId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getFirstMediaInput(draft: BatchDraft) {
  return Object.values(draft.mediaInputs)[0] ?? null;
}

function getDraftLabel(
  draft: BatchDraft,
  fields: WorkflowField[],
): string {
  const firstTextField = fields.find((f) => f.kind === "text");
  if (!firstTextField) return "";
  const value = draft.primitiveInputs[firstTextField.nodeId];
  return typeof value === "string" ? value : "";
}

function buildWorkflowInputs(
  mediaInputs: Record<string, DraftMediaInput>,
  primitiveInputs: Record<string, string | number>,
): Record<string, unknown> {
  const inputs: Record<string, unknown> = { ...primitiveInputs };
  Object.values(mediaInputs).forEach((media) => {
    if (!media.assetId || media.status !== "uploaded") return;
    inputs[media.inputId] = { asset_id: media.assetId };
  });
  return inputs;
}

export default function GenerateForm({ workflowId }: GenerateFormProps) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [priority, setPriority] = useState<BatchPriority>("standard");
  const nextDraftNumber = useRef(2);
  const [drafts, setDrafts] = useState<BatchDraft[]>([
    { id: "draft-1", primitiveInputs: {}, mediaInputs: {} },
  ]);
  const [activeDraftId, setActiveDraftId] = useState("draft-1");
  const [selectedMediaInputId, setSelectedMediaInputId] = useState("");
  const [isMediaPreviewOpen, setIsMediaPreviewOpen] = useState(false);

  const { data } = useWorkflow(workflowId);
  const workflow = data?.workflow;

  const fields = useMemo(
    () => normalizeNodes(workflow?.replaceable_nodes ?? []),
    [workflow?.replaceable_nodes],
  );

  const mediaFields = useMemo(
    () =>
      fields.filter(
        (f): f is Extract<WorkflowField, { kind: "media" }> =>
          f.kind === "media",
      ),
    [fields],
  );

  const primitiveFields = useMemo(
    () =>
      fields.filter(
        (
          f,
        ): f is Extract<WorkflowField, { kind: "text" | "int" | "float" }> =>
          f.kind !== "media",
      ),
    [fields],
  );

  // Populate primitive defaults once fields arrive
  useEffect(() => {
    if (!fields.length) return;
    setDrafts((current) =>
      current.map((draft) => {
        if (Object.keys(draft.primitiveInputs).length > 0) return draft;
        const primitiveInputs: Record<string, string | number> = {};
        fields.forEach((field) => {
          if (field.kind !== "media") {
            primitiveInputs[field.nodeId] = field.defaultValue;
          }
        });
        return { ...draft, primitiveInputs };
      }),
    );
  }, [fields]);

  // Select first media field once available
  useEffect(() => {
    if (mediaFields.length > 0 && !selectedMediaInputId) {
      setSelectedMediaInputId(mediaFields[0].nodeId);
    }
  }, [mediaFields, selectedMediaInputId]);

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

  const allMedia = drafts.flatMap((draft) => Object.values(draft.mediaInputs));
  const hasUploadingMedia = allMedia.some(
    (media) => media.status === "uploading",
  );
  const hasFailedMedia = allMedia.some((media) => media.status === "failed");

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

  function updatePrimitiveInput(nodeId: string, value: string | number) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === activeDraft.id
          ? {
              ...draft,
              primitiveInputs: { ...draft.primitiveInputs, [nodeId]: value },
            }
          : draft,
      ),
    );
  }

  function updateDraftMediaInput(
    draftId: string,
    inputId: string,
    media: DraftMediaInput | null,
  ) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              mediaInputs: media
                ? { ...draft.mediaInputs, [inputId]: media }
                : Object.fromEntries(
                    Object.entries(draft.mediaInputs).filter(
                      ([currentInputId]) => currentInputId !== inputId,
                    ),
                  ),
            }
          : draft,
      ),
    );
  }

  function patchDraftMediaInput(
    draftId: string,
    inputId: string,
    uploadId: string,
    patch: Partial<DraftMediaInput>,
  ) {
    setDrafts((current) =>
      current.map((draft) => {
        if (draft.id !== draftId) return draft;
        const currentMedia = draft.mediaInputs[inputId];
        if (!currentMedia || currentMedia.uploadId !== uploadId) return draft;
        return {
          ...draft,
          mediaInputs: {
            ...draft.mediaInputs,
            [inputId]: { ...currentMedia, ...patch },
          },
        };
      }),
    );
  }

  async function handleMediaFileSelect(input: WorkflowMediaInput, file: File) {
    const draftId = activeDraft.id;
    const previous = activeDraft.mediaInputs[input.id];
    if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);

    const uploadId = createUploadId();

    updateDraftMediaInput(draftId, input.id, {
      uploadId,
      inputId: input.id,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "uploading",
    });

    try {
      const upload = await api.assets.initUpload({
        asset_type: "input",
        filename: file.name,
        content_type: file.type,
        size_bytes: file.size,
      });

      await uploadFileToS3(upload.upload_url, file, (progress) => {
        patchDraftMediaInput(draftId, input.id, uploadId, { progress });
      });

      const completed = await api.assets.completeUpload({
        asset_id: upload.asset_id,
      });

      patchDraftMediaInput(draftId, input.id, uploadId, {
        assetId: completed.asset.id,
        progress: 100,
        status: "uploaded",
      });

      toast.success(`${file.name} uploaded.`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Try again.";
      patchDraftMediaInput(draftId, input.id, uploadId, {
        progress: 0,
        status: "failed",
        error: message,
      });
      toast.error(message);
    }
  }

  function handleInvalidMediaFile(
    input: WorkflowMediaInput,
    file: File,
    errorMessage: string,
  ) {
    const previous = activeDraft.mediaInputs[input.id];
    if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
    updateDraftMediaInput(activeDraft.id, input.id, {
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
    updateDraftMediaInput(activeDraft.id, input.id, null);
  }

  function addDraft() {
    const id = makeDraftId();
    setDrafts((current) => [...current, createDraft(id, fields)]);
    setActiveDraftId(id);
  }

  function duplicateDraft(id: string) {
    const source = drafts.find((draft) => draft.id === id);
    if (!source) return;

    const duplicateId = makeDraftId();
    const duplicate: BatchDraft = {
      id: duplicateId,
      primitiveInputs: { ...source.primitiveInputs },
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
          ? createDraft(draft.id, fields)
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

    if (hasUploadingMedia) {
      toast.error("Wait for media uploads to finish before running.");
      return;
    }

    if (hasFailedMedia) {
      toast.error("Clear or replace failed media before running.");
      return;
    }

    const generations = drafts.map((draft) => ({
      workflow_id: workflowId,
      inputs: buildWorkflowInputs(draft.mediaInputs, draft.primitiveInputs),
    }));

    createGenerationBatch(
      { generations, priority },
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

  const selectedMediaField =
    mediaFields.find((f) => f.nodeId === selectedMediaInputId) ??
    mediaFields[0];
  const selectedMediaInput = selectedMediaField
    ? fieldToMediaInput(selectedMediaField)
    : undefined;
  const selectedMedia = selectedMediaInput
    ? activeDraft.mediaInputs[selectedMediaInput.id]
    : undefined;

  const canSubmit =
    !isSignedIn || (!isPending && !hasUploadingMedia && !hasFailedMedia);

  const runLabel = !isSignedIn
    ? "Sign in to run"
    : isPending
      ? "Running..."
      : hasUploadingMedia
        ? "Uploading media..."
        : hasFailedMedia
          ? "Fix failed media"
          : `Run batch (${drafts.length})`;

  return (
    <div className="flex h-[calc(100vh-164px)] min-h-160 flex-col overflow-hidden">
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

            {primitiveFields.length > 0 && (
              <FieldGroup className="mb-5">
                {primitiveFields.map((field) => (
                  <Field key={field.nodeId}>
                    <FieldLabel>{field.title}</FieldLabel>
                    <WorkflowFieldInput
                      field={field}
                      value={
                        activeDraft.primitiveInputs[field.nodeId] ??
                        field.defaultValue
                      }
                      onChange={(value) =>
                        updatePrimitiveInput(field.nodeId, value)
                      }
                    />
                  </Field>
                ))}
              </FieldGroup>
            )}

            {mediaFields.length > 0 && (
              <FieldGroup className="mb-5">
                <Field>
                  <div>
                    <FieldLabel>Workflow inputs</FieldLabel>
                    <FieldDescription>
                      Add media directly to the workflow slot that uses it.
                    </FieldDescription>
                  </div>
                  <div className="flex flex-col gap-3">
                    {mediaFields.map((mediaField) => {
                      const input = fieldToMediaInput(mediaField);
                      return (
                        <MediaInputCard
                          key={mediaField.nodeId}
                          input={input}
                          media={activeDraft.mediaInputs[input.id]}
                          selected={selectedMediaInputId === mediaField.nodeId}
                          onSelect={() =>
                            setSelectedMediaInputId(mediaField.nodeId)
                          }
                          onPreview={() => setIsMediaPreviewOpen(true)}
                          onFileSelect={(file) =>
                            handleMediaFileSelect(input, file)
                          }
                          onInvalidFile={(file, errorMessage) =>
                            handleInvalidMediaFile(input, file, errorMessage)
                          }
                          onClear={() => clearMediaInput(input)}
                        />
                      );
                    })}
                  </div>
                </Field>
              </FieldGroup>
            )}
          </div>
        </div>

        <BatchRail
          batchItems={drafts.map((draft) => ({
            id: draft.id,
            prompt: getDraftLabel(draft, fields),
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
