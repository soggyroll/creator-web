/** @format */

import { useGenerations } from "./use-generations";
import { useCreditBalance } from "./use-credit-balance";

export function useDashboardStats() {
  const { data: generations, isLoading: loadingGens } = useGenerations({
    limit: 100,
  });
  const { data: credits, isLoading: loadingCredits } = useCreditBalance();

  const active =
    generations?.data.filter(
      (g) =>
        g.status === "queued" ||
        g.status === "running" ||
        g.status === "retrying",
    ).length ?? 0;

  const completed =
    generations?.data.filter((g) => g.status === "completed").length ?? 0;

  return {
    credits: credits?.balance,
    total: generations?.data.length ?? 0,
    active,
    completed,
    isLoading: loadingGens || loadingCredits,
  };
}
