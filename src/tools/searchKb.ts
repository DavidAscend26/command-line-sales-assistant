import { KB } from "../data/hardcoded";
import type { KbSnippet } from "../core/types";

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

export function searchKb(query: string): KbSnippet[] {
  const q = normalize(query);
  if (!q) return [];

  // Simple keyword match across title/body/tags.
  return KB.map((snip) => {
    const hay = normalize(`${snip.title} ${snip.body} ${snip.tags.join(" ")}`);
    const score = q.split(" ").reduce((acc, token) => acc + (hay.includes(token) ? 1 : 0), 0);
    return { snip, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.snip)
    .slice(0, 4);
}