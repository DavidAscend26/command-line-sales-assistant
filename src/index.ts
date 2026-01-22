import "dotenv/config";
import { parsePromptFromArgs } from "./cli/parseArgs";
import { runAgent } from "./core/agent";
import { AgentOutputSchema } from "./core/schemas";
import { formatError } from "./utils/errors";

async function main() {
  try {
    const prompt = parsePromptFromArgs(process.argv);
    const output = await runAgent(prompt, "en");

    AgentOutputSchema.parse(output);
    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    console.error(JSON.stringify(formatError(err), null, 2));
    process.exit(1);
  }
}

void main();