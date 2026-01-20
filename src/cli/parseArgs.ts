import { AppError } from "../utils/errors";

export function parsePromptFromArgs(argv: string[]): string {
  // Expected: node dist/index.js "question..."
  const prompt = argv.slice(2).join(" ").trim();
  if (!prompt) throw new AppError("BAD_REQUEST", "Missing prompt. Example: npm start -- \"...\"");
  return prompt;
}