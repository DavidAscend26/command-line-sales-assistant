"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeal = getDeal;
const hardcoded_1 = require("../data/hardcoded");
const errors_1 = require("../utils/errors");
function getDeal(dealId) {
    const deal = hardcoded_1.DEALS.find((d) => d.id === dealId);
    if (!deal) {
        throw new errors_1.AppError("NOT_FOUND", `Deal not found: ${dealId}`);
    }
    return deal;
}
