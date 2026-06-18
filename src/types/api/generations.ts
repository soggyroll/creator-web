/** @format */

import { Attachment } from "../entities/generation";

export type FaultSource = "user" | "platform";
export type BatchPriority = "urgent" | "standard" | "patient";
export type BatchStatus =
  | "pending"
  | "running"
  | "completed"
  | "partial_failure"
  | "failed";
export type GenerationStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "retrying";

export type WorkflowInputs = Record<string, unknown>;

export type WorkflowInputsBody = Record<string, unknown>;

export interface GenerationUserRef {
  avatar_url?: string;
  id: string;
  name: string;
}

export interface GenerationWorkflowRef {
  avg_time: number;
  cost: number;
  cover_url?: string;
  description?: string;
  id: string;
  name: string;
}

export interface GenerationView {
  attachments: Attachment[];
  batch_id: string;
  enqueued_at: string;
  error_log?: string;
  execution_stage: string;
  fault_source?: FaultSource;
  finished_at?: string;
  id: string;
  output_expiry?: string;
  output_url?: string;
  priority: BatchPriority;
  prompt: string;
  retry_count: number;
  started_at?: string;
  status: GenerationStatus;
  team_id: string;
  user: GenerationUserRef;
  workflow: GenerationWorkflowRef;
  workflow_inputs: WorkflowInputs;
}

export type GenerationResponse = GenerationView;

export interface ListGenerationResponse {
  data: GenerationView[];
  next_cursor: string;
}

export interface GenerationInput {
  inputs: WorkflowInputsBody;
  workflow_id: string;
}

export interface GenerateRequest {
  generations: GenerationInput[];
  priority: BatchPriority;
}

export interface GenerateResponse {
  batch_id: string;
  generation_ids: string[];
  status: string;
}

/** Raw domain Generation returned from GET /batches/{id}/generations */
