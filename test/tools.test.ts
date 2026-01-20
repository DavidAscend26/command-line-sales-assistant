import { getDeal } from "../src/tools/getDeal";
import { searchKb } from "../src/tools/searchKb";
import { draftFollowupEmail } from "../src/tools/draftFollowupEmail";

test("getDeal returns D-103", () => {
  const deal = getDeal("D-103");
  expect(deal.id).toBe("D-103");
  expect(deal.stage).toBeDefined();
});

test("searchKb finds SOC2", () => {
  const results = searchKb("SOC2");
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].title.toLowerCase()).toContain("soc");
});

test("draftFollowupEmail returns draft-only content", () => {
  const draft = draftFollowupEmail("D-103", "ask_security_review_timeline");
  expect(draft.subject.length).toBeGreaterThan(3);
  expect(draft.body.toLowerCase()).toContain("security");
});