/** @format */

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamCookie, setTeamCookie } from "@/actions/team";
import { useTeams } from "./use-teams";
import { CURRENT_TEAM_QUERY_KEY } from "./use-team";

/**
 * Ensures the `team_id` cookie is set to a default (the first team) whenever
 * the user has teams but no cookie yet. Runs purely as a side effect — mount it
 * once in the authenticated layout so it doesn't depend on any UI being visible.
 */
export function useEnsureTeamCookie() {
  const queryClient = useQueryClient();
  const { data: teams } = useTeams();

  const { data: teamId } = useQuery({
    queryKey: CURRENT_TEAM_QUERY_KEY,
    queryFn: () => getTeamCookie(),
  });

  const firstTeamId = teams?.[0]?.id;

  useEffect(() => {
    if (teamId === null && firstTeamId) {
      setTeamCookie(firstTeamId).then(() => {
        queryClient.setQueryData(CURRENT_TEAM_QUERY_KEY, firstTeamId);
      });
    }
  }, [teamId, firstTeamId, queryClient]);
}
