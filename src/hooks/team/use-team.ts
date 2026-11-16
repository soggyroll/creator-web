import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamCookie, setTeamCookie } from "@/actions/team";
import { CURRENT_TEAM_QUERY_KEY, TEAMS_QUERY_KEY, initializeActiveTeam } from "@/lib/active-team";
import type { TeamWithMembership } from "@/types/api/teams";
import { useTeams } from "./use-teams";

export { CURRENT_TEAM_QUERY_KEY } from "@/lib/active-team";

export function useTeam() {
  const { isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const teamsQuery = useTeams();
  const activeTeamQuery = useQuery({
    queryKey: CURRENT_TEAM_QUERY_KEY,
    queryFn: () => initializeActiveTeam(
      queryClient,
      queryClient.getQueryData<TeamWithMembership[]>(TEAMS_QUERY_KEY) ?? [],
      getTeamCookie,
      setTeamCookie,
    ),
    enabled: isLoaded && !!isSignedIn && teamsQuery.isSuccess,
    staleTime: Infinity,
  });

  const team = teamsQuery.data?.find((item) => item.id === activeTeamQuery.data) ?? null;

  useEffect(() => {
    if (!isSignedIn || !teamsQuery.isSuccess || !activeTeamQuery.isSuccess || activeTeamQuery.isFetching) return;
    const hasTeams = !!teamsQuery.data?.length;
    if ((hasTeams && !team) || (!hasTeams && activeTeamQuery.data !== null)) {
      void queryClient.invalidateQueries({ queryKey: CURRENT_TEAM_QUERY_KEY });
    }
  }, [isSignedIn, teamsQuery.isSuccess, teamsQuery.data, activeTeamQuery.isSuccess, activeTeamQuery.isFetching, activeTeamQuery.data, team, queryClient]);

  const isReady = isLoaded && (!isSignedIn || (
    teamsQuery.isSuccess && activeTeamQuery.isSuccess &&
    (!!team || !teamsQuery.data?.length)
  ));

  async function retry() {
    const result = await teamsQuery.refetch();
    if (result.isSuccess) await activeTeamQuery.refetch();
  }

  return {
    team,
    teamId: team?.id ?? null,
    isReady,
    isSignedIn: !!isSignedIn,
    isError: teamsQuery.isError || activeTeamQuery.isError,
    retry,
  };
}
