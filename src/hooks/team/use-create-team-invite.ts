/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CreateInviteRequest } from "@/types/api/teams";
import { teamInvitesQueryKey } from "./use-team-invites";

export function useCreateTeamInvite(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request?: CreateInviteRequest) =>
      api.teams.invites.create(teamId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamInvitesQueryKey(teamId) });
    },
  });
}
