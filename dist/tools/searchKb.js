"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKb = searchKb;
const hardcoded_1 = require("../data/hardcoded");
function normalize(s) {
    return s.toLowerCase().replace(/\s+/g, " ").trim();
}
function searchKb(query) {
    const q = normalize(query);
    if (!q)
        return [];
    // Simple keyword match across title/body/tags.
    return hardcoded_1.KB.map((snip) => {
        const hay = normalize(`${snip.title} ${snip.body} ${snip.tags.join(" ")}`);
        const score = q.split(" ").reduce((acc, token) => acc + (hay.includes(token) ? 1 : 0), 0);
        return { snip, score };
    })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.snip)
        .slice(0, 4);
}
