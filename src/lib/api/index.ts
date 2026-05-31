/** @format */

import { WorkflowResponse } from "@/types/api/workflows";

import { GenerationResult } from "@/types/api/generations";
import { Team, TeamWithMembership, TeamMember } from "@/types/api/teams";
import { apiClient } from "../api-client";
import { Workflow } from "@/types/entities";

export const api = {
  workflows: {
    get: async (): Promise<Workflow[]> => {
      const { data } = await apiClient.get("/workflows");
      return data;
    },
    getById: async (id: string): Promise<WorkflowResponse> => {
      const { data } = await apiClient.get(`/workflows/${id}`);
      return data;
    },
  },

  generations: {
    get: async (limit?: number): Promise<GenerationResult[]> => {
      const { data } = await apiClient.get("/generations", {
        params: { limit },
      });
      return data;
    },
    getById: async (id: string): Promise<GenerationResult> => {
      const { data } = await apiClient.get(`/generations/${id}`);
      return data;
    },
  },

  teams: {
    get: async (): Promise<TeamWithMembership[]> => {
      const { data } = await apiClient.get("/teams");
      return data;
    },
    getById: async (id: string): Promise<Team> => {
      const { data } = await apiClient.get(`/teams/${id}`);
      return data;
    },
    getMembers: async (id: string): Promise<TeamMember[]> => {
      const { data } = await apiClient.get(`/teams/${id}/members`);
      return data;
    },
  },
};
