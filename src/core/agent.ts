import type { AgentOutput } from "./types";
import { runAgentWithOpenAI } from "./llm";
import { runAgent as runDeterministicAgent } from "./agent_deterministic";

/**
 * Main agent entrypoint:
 * - If OPENAI_API_KEY is present => use OpenAI tool-calling agent
 * - Otherwise => fall back to deterministic/router-based agent (useful for reviewers)
 */
export async function runAgent(prompt: string, locale: "en" = "en"): Promise<AgentOutput> {
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());

  if (hasOpenAIKey) {
    return await runAgentWithOpenAI(prompt);
  }

  return runDeterministicAgent(prompt, locale);
}