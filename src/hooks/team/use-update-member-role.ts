/** @format */

import { api } from "@/lib/api";
import { TeamRole } from "@/types/api/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamMembersQueryKey } from "./use-team-members";

export function useUpdateMemberRole(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: TeamRole }) =>
      api.teams.updateMemberRole(teamId, userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey(teamId) });
    },
  });
}
