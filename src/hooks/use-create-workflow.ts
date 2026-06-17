/** @format */

import { api } from "@/lib/api";
import { CreateWorkflowRequest } from "@/types/api/workflows";
import { useMutation } from "@tanstack/react-query";

export function useCreateWorkflow() {
  return useMutation({
    mutationKey: ["create-workflow"],
    mutationFn: (request: CreateWorkflowRequest) =>
      api.workflows.create(request),
  });
}
