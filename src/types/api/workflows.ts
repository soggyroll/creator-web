/** @format */

import { ReplaceableNode, Workflow, WorkflowDetailView, WorkflowFull } from "../entities";

/** Wraps WorkflowFull — returned from POST /workflows and PATCH /workflows/{id} */
export interface WorkflowResponse {
  workflow: WorkflowFull;
}

/** Wraps enriched WorkflowDetailView — returned from GET /workflows/{id} */
export interface WorkflowViewResponse {
  workflow: WorkflowDetailView;
}

/** Offset-paginated list of enriched workflow views — returned from GET /workflows */
export interface WorkflowPage {
  data: Workflow[];
  total_count: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface WorkflowListParams {
  limit?: number;
  offset?: number;
  sort?: "newest" | "likes" | "runs";
}

export interface CreateWorkflowRequest {
  name: string;
  description: string;
  cover_url: string;
  is_public: boolean;
  comfy_workflow: Record<string, unknown>;
  model_files: Record<string, unknown>[];
  replaceable_nodes: ReplaceableNode[];
  avg_time: number;
  cost: number;
  default_timeout_seconds: number;
  required_vram_gb: number;
}

export interface UpdateWorkflowRequest {
  name: string;
  description: string;
  cover_url: string;
  is_public: boolean;
  comfy_workflow: Record<string, unknown>;
  model_files: Record<string, unknown>[];
  replaceable_nodes: ReplaceableNode[];
  avg_time: number;
  cost: number;
  default_timeout_seconds: number;
  required_vram_gb: number;
}
