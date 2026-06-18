/** @format */

import type { ReplaceableNode } from "@/types/entities";

export type MediaInputKind = "image" | "video" | "media";

export interface WorkflowMediaInput {
  id: string;
  label: string;
  description?: string;
  kind: MediaInputKind;
  required?: boolean;
  accept: string[];
}

export type MediaInputStatus = "idle" | "uploading" | "uploaded" | "failed";

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

export type WorkflowField =
  | { kind: "media"; nodeId: string; title: string; accept: string[] }
  | {
      kind: "text";
      nodeId: string;
      title: string;
      multiline: boolean;
      defaultValue: string;
    }
  | { kind: "int"; nodeId: string; title: string; defaultValue: number }
  | { kind: "float"; nodeId: string; title: string; defaultValue: number };

export type PrimitiveWorkflowField = Extract<
  WorkflowField,
  { kind: "text" | "int" | "float" }
>;

export function normalizeNodes(nodes: ReplaceableNode[]): WorkflowField[] {
  return nodes
    .filter((node) => !Array.isArray(node.current_value))
    .map((node): WorkflowField => {
      if (node.input_kind === "media") {
        return {
          kind: "media",
          nodeId: node.node_id,
          title: node.title,
          accept:
            node.value_type === "image"
              ? ["image/png", "image/jpeg", "image/webp"]
              : [
                  "image/png",
                  "image/jpeg",
                  "image/webp",
                  "video/mp4",
                  "video/webm",
                  "video/quicktime",
                ],
        };
      }
      if (node.value_type === "int") {
        return {
          kind: "int",
          nodeId: node.node_id,
          title: node.title,
          defaultValue:
            typeof node.current_value === "number" ? node.current_value : 0,
        };
      }
      if (node.value_type === "float") {
        return {
          kind: "float",
          nodeId: node.node_id,
          title: node.title,
          defaultValue:
            typeof node.current_value === "number" ? node.current_value : 0,
        };
      }
      return {
        kind: "text",
        nodeId: node.node_id,
        title: node.title,
        multiline: node.class_type === "PrimitiveStringMultiline",
        defaultValue:
          typeof node.current_value === "string" ? node.current_value : "",
      };
    });
}

export function fieldToMediaInput(
  field: Extract<WorkflowField, { kind: "media" }>,
): WorkflowMediaInput {
  return {
    id: field.nodeId,
    label: field.title,
    kind: "media",
    accept: field.accept,
  };
}
