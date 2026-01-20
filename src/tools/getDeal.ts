import { DEALS } from "../data/hardcoded";
import type { Deal, DealId } from "../core/types";
import { AppError } from "../utils/errors";

export function getDeal(dealId: DealId): Deal {
  const deal = DEALS.find((d) => d.id === dealId);
  if (!deal) {
    throw new AppError("NOT_FOUND", `Deal not found: ${dealId}`);
  }
  return deal;
}