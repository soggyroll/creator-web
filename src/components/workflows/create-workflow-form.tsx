/** @format */

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useCreateWorkflow } from "@/hooks/use-create-workflow";
import { api } from "@/lib/api";
import { uploadFileToS3 } from "@/lib/upload";

type FormErrors = Partial<Record<string, string>>;

type CoverUploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; previewUrl: string }
  | { status: "done"; previewUrl: string; publicUrl: string }
  | { status: "error"; message: string; previewUrl?: string };

const ACCEPTED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function validateJson(value: string, arrayOnly = false): string | null {
  try {
    const parsed = JSON.parse(value);
    if (arrayOnly && !Array.isArray(parsed)) return "Must be a JSON array";
    return null;
  } catch {
    return arrayOnly ? "Invalid JSON array" : "Invalid JSON";
  }
}

// ---- Cover uploader --------------------------------------------------------

interface CoverUploaderProps {
  state: CoverUploadState;
  onChange: (next: CoverUploadState) => void;
  error?: string;
}

function CoverUploader({ state, onChange, error }: CoverUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    if (!ACCEPTED_COVER_TYPES.includes(file.type)) {
      onChange({
        status: "error",
        message: "Only JPEG, PNG, WebP, and GIF files are accepted.",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onChange({ status: "uploading", progress: 0, previewUrl });

    try {
      const { asset_id, upload_url, public_url } = await api.assets.initUpload({
        asset_type: "cover",
        filename: file.name,
        content_type: file.type,
        size_bytes: file.size,
      });

      if (!public_url) throw new Error("No public URL returned from server.");

      await uploadFileToS3(upload_url, file, (progress) =>
        onChange({ status: "uploading", progress, previewUrl }),
      );

      await api.assets.completeUpload({ asset_id });

      onChange({ status: "done", previewUrl, publicUrl: public_url });
    } catch (err) {
      onChange({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
        previewUrl,
      });
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const previewUrl =
    state.status === "uploading" ||
    state.status === "done" ||
    (state.status === "error" && state.previewUrl)
      ? (state as { previewUrl?: string }).previewUrl
      : undefined;

  const isUploading = state.status === "uploading";

  return (
    <div className="flex flex-col gap-2">
      <div
        className={[
          "relative flex h-52 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50",
          error || state.status === "error" ? "border-destructive" : "",
          isUploading ? "cursor-default" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        aria-label="Upload cover image"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <ImageIcon className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop or{" "}
              <span className="text-foreground underline underline-offset-2">
                click to upload
              </span>
            </p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF</p>
          </div>
        )}

        {/* Upload progress overlay */}
        {state.status === "uploading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 px-8">
            <UploadIcon className="size-6 text-white" />
            <Progress value={state.progress} className="h-1.5 w-full" />
            <p className="text-xs text-white">{state.progress}%</p>
          </div>
        )}

        {/* Change / retry overlay (visible on hover when done or error) */}
        {(state.status === "done" || state.status === "error") && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {state.status === "error" ? "Retry" : "Change"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ status: "idle" });
              }}
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      {error && state.status !== "error" && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_COVER_TYPES.join(",")}
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}

// ---- Form ------------------------------------------------------------------

export function CreateWorkflowForm() {
  const router = useRouter();
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverUpload, setCoverUpload] = useState<CoverUploadState>({ status: "idle" });
  const [isPublic, setIsPublic] = useState("false");
  const [avgTime, setAvgTime] = useState("");
  const [cost, setCost] = useState("");
  const [defaultTimeout, setDefaultTimeout] = useState("");
  const [requiredVram, setRequiredVram] = useState("");
  const [comfyWorkflowJson, setComfyWorkflowJson] = useState("");
  const [modelFilesJson, setModelFilesJson] = useState("[]");
  const [replaceableNodesJson, setReplaceableNodesJson] = useState("[]");

  const [errors, setErrors] = useState<FormErrors>({});

  const isUploadInProgress = coverUpload.status === "uploading";

  function validate(): boolean {
    const errs: FormErrors = {};

    if (!name.trim()) errs.name = "Name is required";
    if (!description.trim()) errs.description = "Description is required";
    if (coverUpload.status !== "done") errs.cover_url = "Cover image is required";

    const avgTimeNum = Number(avgTime);
    if (avgTime === "" || isNaN(avgTimeNum) || avgTimeNum < 0)
      errs.avg_time = "Must be 0 or greater";

    const costNum = Number(cost);
    if (cost === "" || isNaN(costNum) || costNum < 0)
      errs.cost = "Must be 0 or greater";

    const timeoutNum = Number(defaultTimeout);
    if (defaultTimeout === "" || isNaN(timeoutNum) || timeoutNum < 0)
      errs.default_timeout_seconds = "Must be 0 or greater";

    const vramNum = Number(requiredVram);
    if (requiredVram === "" || isNaN(vramNum) || vramNum < 0)
      errs.required_vram_gb = "Must be 0 or greater";

    if (!comfyWorkflowJson.trim()) {
      errs.comfy_workflow = "ComfyUI workflow JSON is required";
    } else {
      const jsonErr = validateJson(comfyWorkflowJson);
      if (jsonErr) errs.comfy_workflow = jsonErr;
    }

    const modelErr = validateJson(modelFilesJson, true);
    if (modelErr) errs.model_files = modelErr;

    const nodeErr = validateJson(replaceableNodesJson, true);
    if (nodeErr) errs.replaceable_nodes = nodeErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (coverUpload.status !== "done") return;

    createWorkflow(
      {
        name,
        description,
        cover_url: coverUpload.publicUrl,
        is_public: isPublic === "true",
        avg_time: Number(avgTime),
        cost: Number(cost),
        default_timeout_seconds: Number(defaultTimeout),
        required_vram_gb: Number(requiredVram),
        comfy_workflow: JSON.parse(comfyWorkflowJson),
        model_files: JSON.parse(modelFilesJson),
        replaceable_nodes: JSON.parse(replaceableNodesJson),
      },
      {
        onSuccess: (data) => {
          toast.success("Workflow created");
          const id = data.workflow?.id;
          router.push(id ? `/workflows/${id}` : "/discover");
        },
        onError: () => {
          toast.error("Failed to create workflow");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Basic Info */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Basic info</h2>
          <p className="text-sm text-muted-foreground">
            General details shown on the workflow card.
          </p>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="My ComfyUI Workflow"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Describe what this workflow does…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <FieldError>{errors.description}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Cover image</FieldLabel>
            <FieldDescription>
              Shown on the workflow card. JPEG, PNG, WebP, or GIF.
            </FieldDescription>
            <CoverUploader
              state={coverUpload}
              onChange={setCoverUpload}
              error={errors.cover_url}
            />
          </Field>
        </FieldGroup>
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Visibility, performance, and credit configuration.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="is_public">Visibility</FieldLabel>
            <Select value={isPublic} onValueChange={setIsPublic}>
              <SelectTrigger id="is_public">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Public</SelectItem>
                <SelectItem value="false">Private</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="required_vram_gb">Required VRAM (GB)</FieldLabel>
            <Input
              id="required_vram_gb"
              type="number"
              min={0}
              placeholder="8"
              value={requiredVram}
              onChange={(e) => setRequiredVram(e.target.value)}
            />
            {errors.required_vram_gb && (
              <FieldError>{errors.required_vram_gb}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="avg_time">Avg. generation time (s)</FieldLabel>
            <Input
              id="avg_time"
              type="number"
              min={0}
              placeholder="30"
              value={avgTime}
              onChange={(e) => setAvgTime(e.target.value)}
            />
            {errors.avg_time && <FieldError>{errors.avg_time}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="cost">Cost (credits)</FieldLabel>
            <Input
              id="cost"
              type="number"
              min={0}
              placeholder="10"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            {errors.cost && <FieldError>{errors.cost}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="default_timeout_seconds">Default timeout (s)</FieldLabel>
            <Input
              id="default_timeout_seconds"
              type="number"
              min={0}
              placeholder="300"
              value={defaultTimeout}
              onChange={(e) => setDefaultTimeout(e.target.value)}
            />
            {errors.default_timeout_seconds && (
              <FieldError>{errors.default_timeout_seconds}</FieldError>
            )}
          </Field>
        </div>
      </section>

      {/* Technical Config */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold">Technical configuration</h2>
          <p className="text-sm text-muted-foreground">
            Paste JSON exported from ComfyUI and define parameterizable nodes.
          </p>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="comfy_workflow">ComfyUI workflow JSON</FieldLabel>
            <FieldDescription>
              Export your workflow from ComfyUI (Save → API format) and paste the JSON here.
            </FieldDescription>
            <Textarea
              id="comfy_workflow"
              placeholder="{}"
              rows={12}
              className="font-mono text-xs"
              value={comfyWorkflowJson}
              onChange={(e) => setComfyWorkflowJson(e.target.value)}
            />
            {errors.comfy_workflow && <FieldError>{errors.comfy_workflow}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="model_files">Model files</FieldLabel>
            <FieldDescription>
              JSON array of model file descriptors required by this workflow.
            </FieldDescription>
            <Textarea
              id="model_files"
              placeholder="[]"
              rows={5}
              className="font-mono text-xs"
              value={modelFilesJson}
              onChange={(e) => setModelFilesJson(e.target.value)}
            />
            {errors.model_files && <FieldError>{errors.model_files}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="replaceable_nodes">Replaceable nodes</FieldLabel>
            <FieldDescription>
              JSON array of nodes users can parameterize when running this workflow.
            </FieldDescription>
            <Textarea
              id="replaceable_nodes"
              placeholder="[]"
              rows={5}
              className="font-mono text-xs"
              value={replaceableNodesJson}
              onChange={(e) => setReplaceableNodesJson(e.target.value)}
            />
            {errors.replaceable_nodes && (
              <FieldError>{errors.replaceable_nodes}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          disabled={isPending || isUploadInProgress}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || isUploadInProgress}>
          {isPending ? "Creating…" : "Create workflow"}
        </Button>
      </div>
    </form>
  );
}
