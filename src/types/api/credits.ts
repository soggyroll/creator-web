/** @format */

// src/types/api/credits.ts

export interface CreditBalanceResponse {
  balance: number;
  team_id: string;
}

export interface LedgerEntry {
  created_at?: string;
  delta?: number;
  generation_id?: string;
  id: string;
  idempotency_key?: string;
  kind?: string;
  reverses_ledger_id?: string;
  team_id?: string;
  user_id?: string;
}
