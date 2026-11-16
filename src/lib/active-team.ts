import type { QueryClient } from "@tanstack/react-query";

export const TEAMS_QUERY_KEY = ["teams"] as const;
export const CURRENT_TEAM_QUERY_KEY = ["team", "current"] as const;
export const USER_BOOTSTRAP_QUERY_KEY = ["user", "bootstrap"] as const;

type TeamReference = { id: string };
type ReadTeamCookie = () => Promise<string | null>;
type SaveTeamCookie = (teamId: string | null) => Promise<void>;

export async function loadTeamMemberships<T>(
  queryClient: QueryClient,
  bootstrapUser: () => Promise<unknown>,
  loadTeams: () => Promise<T[]>,
): Promise<T[]> {
  await queryClient.ensureQueryData({
    queryKey: USER_BOOTSTRAP_QUERY_KEY,
    queryFn: bootstrapUser,
    staleTime: Infinity,
    retry: false,
  });
  return loadTeams();
}

export async function ensureActiveTeam(
  teams: readonly TeamReference[],
  readCookie: ReadTeamCookie,
  saveCookie: SaveTeamCookie,
): Promise<string | null> {
  const current = await readCookie();
  const selected = teams.some((team) => team.id === current)
    ? current
    : (teams[0]?.id ?? null);

  if (selected !== current) await saveCookie(selected);
  return selected;
}

export async function changeActiveTeam(
  queryClient: QueryClient,
  teamId: string | null,
  saveCookie: SaveTeamCookie,
): Promise<void> {
  const isTeamData = (query: { queryKey: readonly unknown[] }) =>
    query.queryKey[0] !== TEAMS_QUERY_KEY[0] &&
    !(query.queryKey[0] === USER_BOOTSTRAP_QUERY_KEY[0] &&
      query.queryKey[1] === USER_BOOTSTRAP_QUERY_KEY[1]) &&
    !(query.queryKey[0] === CURRENT_TEAM_QUERY_KEY[0] &&
      query.queryKey[1] === CURRENT_TEAM_QUERY_KEY[1]);

  await queryClient.cancelQueries({ predicate: isTeamData });
  await saveCookie(teamId);
  if (teamId === null) {
    queryClient.removeQueries({ predicate: isTeamData });
    queryClient.setQueryData(CURRENT_TEAM_QUERY_KEY, null);
    return;
  }

  const refreshed = queryClient.resetQueries({ predicate: isTeamData });
  queryClient.setQueryData(CURRENT_TEAM_QUERY_KEY, teamId);
  await refreshed;
}

export function initializeActiveTeam(
  queryClient: QueryClient,
  teams: readonly TeamReference[],
  readCookie: ReadTeamCookie,
  saveCookie: SaveTeamCookie,
): Promise<string | null> {
  return ensureActiveTeam(teams, readCookie, (teamId) =>
    changeActiveTeam(queryClient, teamId, saveCookie),
  );
}
