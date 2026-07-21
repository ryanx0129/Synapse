import machineLearningPresetJson from "@seed/machineLearningPreset.json";
import { normalizeGraph } from "@/domain/graph/normalizeGraph";
import type { KnowledgeGraph } from "@/domain/graph/graphSchema";

export const machineLearningPreset = normalizeGraph(machineLearningPresetJson);

function createCompactPreset(
  id: string,
  title: string,
  domain: string,
  concepts: Array<[string, string, string]>,
): KnowledgeGraph {
  const sourceId = `${id}-source`;
  return normalizeGraph({
    schemaVersion: "1.0",
    id,
    title,
    description: `A compact curated ${domain} concept graph.`,
    domain,
    createdAt: "2026-07-21T00:00:00.000Z",
    clusters: [{ id: "core", label: "Core ideas", description: `Foundations of ${domain}.` }],
    nodes: concepts.map(([nodeId, label, summary], index) => ({
      id: nodeId,
      label,
      cluster: "core",
      summary,
      difficulty: 0.45 + index * 0.05,
      importance: 0.8,
      initialMastery: 0.35 + index * 0.08,
      sourceSpans: [{ sourceId, page: index + 1, section: "Curated preset", quote: summary }],
      question: `Explain ${label} and why it matters.`,
      rubric: {
        requiredConcepts: [label.toLowerCase(), summary.split(" ").slice(0, 4).join(" ")],
        optionalConcepts: [],
        misconceptions: [],
        acceptedKeywords: label.toLowerCase().split(" "),
        referenceAnswer: summary,
      },
      tags: [domain.toLowerCase()],
    })),
    links: concepts.slice(0, -1).map(([nodeId], index) => ({
      id: `${id}-link-${index}`,
      source: nodeId,
      target: concepts[index + 1]?.[0] ?? nodeId,
      type: "prerequisite",
      label: "supports",
      explanation: "This foundational idea supports the next concept.",
      confidence: 0.82,
      prerequisiteWeight: 0.7,
      affectsMasteryPropagation: true,
      sourceSpans: [],
    })),
    warnings: ["Compact curated preset."],
  });
}

export const neurosciencePreset = createCompactPreset(
  "preset-neuroscience",
  "Neuroscience Foundations",
  "Neuroscience",
  [
    ["neuron", "Neuron", "Neurons transmit information through electrical and chemical signals."],
    ["action-potential", "Action Potential", "Voltage-gated ion channels create a propagating membrane signal."],
    ["synapse", "Synaptic Transmission", "Neurotransmitters carry signals between cells across a synaptic cleft."],
    ["plasticity", "Synaptic Plasticity", "Activity-dependent synaptic change supports learning and memory."],
  ],
);

export const constitutionalLawPreset = createCompactPreset(
  "preset-constitutional-law",
  "Constitutional Law Foundations",
  "Constitutional Law",
  [
    ["judicial-review", "Judicial Review", "Courts assess whether government acts are consistent with the constitution."],
    ["separation-powers", "Separation of Powers", "Government authority is divided among branches with distinct functions."],
    ["federalism", "Federalism", "Constitutional authority is divided between national and state governments."],
    ["strict-scrutiny", "Strict Scrutiny", "Certain classifications require a compelling interest and narrow tailoring."],
  ],
);

export const presets = {
  "preset-machine-learning": machineLearningPreset,
  "preset-neuroscience": neurosciencePreset,
  "preset-constitutional-law": constitutionalLawPreset,
} as const;

