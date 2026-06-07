/** @format */

import { Workflow } from "../entities";

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
