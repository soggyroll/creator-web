/** @format */

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const teamMembersQueryKey = (teamId: string) =>
  ["team-members", teamId] as const;

export function useTeamMembers(teamId: string | null) {
  return useQuery({
    queryKey: teamMembersQueryKey(teamId ?? ""),
    queryFn: () => api.teams.getMembers(teamId!),
    enabled: !!teamId,
  });
}
