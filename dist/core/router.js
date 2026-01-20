"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routePrompt = routePrompt;
function extractDealId(text) {
    const m = text.match(/\bD-(103|221)\b/i);
    if (!m)
        return null;
    const normalized = `D-${m[1]}`;
    return normalized;
}
function routePrompt(prompt) {
    const p = prompt.toLowerCase();
    const dealId = extractDealId(prompt);
    // Draft email intent
    if (p.includes("draft") && p.includes("follow") && dealId) {
        if (p.includes("security") && (p.includes("timeline") || p.includes("review"))) {
            return [{ kind: "draft_email", dealId, intent: "ask_security_review_timeline" }];
        }
        return [{ kind: "draft_email", dealId, intent: "next_steps" }];
    }
    // SOC2 / pricing policy / KB queries
    if (p.includes("soc2") || p.includes("soc 2")) {
        return [{ kind: "kb", query: "SOC2" }];
    }
    if (p.includes("pricing") && (p.includes("exception") || p.includes("policy"))) {
        return [{ kind: "kb", query: "pricing exception policy" }];
    }
    if (p.includes("security") && (p.includes("faq") || p.includes("review"))) {
        return [{ kind: "kb", query: "security review faq timeline" }];
    }
    // Deal status
    if ((p.includes("status") || p.includes("stage") || p.includes("deal")) && dealId) {
        const routes = [{ kind: "deal_status", dealId }];
        if (p.includes("what should i do next") || p.includes("next") || p.includes("recommend")) {
            routes.push({ kind: "kb", query: "security faq pricing exception policy next steps" });
        }
        return routes;
    }
    return [{ kind: "unknown", reason: "No matching route rules." }];
}
