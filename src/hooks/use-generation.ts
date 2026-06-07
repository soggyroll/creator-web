/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const generationQueryKey = (id: string) => ["generations", id] as const;

export function useGeneration(id: string) {
  return useQuery({
    queryKey: generationQueryKey(id),
    queryFn: () => api.generations.getById(id),
  });
}
