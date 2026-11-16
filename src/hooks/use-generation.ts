/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export const generationQueryKey = (id: string) => ["generations", id] as const;

export function useGeneration(id: string) {
  const { isLoaded, isSignedIn } = useAuth();
  return useQuery({
    queryKey: generationQueryKey(id),
    queryFn: () => api.generations.getById(id),
    enabled: isLoaded && isSignedIn && !!id,
  });
}
