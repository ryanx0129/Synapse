import { machineLearningPreset } from "@/data/presets";
import { scoreAnswer } from "./answerScorer";

const backprop = machineLearningPreset.nodes.find((node) => node.id === "ml-backpropagation")!;

describe("deterministic answer scoring", () => {
  it("accepts a conceptual paraphrase", () => {
    const result = scoreAnswer(
      backprop,
      "The chain rule composes local derivatives backward through every layer to calculate gradients for the weights.",
    );
    expect(result.verdict).toBe("correct");
    expect(result.missingConcepts).toHaveLength(0);
  });

  it("identifies partial understanding", () => {
    const result = scoreAnswer(backprop, "It uses the chain rule to get a gradient.");
    expect(result.verdict).toBe("partial");
    expect(result.missingConcepts.length).toBeGreaterThan(0);
  });

  it("rejects irrelevant answers", () => {
    expect(scoreAnswer(backprop, "Neural networks are popular computer programs.").verdict).toBe("incorrect");
  });

  it("rejects keyword stuffing with a contradiction", () => {
    const result = scoreAnswer(
      backprop,
      "Chain rule, local derivatives, layers, gradient—but backpropagation does not use the chain rule.",
    );
    expect(result.verdict).toBe("incorrect");
    expect(result.misconceptions.length).toBeGreaterThan(0);
  });
});

