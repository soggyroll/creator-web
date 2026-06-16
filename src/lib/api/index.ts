/** @format */

import {
  CreditBalanceResponse,
  LedgeHistoryResponse,
} from "@/types/api/credits";
import { WorkflowPage, WorkflowResponse } from "@/types/api/workflows";
import {
  GenerateRequest,
  GenerateResponse,
  GenerationResponse,
  ListGenerationResponse,
} from "@/types/api/generations";
import {
  AssetListResponse,
  AssetResponse,
  AssetURLResponse,
  CompleteAssetUploadRequest,
  InitAssetUploadRequest,
  InitAssetUploadResponse,
  ListAssetsParams,
} from "@/types/api/assets";
import { Team, TeamWithMembership, TeamMember } from "@/types/api/teams";
import { apiClient } from "../api-client";
import { Workflow } from "@/types/entities";
import { CreateWorkflowRequest } from "@/types/api/workflows";

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
      const { data } = await apiClient.post<GenerateResponse>(
        "/generate",
        request,
      );
      return data;
    },
    get: async (limit?: number): Promise<ListGenerationResponse> => {
      const { data } = await apiClient.get("/generations", {
        params: { limit },
      });
      return data;
    },
    getById: async (id: string): Promise<GenerationResponse> => {
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

  assets: {
    get: async (params?: ListAssetsParams): Promise<AssetListResponse> => {
      const { data } = await apiClient.get("/assets", { params });
      return data;
    },
    initUpload: async (
      request: InitAssetUploadRequest,
    ): Promise<InitAssetUploadResponse> => {
      const { data } = await apiClient.post("/assets/uploads/init", request);
      return data;
    },
    completeUpload: async (
      request: CompleteAssetUploadRequest,
    ): Promise<AssetResponse> => {
      const { data } = await apiClient.post(
        "/assets/uploads/complete",
        request,
      );
      return data;
    },
    getUrl: async (id: string): Promise<AssetURLResponse> => {
      const { data } = await apiClient.get(`/assets/${id}/url`);
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
    create: async (
      request: CreateWorkflowRequest,
    ): Promise<WorkflowResponse> => {
      const { data } = await apiClient.post<WorkflowResponse>(
        "/workflows",
        request,
      );
      return data;
    },
  },
};
