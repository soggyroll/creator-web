/** @format */

export interface Workflow {
  avg_time?: number;
  comfy_workflow?: Record<string, unknown>;
  cost?: number;
  created_at?: string;
  default_timeout_seconds?: number;
  description?: string;
  id: string;
  is_public?: boolean;
  model_files?: Record<string, unknown>[];
  name: string;
  required_vram_gb?: number;
  team_id?: string;
  updated_at?: string;
  user_id?: string;
}
