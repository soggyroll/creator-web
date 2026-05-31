/** @format */

// src/types/api/teams.ts

export interface Team {
  archived_at?: string;
  created_at?: string;
  created_by_user_id?: string;
  id: string;
  name: string;
  slug?: string;
  updated_at?: string;
}

export interface TeamWithMembership {
  archived_at?: string;
  created_at?: string;
  created_by_user_id?: string;
  id: string;
  joined_at?: string;
  name: string;
  role?: string;
  slug?: string;
  status?: string;
  updated_at?: string;
}

export interface TeamMember {
  created_at?: string;
  id: string;
  invited_by_user_id?: string;
  joined_at?: string;
  left_at?: string;
  removed_by_user_id?: string;
  role?: string;
  status?: string;
  team_id?: string;
  updated_at?: string;
  user_id?: string;
}
