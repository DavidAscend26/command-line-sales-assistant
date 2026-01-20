# Cyrus-style CLI Agent (TypeScript)

A tiny command-line sales assistant that answers questions by calling mock tools over hardcoded data.

## Requirements implemented
- CLI command: `npm start -- "..."` (after build)
- Mock tools:
  - `getDeal(dealId)`
  - `searchKb(query)`
  - `draftFollowupEmail(dealId, intent)` (draft only)
- Structured JSON output:
  - `answer`, `sources_used`, `actions`
- Guardrail: never claims it “sent” anything (draft-only)
- Hardcoded data:
  - 2 deals: D-103, D-221
  - 5–8 KB snippets including SOC2, pricing policy, security FAQ
- Tests + Docker

## Quickstart
```bash
npm install
npm run build
npm start -- "What’s the status of deal D-103 and what should I do next?"