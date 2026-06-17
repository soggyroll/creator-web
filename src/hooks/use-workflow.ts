/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => await api.workflows.getById(workflowId),
    enabled: !!workflowId,
    staleTime: 5 * 60 * 1000,
  });
};
