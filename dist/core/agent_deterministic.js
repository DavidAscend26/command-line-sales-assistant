"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const router_1 = require("./router");
const getDeal_1 = require("../tools/getDeal");
const searchKb_1 = require("../tools/searchKb");
const draftFollowupEmail_1 = require("../tools/draftFollowupEmail");
const guardrails_1 = require("./guardrails");
const t_1 = require("../i18n/t");
function runAgent(prompt, locale = "en") {
    const routes = (0, router_1.routePrompt)(prompt);
    const sources = [];
    const actions = [];
    let answerParts = [];
    for (const r of routes) {
        if (r.kind === "unknown") {
            answerParts.push((0, t_1.t)(locale, "unknown", { reason: r.reason }));
            continue;
        }
        if (r.kind === "deal_status") {
            actions.push({ type: "tool_call", tool: "getDeal", input: { dealId: r.dealId } });
            const deal = (0, getDeal_1.getDeal)(r.dealId);
            sources.push({ type: "deal", dealId: deal.id });
            answerParts.push(`Deal ${deal.id} (${deal.accountName}) is currently in stage "${deal.stage}". ` +
                `Owner: ${deal.owner}. Amount: $${deal.amountUsd}. Close date: ${deal.closeDate}.`);
            if (deal.blockers.length > 0) {
                answerParts.push(`Blockers: ${deal.blockers.join("; ")}.`);
            }
            answerParts.push(`Suggested next step: ${deal.nextStep}`);
        }
        if (r.kind === "kb") {
            actions.push({ type: "tool_call", tool: "searchKb", input: { query: r.query } });
            const results = (0, searchKb_1.searchKb)(r.query);
            if (results.length === 0) {
                answerParts.push((0, t_1.t)(locale, "kb_none", { query: r.query }));
            }
            else {
                // Cite sources
                for (const s of results) {
                    sources.push({ type: "kb", kbId: s.id, title: s.title, url: s.url });
                }
                // Summarize best match
                const top = results[0];
                answerParts.push(`KB: ${top.title} — ${top.body} (Link: ${top.url})`);
            }
        }
        if (r.kind === "draft_email") {
            actions.push({
                type: "tool_call",
                tool: "draftFollowupEmail",
                input: { dealId: r.dealId, intent: r.intent }
            });
            const draft = (0, draftFollowupEmail_1.draftFollowupEmail)(r.dealId, r.intent);
            actions.push({
                type: "draft_email",
                dealId: r.dealId,
                intent: r.intent,
                subject: draft.subject,
                body: draft.body,
                to: draft.to
            });
            sources.push({ type: "deal", dealId: r.dealId });
            answerParts.push(`Draft prepared (not sent). Subject: "${draft.subject}". Recipient: ${draft.to}.`);
        }
    }
    const answer = answerParts.join("\n\n");
    // Guardrail: ensure we never imply sending.
    (0, guardrails_1.enforceDraftOnly)(answer);
    // De-dupe sources (simple stable de-dupe)
    const uniqueSources = [];
    const seen = new Set();
    for (const s of sources) {
        const key = s.type === "deal" ? `deal:${s.dealId}` : `kb:${s.kbId}:${s.url}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueSources.push(s);
        }
    }
    return {
        answer,
        sources_used: uniqueSources,
        actions
    };
}
