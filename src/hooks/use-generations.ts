/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const GENERATIONS_QUERY_KEY = ["generations"] as const;

export function useGenerations(options?: { limit?: number }) {
  return useQuery({
    queryKey: [...GENERATIONS_QUERY_KEY, options?.limit],
    queryFn: () => api.generations.get(options?.limit),
  });
}
