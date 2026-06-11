/** @format */

"use client";

import { useEnsureTeamCookie } from "@/hooks/team/use-ensure-team-cookie";

/**
 * Headless component that guarantees the default `team_id` cookie is set for
 * authenticated users, independent of whether the team selector is rendered.
 */
export function TeamCookieSync() {
  useEnsureTeamCookie();
  return null;
}
