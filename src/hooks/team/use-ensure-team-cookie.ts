import { useTeam } from "./use-team";

/** Resolves and persists the active team before dependent views mount. */
export function useEnsureTeamCookie() {
  return useTeam();
}
