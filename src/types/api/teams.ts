/** @format */

export type TeamFeature = "workflow_creation";
export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";
export type MemberStatus = "ACTIVE" | "LEFT" | "REMOVED" | "INVITED";
export type TeamInviteStatus = "active" | "revoked";

export interface Team {
  archived_at?: string;
  avatar_url?: string;
  created_at: string;
  created_by_user_id?: string;
  description?: string;
  features: TeamFeature[];
  id: string;
  is_personal: boolean;
  name: string;
  slug?: string;
  updated_at: string;
}

export interface TeamWithMembership {
  archived_at?: string;
  avatar_url?: string;
  created_at: string;
  created_by_user_id?: string;
  description?: string;
  features: TeamFeature[];
  id: string;
  is_personal: boolean;
  joined_at?: string;
  name: string;
  role: TeamRole;
  slug?: string;
  status: MemberStatus;
  updated_at: string;
}

export interface TeamMember {
  created_at: string;
  id: string;
  invited_by_user_id?: string;
  invited_via_token?: string;
  joined_at?: string;
  left_at?: string;
  removed_by_user_id?: string;
  role: TeamRole;
  status: MemberStatus;
  team_id: string;
  updated_at: string;
  user_id: string;
}

export interface TeamMemberView {
  created_at: string;
  id: string;
  joined_at?: string;
  role: TeamRole;
  status: MemberStatus;
  team_id: string;
  user_avatar_url?: string;
  user_email: string;
  user_id: string;
  user_name: string;
}

export interface TeamInvite {
  created_at: string;
  created_by_user_id: string;
  expires_at: string;
  id: string;
  max_uses?: number;
  status: TeamInviteStatus;
  team_id: string;
  token: string;
  updated_at: string;
  use_count: number;
}

export interface TeamInviteView {
  expires_at: string;
  inviter_name: string;
  status: TeamInviteStatus;
  team_avatar_url?: string;
  team_id: string;
  team_name: string;
  token: string;
}

export interface UpdateTeamRequest {
  name?: string;
  slug?: string;
}

export interface UpdateMemberRoleRequest {
  role: TeamRole;
}

export interface GrantFeatureRequest {
  feature: TeamFeature;
}

export interface AddMemberRequest {
  user_id: string;
  role: TeamRole;
}

export interface CreateTeamRequest {
  name: string;
}

export interface CreateInviteRequest {
  expires_in_days?: number;
  max_uses?: number;
}

export interface TransferOwnershipRequest {
  user_id: string;
}

export type TeamFeaturesResponse = Record<string, TeamFeature[]>;
