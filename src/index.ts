import { parsePromptFromArgs } from "./cli/parseArgs";
import { runAgent } from "./core/agent";
import { AgentOutputSchema } from "./core/schemas";
import { formatError } from "./utils/errors";

function main() {
  try {
    const prompt = parsePromptFromArgs(process.argv);
    const output = runAgent(prompt, "en");

    // Validate output structure (important for interview)
    AgentOutputSchema.parse(output);

    console.log(JSON.stringify(output, null, 2));
  } catch (err) {
    const errorPayload = formatError(err);
    console.error(JSON.stringify(errorPayload, null, 2));
    process.exit(1);
  }
}

main();
