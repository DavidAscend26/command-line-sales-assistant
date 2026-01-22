"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const llm_1 = require("./llm");
const agent_deterministic_1 = require("./agent_deterministic");
/**
 * Main agent entrypoint:
 * - If OPENAI_API_KEY is present => use OpenAI tool-calling agent
 * - Otherwise => fall back to deterministic/router-based agent (useful for reviewers)
 */
async function runAgent(prompt, locale = "en") {
    const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
    if (hasOpenAIKey) {
        return await (0, llm_1.runAgentWithOpenAI)(prompt);
    }
    return (0, agent_deterministic_1.runAgent)(prompt, locale);
}
