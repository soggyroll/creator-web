/** @format */

export type ValueType = "string" | "float" | "int";

export interface ReplaceableNode {
  class_type: string;
  current_value: unknown;
  input_field: string;
  input_kind: string;
  node_id: string;
  title: string;
  value_type: string;
}

/** Enriched list view returned from GET /workflows and GET /my/workflows — no replaceable_nodes */
export interface Workflow {
  avg_time: number;
  cost: number;
  cover_url?: string;
  created_at: string;
  description?: string;
  id: string;
  name: string;
  stats: WorkflowStats;
  team: WorkflowTeamRef;
  updated_at: string;
  user: WorkflowUserRef;
  viewer: WorkflowViewer;
}

/** Enriched detail view returned from GET /workflows/{id} — includes replaceable_nodes */
export interface WorkflowDetailView extends Workflow {
  replaceable_nodes: ReplaceableNode[];
}

/** Full domain object returned from POST /workflows and PATCH /workflows/{id} */
export interface WorkflowFull {
  avg_time: number;
  comfy_workflow: Record<string, unknown>;
  cost: number;
  cover_url?: string;
  created_at: string;
  default_timeout_seconds: number;
  description?: string;
  id: string;
  is_public: boolean;
  model_files: Record<string, unknown>[];
  name: string;
  replaceable_nodes: ReplaceableNode[];
  required_vram_gb: number;
  team_id: string;
  updated_at: string;
  user_id: string;
}

export interface WorkflowStats {
  likes: number;
  runs: number;
  saves: number;
}

export interface WorkflowTeamRef {
  id: string;
  name: string;
}

export interface WorkflowUserRef {
  id: string;
  name: string;
}

export interface WorkflowViewer {
  liked: boolean;
  saved: boolean;
}
