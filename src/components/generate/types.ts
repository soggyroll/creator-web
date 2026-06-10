/** @format */

export interface GenerateFormValues {
  prompt: string;
  negativePrompt: string;
  imageSizePreset: string;
  inferenceSteps: number;
  guidanceScale: number;
  seed: string;
  numImages: number;
}

export type MediaInputKind = "image" | "video" | "media";

export interface WorkflowMediaInput {
  id: string;
  label: string;
  description?: string;
  kind: MediaInputKind;
  required?: boolean;
  accept: string[];
}

export type MediaInputStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "failed";

export interface DraftMediaInput {
  uploadId?: string;
  inputId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  previewUrl: string;
  progress: number;
  status: MediaInputStatus;
  assetId?: string;
  error?: string;
}

export const DEFAULT_FORM_VALUES: GenerateFormValues = {
  prompt: "",
  negativePrompt: "",
  imageSizePreset: "square_hd",
  inferenceSteps: 8,
  guidanceScale: 1,
  seed: "",
  numImages: 1,
};

export const IMAGE_SIZE_PRESETS = [
  { label: "Square", value: "square", width: 512, height: 512 },
  { label: "Square HD", value: "square_hd", width: 1024, height: 1024 },
  { label: "Portrait 3:4", value: "portrait_3_4", width: 768, height: 1024 },
  { label: "Portrait 9:16", value: "portrait_9_16", width: 576, height: 1024 },
  { label: "Landscape 4:3", value: "landscape_4_3", width: 1024, height: 768 },
  {
    label: "Landscape 16:9",
    value: "landscape_16_9",
    width: 1024,
    height: 576,
  },
] as const;

export const WORKFLOW_MEDIA_INPUTS: WorkflowMediaInput[] = [
  {
    id: "reference_media",
    label: "Reference media",
    description: "Image or video input for this workflow",
    kind: "media",
    accept: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ],
  },
];
