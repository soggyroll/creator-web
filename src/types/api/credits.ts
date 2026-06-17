/** @format */

import { LedgerEntry } from "../entities/credits";

export interface CreditBalanceResponse {
  balance: number;
  team_id: string;
}

export type LedgeHistoryResponse = { data: LedgerEntry[] };
