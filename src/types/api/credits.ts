/** @format */

import { LedgerEntry } from "../entities/credits";

export interface CreditBalanceResponse {
  balance: number;
  team_id: string;
}

export interface LedgeHistoryResponse {
  data: LedgerEntry[];
}
