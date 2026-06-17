/** @format */

import { api } from "@/lib/api";
import { AddMemberRequest } from "@/types/api/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamMembersQueryKey } from "./use-team-members";

export function useAddTeamMember(teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddMemberRequest) =>
      api.teams.addMember(teamId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamMembersQueryKey(teamId) });
    },
  });
}
