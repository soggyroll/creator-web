/** @format */

import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEAMS_QUERY_KEY } from "./use-teams";

export function useLeaveTeam(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.teams.leave(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
    },
  });
}
