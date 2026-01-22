"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOutputSchema = exports.SourceUsedSchema = exports.DraftEmailActionSchema = exports.ToolCallActionSchema = exports.ToolNameSchema = exports.QuerySchema = exports.IntentSchema = exports.DealIdSchema = void 0;
const zod_1 = require("zod");
exports.DealIdSchema = zod_1.z.enum(["D-103", "D-221"]);
exports.IntentSchema = zod_1.z.string().min(1);
exports.QuerySchema = zod_1.z.string().min(1);
// Centralize tool names to avoid drift
exports.ToolNameSchema = zod_1.z.enum([
    "getDeal",
    "getOpenDeals",
    "searchKb",
    "draftFollowupEmail"
]);
exports.ToolCallActionSchema = zod_1.z.object({
    type: zod_1.z.literal("tool_call"),
    tool: exports.ToolNameSchema,
    input: zod_1.z.record(zod_1.z.unknown())
});
exports.DraftEmailActionSchema = zod_1.z.object({
    type: zod_1.z.literal("draft_email"),
    dealId: exports.DealIdSchema,
    intent: zod_1.z.string().min(1),
    subject: zod_1.z.string().min(1),
    body: zod_1.z.string().min(1),
    to: zod_1.z.string().min(1),
    cc: zod_1.z.array(zod_1.z.string()).optional()
});
exports.SourceUsedSchema = zod_1.z.union([
    zod_1.z.object({ type: zod_1.z.literal("deal"), dealId: exports.DealIdSchema }),
    zod_1.z.object({
        type: zod_1.z.literal("kb"),
        kbId: zod_1.z.string(),
        title: zod_1.z.string(),
        url: zod_1.z.string()
    })
]);
exports.AgentOutputSchema = zod_1.z.object({
    answer: zod_1.z.string(),
    sources_used: zod_1.z.array(exports.SourceUsedSchema),
    actions: zod_1.z.array(zod_1.z.union([exports.ToolCallActionSchema, exports.DraftEmailActionSchema]))
});
