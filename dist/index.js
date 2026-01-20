"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseArgs_1 = require("./cli/parseArgs");
const agent_1 = require("./core/agent");
const schemas_1 = require("./core/schemas");
const errors_1 = require("./utils/errors");
function main() {
    try {
        const prompt = (0, parseArgs_1.parsePromptFromArgs)(process.argv);
        const output = (0, agent_1.runAgent)(prompt, "en");
        // Validate output structure (important for interview)
        schemas_1.AgentOutputSchema.parse(output);
        console.log(JSON.stringify(output, null, 2));
    }
    catch (err) {
        const errorPayload = (0, errors_1.formatError)(err);
        console.error(JSON.stringify(errorPayload, null, 2));
        process.exit(1);
    }
}
main();
