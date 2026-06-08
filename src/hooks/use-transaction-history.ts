/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Transaction {
  id: string;
  type: "credit_purchase" | "generation_spend";
  amount: number;
  description: string;
  created_at: string;
}

export const TRANSACTION_HISTORY_QUERY_KEY = ["transactions"] as const;

export function useTransactionHistory() {
  return useQuery({
    queryKey: TRANSACTION_HISTORY_QUERY_KEY,
    queryFn: async () => api.credits.getLedger(),
    staleTime: Infinity,
  });
}
