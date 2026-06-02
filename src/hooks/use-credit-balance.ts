/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const CREDIT_BALANCE_QUERY_KEY = ["me", "credits"] as const;

export function useCreditBalance() {
  return useQuery({
    queryKey: CREDIT_BALANCE_QUERY_KEY,
    queryFn: () => api.credits.get(),
    staleTime: 30_000,
  });
}
