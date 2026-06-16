/** @format */

import { ReplaceableNode, Workflow } from "../entities";

export interface WorkflowResponse {
  workflow: Workflow;
}

export interface WorkflowPage {
  data: Workflow[];
  total_count: number;
  limit: number;
  offset: number;
  has_more: boolean;
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
