/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const TEAMS_QUERY_KEY = ["teams"] as const;

export function useTeams() {
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => api.teams.get(),
  });
}
