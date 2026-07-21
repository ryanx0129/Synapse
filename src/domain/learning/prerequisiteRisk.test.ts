import { machineLearningPreset } from "@/data/presets";
import type { LearnerConceptState } from "@/domain/graph/graphSchema";
import { statusFromMastery } from "./mastery";
import { computePrerequisiteRisk } from "./prerequisiteRisk";
import { buildRepairPath } from "./repairPath";

const states = Object.fromEntries(
  machineLearningPreset.nodes.map((node) => [
    node.id,
    {
      conceptId: node.id,
      masteryProbability: node.initialMastery,
      status: statusFromMastery(node.initialMastery),
      attempts: 0,
      correctAttempts: 0,
      updatedAt: "2026-07-21T00:00:00.000Z",
    } satisfies LearnerConceptState,
  ]),
);

describe("prerequisite diagnosis", () => {
  it("raises downstream risk when an upstream prerequisite weakens", () => {
    const baseline = computePrerequisiteRisk(machineLearningPreset, states).find(
      (risk) => risk.conceptId === "ml-backpropagation",
    )!;
    const weak = {
      ...states,
      "ml-chain-rule": { ...states["ml-chain-rule"]!, masteryProbability: 0.02, status: "gap" as const },
    };
    const changed = computePrerequisiteRisk(machineLearningPreset, weak).find(
      (risk) => risk.conceptId === "ml-backpropagation",
    )!;
    expect(changed.prerequisiteContribution).toBeGreaterThan(baseline.prerequisiteContribution);
  });

  it("returns only valid prerequisite-connected repair steps", () => {
    const path = buildRepairPath(machineLearningPreset, "ml-vanishing-gradients", states);
    expect(path.length).toBeGreaterThan(0);
    expect(path.length).toBeLessThanOrEqual(5);
    expect(path.every((step) => machineLearningPreset.nodes.some((node) => node.id === step.conceptId))).toBe(true);
    expect(path.some((step) => step.conceptId === "ml-chain-rule")).toBe(true);
  });
});

