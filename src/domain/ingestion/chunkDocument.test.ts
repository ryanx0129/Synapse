import { chunkPages, chunkPlainText } from "./chunkDocument";
import { createFallbackGraph } from "./fallbackGraph";

describe("document ingestion", () => {
  it("preserves page numbers and stable source ids", () => {
    const chunks = chunkPages("doc-1", [
      { page: 1, text: "# Foundations\n" + "A concept sentence. ".repeat(100) },
      { page: 2, text: "A second page explains a dependent idea in detail." },
    ]);
    expect(chunks.some((chunk) => chunk.page === 1)).toBe(true);
    expect(chunks.some((chunk) => chunk.page === 2)).toBe(true);
    expect(new Set(chunks.map((chunk) => chunk.id)).size).toBe(chunks.length);
  });

  it("creates a validated source-grounded graph locally", () => {
    const chunks = chunkPlainText(
      "hash-1",
      "# Gradient Descent\nGradient descent follows the negative gradient to reduce a loss. It uses a learning rate to control the step. The learning rate must balance speed and stability. Validation data then supports model selection.",
    );
    const graph = createFallbackGraph({ document: { id: "hash-1", title: "Optimization notes" }, chunks });
    expect(graph.nodes.length).toBeGreaterThanOrEqual(3);
    expect(graph.nodes.every((node) => node.sourceSpans[0]?.page === 1)).toBe(true);
  });
});

