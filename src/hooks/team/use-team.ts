/** @format */

import { useQuery } from "@tanstack/react-query";
import { getTeamCookie } from "@/actions/team";
import { useTeams } from "./use-teams";

export const CURRENT_TEAM_QUERY_KEY = ["team", "current"] as const;

export function useTeam() {
  const { data: teams } = useTeams();

  const { data: teamId } = useQuery({
    queryKey: CURRENT_TEAM_QUERY_KEY,
    queryFn: () => getTeamCookie(),
  });

  const team =
    (teamId ? teams?.find((t) => t.id === teamId) : undefined) ??
    teams?.[0] ??
    null;

  return { team, teamId: team?.id ?? null };
}
