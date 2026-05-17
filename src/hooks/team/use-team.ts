/** @format */

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamCookie, setTeamCookie } from "@/actions/team";
import { useTeams } from "./use-teams";

export const CURRENT_TEAM_QUERY_KEY = ["team", "current"] as const;

export function useTeam() {
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

  const team =
    (teamId ? teams?.find((t) => t.id === teamId) : undefined) ??
    teams?.[0] ??
    null;

  return { team, teamId: team?.id ?? null };
}
