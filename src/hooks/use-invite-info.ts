/** @format */

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const inviteInfoQueryKey = (token: string) =>
  ["invite-info", token] as const;

export function useInviteInfo(token: string) {
  return useQuery({
    queryKey: inviteInfoQueryKey(token),
    queryFn: () => api.invites.getInfo(token),
    retry: false,
  });
}
