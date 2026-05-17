/** @format */

"use server";

import { cookies } from "next/headers";

const TEAM_COOKIE = "team_id";

export async function setTeamCookie(teamId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TEAM_COOKIE, teamId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function getTeamCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TEAM_COOKIE)?.value ?? null;
}
