import { z } from "zod";

export const DealIdSchema = z.enum(["D-103", "D-221"]);

export const IntentSchema = z.string().min(1);

export const QuerySchema = z.string().min(1);

// Centralize tool names to avoid drift
export const ToolNameSchema = z.enum([
  "getDeal",
  "getOpenDeals",
  "searchKb",
  "draftFollowupEmail"
]);

export const ToolCallActionSchema = z.object({
  type: z.literal("tool_call"),
  tool: ToolNameSchema,
  input: z.record(z.unknown())
});

export const DraftEmailActionSchema = z.object({
  type: z.literal("draft_email"),
  dealId: DealIdSchema,
  intent: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
  to: z.string().min(1),
  cc: z.array(z.string()).optional()
});

export const SourceUsedSchema = z.union([
  z.object({ type: z.literal("deal"), dealId: DealIdSchema }),
  z.object({
    type: z.literal("kb"),
    kbId: z.string(),
    title: z.string(),
    url: z.string()
  })
]);

export const AgentOutputSchema = z.object({
  answer: z.string(),
  sources_used: z.array(SourceUsedSchema),
  actions: z.array(z.union([ToolCallActionSchema, DraftEmailActionSchema]))
});