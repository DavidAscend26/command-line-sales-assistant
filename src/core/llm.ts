import OpenAI from "openai";
import { getDeal } from "../tools/getDeal";
import { getOpenDeals } from "../tools/getOpenDeals"; // ✅ plural + ruta correcta
import { searchKb } from "../tools/searchKb";
import { draftFollowupEmail } from "../tools/draftFollowupEmail";
import type { Action, AgentOutput, SourceUsed } from "./types";
import { enforceDraftOnly } from "./guardrails";
//import type { Tool } from "openai/resources/responses";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type LegacyTool = {
  type: "function";
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

/**
 * Tool definitions for OpenAI function calling.
 * Note: Keep the schemas simple and strict.
 */
const tools: LegacyTool[] = [
  {
    type: "function",
    name: "getDeal",
    description: "Fetch a single deal by dealId from the CRM.",
    parameters: {
      type: "object",
      properties: {
        dealId: { type: "string", enum: ["D-103", "D-221"] }
      },
      required: ["dealId"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    name: "getOpenDeals",
    description: "List all open deals (not Closed Won/Lost).",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  },
  {
    type: "function",
    name: "searchKb",
    description: "Search internal KB snippets for policy/security/pricing answers.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" }
      },
      required: ["query"],
      additionalProperties: false
    }
  },
  {
    type: "function",
    name: "draftFollowupEmail",
    description: "Create an email draft (NEVER send).",
    parameters: {
      type: "object",
      properties: {
        dealId: { type: "string", enum: ["D-103", "D-221"] },
        intent: { type: "string" }
      },
      required: ["dealId", "intent"],
      additionalProperties: false
    }
  }
];


type ToolCall = {
  id: string;
  type: "function_call";
  name: string;
  arguments: string;
};

function safeJsonParse<T>(s: string): T {
  return JSON.parse(s) as T;
}

export async function runAgentWithOpenAI(userPrompt: string): Promise<AgentOutput> {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.trim()) {
    throw new Error("Missing OPENAI_API_KEY in environment.");
  }

  const system = [
    "You are a sales CLI agent.",
    "You MUST use the provided tools to answer when needed.",
    "You must output a final response in JSON with keys: answer, sources_used, actions.",
    "Guardrail: NEVER claim that you sent an email. Only drafts are allowed.",
    "If drafting, explicitly say 'Draft prepared (not sent)'.",
    "Do not invent deal IDs or KB links."
  ].join("\n");

  // We keep our own actions/sources log (server-side truth)
  const actions: Action[] = [];
  const sources: SourceUsed[] = [];

  // 1) First model call (may request tool calls)
  // ✅ Keep response as the normal (non-streaming) response object
  let response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
        { role: "system", content: system },
        { role: "user", content: userPrompt }
    ],
    tools: tools as any
  });



  // 2) Tool loop: execute until the model stops requesting tools
  while (true) {
    // Responses API returns "output" items; tool calls show up as type === "function_call"
    const toolCalls: ToolCall[] = (response.output ?? []).flatMap((item: any) => {
        if (item.type === "function_call") {
            return [
            {
                id: item.call_id ?? item.id ?? crypto.randomUUID(),
                type: "function_call",
                name: item.name,
                arguments: item.arguments ?? "{}"
            } as ToolCall
            ];
        }
        return [];
    });

    if (toolCalls.length === 0) break;

    const toolOutputs = toolCalls.map((call) => {
      const name = call.name;
      const args = safeJsonParse<any>(call.arguments || "{}");

      actions.push({
        type: "tool_call",
        tool: name as any,
        input: args
      });

      if (name === "getDeal") {
        const deal = getDeal(args.dealId);
        sources.push({ type: "deal", dealId: deal.id });
        return {
          type: "function_call_output",
          call_id: call.id,
          output: JSON.stringify(deal)
        };
      }

      if (name === "getOpenDeals") {
        const deals = getOpenDeals();
        deals.forEach((d) => sources.push({ type: "deal", dealId: d.id }));
        return {
          type: "function_call_output",
          call_id: call.id,
          output: JSON.stringify(deals)
        };
      }

      if (name === "searchKb") {
        const hits = searchKb(args.query);
        hits.forEach((k) =>
          sources.push({ type: "kb", kbId: k.id, title: k.title, url: k.url })
        );
        return {
          type: "function_call_output",
          call_id: call.id,
          output: JSON.stringify(hits)
        };
      }

      if (name === "draftFollowupEmail") {
        const draft = draftFollowupEmail(args.dealId, args.intent);

        // Log it as an action too
        actions.push({
          type: "draft_email",
          dealId: args.dealId,
          intent: args.intent,
          subject: draft.subject,
          body: draft.body,
          to: draft.to
        });

        sources.push({ type: "deal", dealId: args.dealId });

        return {
          type: "function_call_output",
          call_id: call.id,
          output: JSON.stringify({
            ...draft,
            note: "Draft only. Not sent."
          })
        };
      }

      return {
        type: "function_call_output",
        call_id: call.id,
        output: JSON.stringify({ error: `Unknown tool: ${name}` })
      };
    });

    // ✅ second call continues the same thread via previous_response_id
    // Some SDK versions don't type previous_response_id nicely, so keep the cast.
    response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: toolOutputs,
      previous_response_id: response.id
    } as any);
  }

  // 3) Extract final text from the model
  const finalText =
    (response.output ?? [])
      .filter((x: any) => x.type === "message")
      .flatMap((m: any) => m.content ?? [])
      .map((c: any) => c.text ?? "")
      .join("")
      .trim();

  // Expect the model to output JSON. If it returns plain text, wrap it.
  let parsed: any;
  try {
    parsed = JSON.parse(finalText);
  } catch {
    parsed = { answer: finalText, sources_used: [], actions: [] };
  }

  // 4) Overwrite sources/actions with server-truth logs
  const output: AgentOutput = {
    answer: String(parsed.answer ?? finalText),
    sources_used: dedupeSources(sources),
    actions
  };

  // 5) Guardrail: never imply sending
  enforceDraftOnly(output.answer);

  return output;
}

function dedupeSources(sources: SourceUsed[]): SourceUsed[] {
  const seen = new Set<string>();
  const out: SourceUsed[] = [];
  for (const s of sources) {
    const key = s.type === "deal" ? `deal:${s.dealId}` : `kb:${s.kbId}:${s.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}