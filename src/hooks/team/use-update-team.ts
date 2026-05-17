/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTeamCookie } from "@/actions/team";
import { CURRENT_TEAM_QUERY_KEY } from "./use-team";

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => setTeamCookie(teamId),
    onSuccess: (_data, teamId) => {
      queryClient.setQueryData(CURRENT_TEAM_QUERY_KEY, teamId);
    },
  });
}
