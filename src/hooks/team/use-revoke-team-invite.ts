/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { teamInvitesQueryKey } from "./use-team-invites";

export function useRevokeTeamInvite(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => api.teams.invites.revoke(teamId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamInvitesQueryKey(teamId) });
    },
  });
}
