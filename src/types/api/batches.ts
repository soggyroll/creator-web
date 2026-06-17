/** @format */

import { Generation } from "../entities/generation";
import { BatchPriority, BatchStatus } from "./generations";

export interface Batch {
  completed_at?: string;
  created_at: string;
  id: string;
  priority: BatchPriority;
  status: BatchStatus;
  team_id: string;
  user_id: string;
}

export interface BatchListResponse {
  data: Batch[];
  next_cursor: string;
}

export interface BatchListParams {
  limit?: number;
  before?: string;
}

export interface BatchWithGenerations {
  batch: Batch;
  generations: Generation[];
}
