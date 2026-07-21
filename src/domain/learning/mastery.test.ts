import { statusFromMastery, updateMastery } from "./mastery";

describe("Bayesian-style mastery", () => {
  it("increases mastery for strong correct evidence", () => {
    expect(updateMastery(0.28, 1)).toBeGreaterThan(0.8);
  });

  it("does not manufacture mastery from incorrect evidence", () => {
    expect(updateMastery(0.3, 0)).toBeLessThan(0.3);
  });

  it("interpolates partial evidence and keeps probabilities bounded", () => {
    const incorrect = updateMastery(0.45, 0);
    const partial = updateMastery(0.45, 0.55);
    const correct = updateMastery(0.45, 1);
    expect(partial).toBeGreaterThan(incorrect);
    expect(partial).toBeLessThan(correct);
    expect(updateMastery(0, 0)).toBeGreaterThanOrEqual(0.02);
    expect(updateMastery(1, 1)).toBeLessThanOrEqual(0.98);
  });

  it("derives semantic thresholds", () => {
    expect(statusFromMastery(0.39)).toBe("gap");
    expect(statusFromMastery(0.4)).toBe("review");
    expect(statusFromMastery(0.79)).toBe("review");
    expect(statusFromMastery(0.8)).toBe("mastered");
  });
});

