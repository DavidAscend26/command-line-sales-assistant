import { z } from "zod";

export const DealIdSchema = z.enum(["D-103", "D-221"]);

export const IntentSchema = z.string().min(1);

export const QuerySchema = z.string().min(1);

export const AgentOutputSchema = z.object({
  answer: z.string(),
  sources_used: z.array(
    z.union([
      z.object({ type: z.literal("deal"), dealId: DealIdSchema }),
      z.object({
        type: z.literal("kb"),
        kbId: z.string(),
        title: z.string(),
        url: z.string()
      })
    ])
  ),
  actions: z.array(
    z.union([
      z.object({
        type: z.literal("tool_call"),
        tool: z.enum(["getDeal", "searchKb", "draftFollowupEmail"]),
        input: z.record(z.unknown())
      }),
      z.object({
        type: z.literal("draft_email"),
        dealId: DealIdSchema,
        intent: z.string(),
        subject: z.string(),
        body: z.string(),
        to: z.string(),
        cc: z.array(z.string()).optional()
      })
    ])
  )
});