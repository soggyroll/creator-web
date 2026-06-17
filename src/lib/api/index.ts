/** @format */

import {
  CreditBalanceResponse,
  LedgeHistoryResponse,
} from "@/types/api/credits";
import {
  WorkflowPage,
  WorkflowResponse,
  WorkflowViewResponse,
  WorkflowListParams,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from "@/types/api/workflows";
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
import {
  Team,
  TeamWithMembership,
  TeamMember,
  TeamMemberView,
  UpdateTeamRequest,
  UpdateMemberRoleRequest,
  AddMemberRequest,
  GrantFeatureRequest,
  TeamFeaturesResponse,
  TeamInvite,
  TeamInviteView,
  CreateTeamRequest,
  CreateInviteRequest,
  TransferOwnershipRequest,
} from "@/types/api/teams";
import {
  BatchListResponse,
  BatchListParams,
  BatchWithGenerations,
} from "@/types/api/batches";
import { User } from "@/types/api/user";
import { apiClient } from "../api-client";
import { Workflow } from "@/types/entities";
import { Generation } from "@/types/entities/generation";

export const api = {
  user: {
    me: async (): Promise<User> => {
      const { data } = await apiClient.get<User>("/me");
      return data;
    },
  },

  credits: {
    get: async (): Promise<CreditBalanceResponse> => {
      const { data } = await apiClient.get("/credits");
      return data;
    },
    getLedger: async (limit?: number): Promise<LedgeHistoryResponse> => {
      const { data } = await apiClient.get<LedgeHistoryResponse>(
        "/credits/ledger",
        { params: { limit } },
      );
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
    get: async (
      limit?: number,
      before?: string,
    ): Promise<ListGenerationResponse> => {
      const { data } = await apiClient.get<ListGenerationResponse>(
        "/generations",
        { params: { limit, before } },
      );
      return data;
    },
    getById: async (id: string): Promise<GenerationResponse> => {
      const { data } = await apiClient.get<GenerationResponse>(
        `/generations/${id}`,
      );
      return data;
    },
  },

  batches: {
    get: async (params?: BatchListParams): Promise<BatchListResponse> => {
      const { data } = await apiClient.get<BatchListResponse>("/batches", {
        params,
      });
      return data;
    },
    getById: async (id: string): Promise<BatchWithGenerations> => {
      const { data } = await apiClient.get<BatchWithGenerations>(
        `/batches/${id}`,
      );
      return data;
    },
    getGenerations: async (id: string): Promise<Generation[]> => {
      const { data } = await apiClient.get<Generation[]>(
        `/batches/${id}/generations`,
      );
      return data;
    },
  },

  teams: {
    get: async (): Promise<TeamWithMembership[]> => {
      const { data } = await apiClient.get("/teams");
      return data;
    },
    create: async (request: CreateTeamRequest): Promise<Team> => {
      const { data } = await apiClient.post<Team>("/teams", request);
      return data;
    },
    getById: async (id: string): Promise<Team> => {
      const { data } = await apiClient.get(`/teams/${id}`);
      return data;
    },
    update: async (id: string, request: UpdateTeamRequest): Promise<Team> => {
      const { data } = await apiClient.patch(`/teams/${id}`, request);
      return data;
    },
    archive: async (id: string): Promise<void> => {
      await apiClient.delete(`/teams/${id}`);
    },
    leave: async (id: string): Promise<void> => {
      await apiClient.post(`/teams/${id}/leave`);
    },
    transferOwnership: async (
      id: string,
      request: TransferOwnershipRequest,
    ): Promise<void> => {
      await apiClient.post(`/teams/${id}/transfer-ownership`, request);
    },
    getMembers: async (id: string): Promise<TeamMemberView[]> => {
      const { data } = await apiClient.get(`/teams/${id}/members`);
      return data;
    },
    updateMemberRole: async (
      teamId: string,
      userId: string,
      request: UpdateMemberRoleRequest,
    ): Promise<TeamMember> => {
      const { data } = await apiClient.patch(
        `/teams/${teamId}/members/${userId}`,
        request,
      );
      return data;
    },
    addMember: async (
      teamId: string,
      request: AddMemberRequest,
    ): Promise<TeamMember> => {
      const { data } = await apiClient.post(
        `/teams/${teamId}/members`,
        request,
      );
      return data;
    },
    removeMember: async (teamId: string, userId: string): Promise<void> => {
      await apiClient.delete(`/teams/${teamId}/members/${userId}`);
    },
    invites: {
      list: async (teamId: string): Promise<TeamInvite[]> => {
        const { data } = await apiClient.get<TeamInvite[]>(
          `/teams/${teamId}/invites`,
        );
        return data;
      },
      create: async (
        teamId: string,
        request?: CreateInviteRequest,
      ): Promise<TeamInvite> => {
        const { data } = await apiClient.post<TeamInvite>(
          `/teams/${teamId}/invites`,
          request,
        );
        return data;
      },
      revoke: async (teamId: string, token: string): Promise<void> => {
        await apiClient.delete(`/teams/${teamId}/invites/${token}`);
      },
    },
  },

  invites: {
    getInfo: async (token: string): Promise<TeamInviteView> => {
      const { data } = await apiClient.get<TeamInviteView>(`/invites/${token}`);
      return data;
    },
    accept: async (token: string): Promise<void> => {
      await apiClient.post(`/invites/${token}/accept`);
    },
  },

  admin: {
    features: {
      list: async (teamId: string): Promise<TeamFeaturesResponse> => {
        const { data } = await apiClient.get(`/admin/teams/${teamId}/features`);
        return data;
      },
      grant: async (
        teamId: string,
        request: GrantFeatureRequest,
      ): Promise<void> => {
        await apiClient.post(`/admin/teams/${teamId}/features`, request);
      },
      revoke: async (teamId: string, feature: string): Promise<void> => {
        await apiClient.delete(`/admin/teams/${teamId}/features/${feature}`);
      },
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
    get: async (params?: WorkflowListParams): Promise<Workflow[]> => {
      const { data } = await apiClient.get<WorkflowPage>("/workflows", {
        params,
      });
      return data.data;
    },
    getById: async (id: string): Promise<WorkflowViewResponse> => {
      const { data } = await apiClient.get<WorkflowViewResponse>(
        `/workflows/${id}`,
      );
      return data;
    },
    getMyWorkflows: async (): Promise<Workflow[]> => {
      const { data } = await apiClient.get<Workflow[]>("/my/workflows");
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
    update: async (
      id: string,
      request: UpdateWorkflowRequest,
    ): Promise<WorkflowResponse> => {
      const { data } = await apiClient.patch<WorkflowResponse>(
        `/workflows/${id}`,
        request,
      );
      return data;
    },
  },
};
