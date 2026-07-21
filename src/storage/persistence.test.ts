import { learnerConceptStateSchema } from "@/domain/graph/graphSchema";

describe("persistence serialization", () => {
  it("round-trips a learner state through JSON and boundary validation", () => {
    const state = {
      conceptId: "ml-chain-rule",
      masteryProbability: 0.73,
      status: "review" as const,
      attempts: 2,
      correctAttempts: 1,
      updatedAt: "2026-07-21T00:00:00.000Z",
    };
    expect(learnerConceptStateSchema.parse(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });
});

