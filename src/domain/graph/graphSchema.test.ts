import presetJson from "@seed/machineLearningPreset.json";
import { knowledgeGraphSchema } from "./graphSchema";
import { normalizeGraph, validateGraph } from "./normalizeGraph";

describe("canonical graph validation", () => {
  it("normalizes and validates the 20-concept preset", () => {
    const graph = normalizeGraph(presetJson);
    expect(graph.nodes).toHaveLength(20);
    expect(graph.nodes.every((node) => node.sourceSpans.length > 0)).toBe(true);
    expect(graph.nodes.every((node) => graph.clusters.some((cluster) => cluster.id === node.cluster))).toBe(true);
    expect(knowledgeGraphSchema.parse(graph)).toEqual(graph);
  });

  it("rejects dangling canonical links", () => {
    const graph = normalizeGraph(presetJson);
    const invalid = {
      ...graph,
      links: [{ ...graph.links[0]!, target: "missing-node" }, ...graph.links.slice(1)],
    };
    const result = validateGraph(invalid);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.message.includes("Dangling"))).toBe(true);
  });

  it("removes dangling model links during normalization", () => {
    const raw = structuredClone(presetJson);
    raw.links.push({ ...raw.links[0]!, id: "bad-link", target: "not-real" });
    const graph = normalizeGraph(raw);
    expect(graph.links.some((link) => link.id === "bad-link")).toBe(false);
    expect(graph.warnings.some((warning) => warning.includes("Removed invalid relationship"))).toBe(true);
  });
});

