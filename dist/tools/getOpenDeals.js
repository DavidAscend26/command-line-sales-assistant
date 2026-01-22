"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenDeals = getOpenDeals;
const hardcoded_1 = require("../data/hardcoded");
function getOpenDeals() {
    return hardcoded_1.DEALS.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost");
}
