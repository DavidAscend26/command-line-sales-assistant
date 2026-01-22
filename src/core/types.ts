export type DealId = "D-103" | "D-221";

export type DealStage =
  | "Prospecting"
  | "Discovery"
  | "Security Review"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type Deal = {
  id: DealId;
  accountName: string;
  stage: DealStage;
  amountUsd: number;
  closeDate: string; // ISO date
  owner: string;
  primaryContact: { name: string; email: string };
  lastContactedAt: string; // ISO date
  blockers: string[];
  nextStep: string;
  notes: string[];
};

export type KbSnippet = {
  id: string;
  title: string;
  body: string;
  url: string;
  tags: string[];
};

export type ToolName = "getDeal" | "getOpenDeals" | "searchKb" | "draftFollowupEmail";

export type ToolCallAction = {
  type: "tool_call";
  tool: ToolName;
  input: Record<string, unknown>;
};

export type DraftEmailAction = {
  type: "draft_email";
  dealId: DealId;
  intent: string;
  subject: string;
  body: string;
  to: string;
  cc?: string[];
};

export type Action = ToolCallAction | DraftEmailAction;

export type SourceUsed =
  | { type: "deal"; dealId: DealId }
  | { type: "kb"; kbId: string; title: string; url: string };

export type AgentOutput = {
  answer: string;
  sources_used: SourceUsed[];
  actions: Action[];
};