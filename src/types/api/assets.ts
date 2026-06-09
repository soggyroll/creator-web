/** @format */

export type AssetStatus = "pending" | "uploaded" | "failed";
export type AssetType = "input" | "output" | "lora" | "checkpoint";

export interface Asset {
  asset_type?: AssetType;
  content_type?: string;
  created_at?: string;
  expires_at?: string;
  generation_id?: string;
  id?: string;
  name?: string;
  s3_key?: string;
  size_bytes?: number;
  status?: AssetStatus;
  team_id?: string;
  uploaded_at?: string;
  user_id?: string;
}

export interface ListAssetsParams {
  limit?: number;
  before?: string;
}

export interface AssetListResponse {
  data?: Asset[];
  next_cursor?: string;
}

export interface InitAssetUploadRequest {
  content_type: string;
  filename: string;
  size_bytes: number;
}

export interface InitAssetUploadResponse {
  asset_id?: string;
  expires_at?: string;
  s3_key?: string;
  upload_url?: string;
}

export interface CompleteAssetUploadRequest {
  asset_id: string;
}

export interface AssetResponse {
  asset?: Asset;
}

export interface AssetURLResponse {
  expires_at?: string;
  url?: string;
}
