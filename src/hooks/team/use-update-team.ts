/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTeamCookie } from "@/actions/team";
import { changeActiveTeam } from "@/lib/active-team";

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => changeActiveTeam(queryClient, teamId, setTeamCookie),
  });
}
