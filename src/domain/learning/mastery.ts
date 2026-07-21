import type { ConceptStatus } from "@/domain/graph/graphSchema";

export interface MasteryParameters {
  slip: number;
  guess: number;
  transition: number;
}

export const defaultMasteryParameters: MasteryParameters = {
  slip: 0.1,
  guess: 0.08,
  transition: 0.08,
};

const clamp = (value: number, minimum = 0.02, maximum = 0.98) =>
  Math.min(maximum, Math.max(minimum, value));

const posterior = (
  prior: number,
  correct: boolean,
  { slip, guess }: MasteryParameters,
) => {
  const numerator = correct ? prior * (1 - slip) : prior * slip;
  const denominator = correct
    ? numerator + (1 - prior) * guess
    : numerator + (1 - prior) * (1 - guess);
  return denominator === 0 ? prior : numerator / denominator;
};

export function updateMastery(
  prior: number,
  score: number,
  parameters: MasteryParameters = defaultMasteryParameters,
) {
  const boundedPrior = clamp(prior);
  const boundedScore = Math.min(1, Math.max(0, score));
  const correctEvidence = posterior(boundedPrior, true, parameters);
  const incorrectEvidence = posterior(boundedPrior, false, parameters);
  const interpolated = incorrectEvidence + (correctEvidence - incorrectEvidence) * boundedScore;
  return clamp(interpolated + (1 - interpolated) * parameters.transition);
}

export function statusFromMastery(probability: number): ConceptStatus {
  if (probability < 0.4) return "gap";
  if (probability < 0.8) return "review";
  return "mastered";
}
