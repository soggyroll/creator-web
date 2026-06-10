/** @format */

export interface Generation {
  attachments?: Attachment[];
  batch_id?: string;
  enqueued_at?: string;
  error_log?: string;
  execution_stage?: string;
  fault_source?: FaultSource;
  finished_at?: string;
  id: string;
  instance_id?: string;
  output_expires_at?: string;
  output_s3_key?: string;
  priority?: BatchPriority;
  prompt?: string;
  retry_count?: number;
  runtime_status?: number[];
  started_at?: string;
  status?: GenerationStatus;
  team_id?: string;
  user_id?: string;
  workflow_id?: string;
  workflow_inputs?: WorkflowInputs;
}

export interface GenerationResult {
  generation: Generation;
  output_expiry?: string;
  output_url?: string;
}

export interface Attachment {
  type?: string;
  url?: string;
}

export type FaultSource = string;
export type BatchPriority = "urgent" | "standard" | "patient";
export type GenerationStatus = string;
export interface WorkflowInputs {
  image_asset_ids?: Record<string, string>;
  image_urls?: Record<string, string>;
  primitive_inputs?: Record<string, unknown>;
  video_asset_ids?: Record<string, string>;
}

export interface GenerationInput {
  attachments?: Attachment[];
  inputs?: WorkflowInputs;
  prompt?: string;
  workflow_id: string;
}

export interface GenerateRequest {
  generations: GenerationInput[];
  priority: BatchPriority;
}

export interface GenerateResponse {
  batch_id?: string;
  generation_ids?: string[];
  status?: string;
}
