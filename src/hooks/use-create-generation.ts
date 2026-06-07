/** @format */

import { api } from "@/lib/api";
import { GenerateRequest } from "@/types/api/generations";
import { useMutation } from "@tanstack/react-query";

export function useCreateGeneration() {
  return useMutation({
    mutationKey: ["create-generation"],
    mutationFn: async (request: GenerateRequest) => {
      const response = await api.generations.create(request);
      return response;
    },
  });
}
