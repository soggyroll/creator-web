/** @format */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const teamInvitesQueryKey = (teamId: string) =>
  ["team-invites", teamId] as const;

export function useTeamInvites(teamId: string | null) {
  return useQuery({
    queryKey: teamInvitesQueryKey(teamId ?? ""),
    queryFn: () => api.teams.invites.list(teamId!),
    enabled: !!teamId,
  });
}
