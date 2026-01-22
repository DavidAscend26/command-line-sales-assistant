"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOpenDeals = listOpenDeals;
const hardcoded_1 = require("../data/hardcoded");
/**
 * Returns all open deals.
 * A deal is considered open if it is not in a closed stage.
 */
function listOpenDeals() {
    return hardcoded_1.DEALS.filter((deal) => deal.stage !== "Closed Won" &&
        deal.stage !== "Closed Lost");
}
