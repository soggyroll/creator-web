/** @format */

import {
  CreditBalanceResponse,
  LedgeHistoryResponse,
} from "@/types/api/credits";
import { WorkflowPage, WorkflowResponse } from "@/types/api/workflows";
import {
  GenerateRequest,
  GenerateResponse,
  GenerationResult,
} from "@/types/api/generations";
import { Team, TeamWithMembership, TeamMember } from "@/types/api/teams";
import { apiClient } from "../api-client";
import { Workflow } from "@/types/entities";

export const api = {
  credits: {
    get: async (): Promise<CreditBalanceResponse> => {
      const { data } = await apiClient.get("/credits");
      return data;
    },
    getLedger: async (limit?: number): Promise<LedgeHistoryResponse> => {
      const { data } = await apiClient.get("/credits/ledger", {
        params: { limit },
      });
      return data;
    },
  },

  generations: {
    create: async (request: GenerateRequest): Promise<GenerateResponse> => {
      const { data } = await apiClient.post("/generate", request);
      return data;
    },
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

  workflows: {
    get: async (): Promise<Workflow[]> => {
      const { data } = await apiClient.get<WorkflowPage>("/workflows");
      return data.data;
    },
    getById: async (id: string): Promise<WorkflowResponse> => {
      const { data } = await apiClient.get<WorkflowResponse>(
        `/workflows/${id}`,
      );
      return data;
    },
  },
};
