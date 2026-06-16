/** @format */

export interface ReplaceableNode {
  class_type: string;
  current_value: unknown;
  input_field: string;
  input_kind: string;
  node_id: string;
  title: string;
  value_type: string;
}

export interface Workflow {
  avg_time?: number;
  cost?: number;
  cover_url?: string;
  created_at?: string;
  description?: string;
  id?: string;
  name?: string;
  stats?: WorkflowStats;
  team?: WorkflowTeamRef;
  updated_at?: string;
  user?: WorkflowUserRef;
  viewer?: WorkflowViewer;
}

export interface WorkflowStats {
  likes?: number;
  runs?: number;
  saves?: number;
}

export interface WorkflowTeamRef {
  id?: string;
  name?: string;
}

export interface WorkflowUserRef {
  id?: string;
  name?: string;
}

export interface WorkflowViewer {
  liked?: boolean;
  saved?: boolean;
}
