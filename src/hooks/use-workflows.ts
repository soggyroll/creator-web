/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      return api.workflows.get();
    },
    staleTime: 5 * 60 * 1000,
  });
}
