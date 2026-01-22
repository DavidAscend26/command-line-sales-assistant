import { DEALS } from "../data/hardcoded";
import type { Deal } from "../core/types";

export function getOpenDeals(): Deal[] {
  return DEALS.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost");
}