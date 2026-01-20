import type { AgentOutput, SourceUsed, Action } from "./types";
import { routePrompt } from "./router";
import { getDeal } from "../tools/getDeal";
import { searchKb } from "../tools/searchKb";
import { draftFollowupEmail } from "../tools/draftFollowupEmail";
import { enforceDraftOnly } from "./guardrails";
import { t } from "../i18n/t";

export function runAgent(prompt: string, locale: "en" = "en"): AgentOutput {
  const routes = routePrompt(prompt);

  const sources: SourceUsed[] = [];
  const actions: Action[] = [];

  let answerParts: string[] = [];

  for (const r of routes) {
    if (r.kind === "unknown") {
      answerParts.push(t(locale, "unknown", { reason: r.reason }));
      continue;
    }

    if (r.kind === "deal_status") {
      actions.push({ type: "tool_call", tool: "getDeal", input: { dealId: r.dealId } });
      const deal = getDeal(r.dealId);
      sources.push({ type: "deal", dealId: deal.id });

      answerParts.push(
        `Deal ${deal.id} (${deal.accountName}) is currently in stage "${deal.stage}". ` +
          `Owner: ${deal.owner}. Amount: $${deal.amountUsd}. Close date: ${deal.closeDate}.`
      );

      if (deal.blockers.length > 0) {
        answerParts.push(`Blockers: ${deal.blockers.join("; ")}.`);
      }
      answerParts.push(`Suggested next step: ${deal.nextStep}`);
    }

    if (r.kind === "kb") {
      actions.push({ type: "tool_call", tool: "searchKb", input: { query: r.query } });
      const results = searchKb(r.query);

      if (results.length === 0) {
        answerParts.push(t(locale, "kb_none", { query: r.query }));
      } else {
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

      const draft = draftFollowupEmail(r.dealId, r.intent);
      actions.push({
        type: "draft_email",
        dealId: r.dealId,
        intent: r.intent,
        subject: draft.subject,
        body: draft.body,
        to: draft.to
      });

      sources.push({ type: "deal", dealId: r.dealId });

      answerParts.push(
        `Draft prepared (not sent). Subject: "${draft.subject}". Recipient: ${draft.to}.`
      );
    }
  }

  const answer = answerParts.join("\n\n");

  // Guardrail: ensure we never imply sending.
  enforceDraftOnly(answer);

  // De-dupe sources (simple stable de-dupe)
  const uniqueSources: SourceUsed[] = [];
  const seen = new Set<string>();
  for (const s of sources) {
    const key =
      s.type === "deal" ? `deal:${s.dealId}` : `kb:${s.kbId}:${s.url}`;
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