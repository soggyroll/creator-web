/** @format */

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (token: string) => api.invites.accept(token),
  });
}
