/** @format */

import { api } from "@/lib/api";
import { UpdateTeamRequest } from "@/types/api/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEAMS_QUERY_KEY } from "./use-teams";

export function usePatchTeam(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateTeamRequest) => api.teams.update(teamId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });
}
