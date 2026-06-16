/** @format */

"use server";

import { serverApiClient } from "./server-client";
import { WorkflowResponse } from "@/types/api/workflows";

export async function getWorkflowById(id: string) {
  const response = await serverApiClient.get<WorkflowResponse>(
    `/workflows/${id}`,
  );

  return response.data;
}
