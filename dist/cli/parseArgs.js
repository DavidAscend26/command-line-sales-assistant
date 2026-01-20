"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePromptFromArgs = parsePromptFromArgs;
const errors_1 = require("../utils/errors");
function parsePromptFromArgs(argv) {
    // Expected: node dist/index.js "question..."
    const prompt = argv.slice(2).join(" ").trim();
    if (!prompt)
        throw new errors_1.AppError("BAD_REQUEST", "Missing prompt. Example: npm start -- \"...\"");
    return prompt;
}
