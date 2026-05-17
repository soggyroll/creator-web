/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1Teams } from "@/api/teams/teams";

export const TEAMS_QUERY_KEY = ["teams"] as const;

export function useTeams() {
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => getApiV1Teams(),
  });
}
