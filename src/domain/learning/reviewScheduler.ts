export function nextReviewDate(verdict: "correct" | "partial" | "incorrect", now = new Date()) {
  const milliseconds =
    verdict === "correct"
      ? 7 * 24 * 60 * 60 * 1000
      : verdict === "partial"
        ? 24 * 60 * 60 * 1000
        : 10 * 60 * 1000;
  return new Date(now.getTime() + milliseconds).toISOString();
}

