"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOutputSchema = exports.QuerySchema = exports.IntentSchema = exports.DealIdSchema = void 0;
const zod_1 = require("zod");
exports.DealIdSchema = zod_1.z.enum(["D-103", "D-221"]);
exports.IntentSchema = zod_1.z.string().min(1);
exports.QuerySchema = zod_1.z.string().min(1);
exports.AgentOutputSchema = zod_1.z.object({
    answer: zod_1.z.string(),
    sources_used: zod_1.z.array(zod_1.z.union([
        zod_1.z.object({ type: zod_1.z.literal("deal"), dealId: exports.DealIdSchema }),
        zod_1.z.object({
            type: zod_1.z.literal("kb"),
            kbId: zod_1.z.string(),
            title: zod_1.z.string(),
            url: zod_1.z.string()
        })
    ])),
    actions: zod_1.z.array(zod_1.z.union([
        zod_1.z.object({
            type: zod_1.z.literal("tool_call"),
            tool: zod_1.z.enum(["getDeal", "searchKb", "draftFollowupEmail"]),
            input: zod_1.z.record(zod_1.z.unknown())
        }),
        zod_1.z.object({
            type: zod_1.z.literal("draft_email"),
            dealId: exports.DealIdSchema,
            intent: zod_1.z.string(),
            subject: zod_1.z.string(),
            body: zod_1.z.string(),
            to: zod_1.z.string(),
            cc: zod_1.z.array(zod_1.z.string()).optional()
        })
    ]))
});
