import type { ConceptNode, VerificationResult } from "@/domain/graph/graphSchema";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "or",
  "the",
  "through",
  "to",
  "with",
]);

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stem = (word: string) =>
  word
    .replace(/(ations|ation|ments|ment|ingly|edly)$/u, "")
    .replace(/(ing|ed|es|s)$/u, "");

const tokens = (value: string) =>
  normalize(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .map(stem);

const conceptCovered = (answerTokens: Set<string>, concept: string) => {
  const expected = tokens(concept);
  if (expected.length === 0) return false;
  const matches = expected.filter((token) => answerTokens.has(token)).length;
  return matches / expected.length >= (expected.length <= 2 ? 1 : 0.55);
};

const contradictionPatterns = [
  /does not (use|rely on|involve)/u,
  /is not (based on|the same as)/u,
  /without (derivatives?|gradients?)/u,
  /always (finds?|reaches?|guarantees?) the global/u,
  /directly changes? labels?/u,
];

export function scoreAnswer(concept: Pick<ConceptNode, "rubric">, learnerAnswer: string): VerificationResult {
  const normalizedAnswer = normalize(learnerAnswer);
  const answerTokens = new Set(tokens(learnerAnswer));
  const coveredConcepts = concept.rubric.requiredConcepts.filter((required) =>
    conceptCovered(answerTokens, required),
  );
  const missingConcepts = concept.rubric.requiredConcepts.filter(
    (required) => !coveredConcepts.includes(required),
  );
  const explicitMisconceptions = concept.rubric.misconceptions.filter((misconception) =>
    conceptCovered(answerTokens, misconception),
  );
  const contradiction = contradictionPatterns.some((pattern) => pattern.test(normalizedAnswer));
  const keywordCoverage = concept.rubric.acceptedKeywords.filter((keyword) =>
    conceptCovered(answerTokens, keyword),
  ).length;
  const keywordRatio =
    concept.rubric.acceptedKeywords.length === 0
      ? 0
      : keywordCoverage / concept.rubric.acceptedKeywords.length;
  const requiredRatio = coveredConcepts.length / concept.rubric.requiredConcepts.length;
  const tooShort = answerTokens.size < 3;
  let score = requiredRatio * 0.82 + keywordRatio * 0.18;
  const misconceptions = [...explicitMisconceptions];
  if (contradiction) {
    misconceptions.push("The response explicitly contradicts a core mechanism.");
    score = Math.min(score, 0.25);
  }
  if (tooShort) score = Math.min(score, 0.3);

  const verdict =
    score >= 0.78 && missingConcepts.length === 0 && misconceptions.length === 0
      ? "correct"
      : score >= 0.4 && misconceptions.length === 0
        ? "partial"
        : "incorrect";

  const feedback =
    verdict === "correct"
      ? `Strong retrieval. You connected ${coveredConcepts.join(" and ")}.`
      : verdict === "partial"
        ? `You covered ${coveredConcepts.join(", ") || "part of the mechanism"}, but still need ${missingConcepts.join(", ")}.`
        : misconceptions.length > 0
          ? "The response contains a contradiction. Revisit the direction and mechanism described in the source."
          : `This does not yet explain ${missingConcepts.join(", ")}.`;

  return {
    mode: "local",
    score: Math.round(score * 100) / 100,
    verdict,
    coveredConcepts,
    missingConcepts,
    misconceptions,
    feedback,
    ...(verdict === "correct"
      ? {}
      : { hint: `Focus on: ${missingConcepts[0] ?? concept.rubric.requiredConcepts[0]}.` }),
    confidence: contradiction || requiredRatio === 0 || requiredRatio === 1 ? 0.94 : 0.82,
  };
}
