"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const parseArgs_1 = require("./cli/parseArgs");
const agent_1 = require("./core/agent");
const schemas_1 = require("./core/schemas");
const errors_1 = require("./utils/errors");
async function main() {
    try {
        const prompt = (0, parseArgs_1.parsePromptFromArgs)(process.argv);
        const output = await (0, agent_1.runAgent)(prompt, "en");
        schemas_1.AgentOutputSchema.parse(output);
        console.log(JSON.stringify(output, null, 2));
    }
    catch (err) {
        console.error(JSON.stringify((0, errors_1.formatError)(err), null, 2));
        process.exit(1);
    }
}
void main();
