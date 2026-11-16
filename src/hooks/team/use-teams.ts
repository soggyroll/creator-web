/** @format */

import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { TEAMS_QUERY_KEY, loadTeamMemberships } from "@/lib/active-team";

export { TEAMS_QUERY_KEY } from "@/lib/active-team";

export function useTeams() {
  const { isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => loadTeamMemberships(queryClient, api.user.bootstrap, api.teams.get),
    enabled: isLoaded && isSignedIn,
    refetchOnMount: "always",
  });
}
