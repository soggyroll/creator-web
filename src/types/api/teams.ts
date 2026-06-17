/** @format */

export type TeamFeature = "workflow_creation";

export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";

export type MemberStatus = "ACTIVE" | "LEFT" | "REMOVED" | "INVITED";

export interface Team {
  archived_at?: string;
  created_at?: string;
  created_by_user_id?: string;
  features: TeamFeature[];
  id: string;
  name: string;
  slug?: string;
  updated_at?: string;
}

export interface TeamWithMembership {
  archived_at?: string;
  created_at?: string;
  created_by_user_id?: string;
  features: TeamFeature[];
  id: string;
  joined_at?: string;
  name: string;
  role?: TeamRole;
  slug?: string;
  status?: MemberStatus;
  updated_at?: string;
}

export interface TeamMember {
  created_at?: string;
  id: string;
  invited_by_user_id?: string;
  joined_at?: string;
  left_at?: string;
  removed_by_user_id?: string;
  role?: TeamRole;
  status?: MemberStatus;
  team_id?: string;
  updated_at?: string;
  user_id?: string;
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

export type TeamFeaturesResponse = Record<string, TeamFeature[]>;
