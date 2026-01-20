import { runAgent } from "../src/core/agent";

test("agent outputs structured JSON for SOC2", () => {
  const out = runAgent("Do we have SOC2 and where is it?");
  expect(out.answer).toContain("SOC");
  expect(out.sources_used.length).toBeGreaterThan(0);
  expect(out.actions.some(a => a.type === "tool_call" && a.tool === "searchKb")).toBe(true);
});

test("agent outputs draft action and never claims sending", () => {
  const out = runAgent("Draft a follow-up asking for security review timeline on D-103.");
  expect(out.actions.some(a => a.type === "draft_email")).toBe(true);
  expect(out.answer.toLowerCase()).toContain("not sent");
});