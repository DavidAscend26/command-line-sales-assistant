import { routePrompt } from "../src/core/router";

test("routes SOC2 question to kb", () => {
  const routes = routePrompt("Do we have SOC2 and where is it?");
  expect(routes[0].kind).toBe("kb");
});

test("routes deal status question to deal_status", () => {
  const routes = routePrompt("What's the status of deal D-103?");
  expect(routes.some(r => r.kind === "deal_status")).toBe(true);
});

test("routes draft follow-up to draft_email", () => {
  const routes = routePrompt("Draft a follow-up asking for security review timeline on D-103.");
  expect(routes[0].kind).toBe("draft_email");
});