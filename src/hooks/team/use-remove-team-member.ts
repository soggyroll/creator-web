/** @format */

import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamMembersQueryKey } from "./use-team-members";

export function useRemoveTeamMember(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.teams.removeMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey(teamId) });
    },
  });
}
