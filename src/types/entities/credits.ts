/** @format */

export type EntryKind =
  | "charge"
  | "refund"
  | "purchase"
  | "grant"
  | "adjustment";

export interface LedgerEntry {
  created_at: string;
  delta: number;
  generation_id?: string;
  id: string;
  idempotency_key?: string;
  kind: EntryKind;
  reverses_ledger_id?: string;
  team_id: string;
  user_id: string;
}
