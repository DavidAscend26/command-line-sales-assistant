# Cyrus-style CLI Agent (TypeScript)

A tiny command-line sales assistant that answers questions by calling mock tools over hardcoded data.

## Requirements implemented
- CLI command: `npm start -- "..."` (after build)
- Mock tools:
  - `getDeal(dealId)`
  - `getOpenDeals(Deal)`
  - `searchKb(query)`
  - `draftFollowupEmail(dealId, intent)` (draft only)
- Structured JSON output:
  - `answer`, `sources_used`, `actions`
- Guardrail: never claims it “sent” anything (draft-only)
- Hardcoded data:
  - 2 deals: D-103, D-221
  - 5–8 KB snippets including SOC2, pricing policy, security FAQ
- Tests + Docker

IMPORTANT!!!
Rename the .env.example file to .env and place your OpenAI key there.

## Quickstart
```bash
npm install
npm run build
npm start -- "<your questions goes here>"
```

Some of the questions you could ask are:
- "Do we have SOC2 and where is it?"
- "What’s the status of deal D-103 and what should I do next?"
- "What’s our pricing exception policy?"
- "Draft a follow-up asking for security review timeline on D-103."
- "Send an email to the customer for D-103 confirming we sent the follow-up."
- "List my open deals"