import type { ExtractGraphRequest, KnowledgeGraph, SourceChunk } from "@/domain/graph/graphSchema";
import { normalizeGraph } from "@/domain/graph/normalizeGraph";

const cleanMarkdown = (text: string) =>
  text
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/[#*_>`~()]/gu, " ")
    .replaceAll("[", " ")
    .replaceAll("]", " ")
    .replace(/\s+/gu, " ")
    .trim();

const titleFrom = (chunk: SourceChunk, index: number) => {
  if (chunk.section) return chunk.section.slice(0, 60);
  const firstSentence = cleanMarkdown(chunk.text).split(/[.!?]/u)[0] ?? "";
  const words = firstSentence.split(" ").filter(Boolean).slice(0, 5);
  return words.length >= 2 ? words.join(" ") : `Concept ${index + 1}`;
};

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 48);

function expandChunks(chunks: SourceChunk[], target: number) {
  const expanded: SourceChunk[] = [];
  for (const chunk of chunks) {
    const sentences = cleanMarkdown(chunk.text)
      .split(/(?<=[.!?])\s+/u)
      .filter((sentence) => sentence.length >= 35);
    if (sentences.length <= 1) {
      expanded.push(chunk);
      continue;
    }
    sentences.forEach((sentence, index) => {
      if (expanded.length >= target) return;
      expanded.push({
        ...chunk,
        id: `${chunk.id}-s${index}`,
        section: index === 0 ? (chunk.section ?? "") : "",
        text: sentence,
      });
    });
  }
  return expanded.length >= 3 ? expanded : chunks;
}

export function createFallbackGraph(request: ExtractGraphRequest): KnowledgeGraph {
  const target = Math.min(18, Math.max(3, request.options?.targetConceptCount ?? 12));
  const candidates = expandChunks(request.chunks, target).slice(0, target);
  const clusters = [
    { id: "foundations", label: "Foundations", description: "Core ideas extracted from the source." },
    { id: "connections", label: "Connections", description: "Later ideas and their dependencies." },
  ];
  const usedIds = new Set<string>();
  const nodes = candidates.map((chunk, index) => {
    const rawTitle = titleFrom(chunk, index);
    const baseId = slug(rawTitle) || `concept-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
    usedIds.add(id);
    const summary = cleanMarkdown(chunk.text).slice(0, 300);
    const importantWords = rawTitle
      .toLowerCase()
      .split(/\s+/u)
      .filter((word) => word.length > 3)
      .slice(0, 3);
    return {
      id,
      label: rawTitle,
      shortLabel: rawTitle.slice(0, 28),
      cluster: index < Math.ceil(candidates.length / 2) ? "foundations" : "connections",
      summary,
      difficulty: Math.min(0.85, 0.35 + index * 0.035),
      importance: Math.max(0.55, 0.9 - index * 0.02),
      initialMastery: 0.3,
      sourceSpans: [
        {
          sourceId: chunk.id,
          page: chunk.page,
          ...(chunk.section ? { section: chunk.section } : {}),
          quote: chunk.text.slice(0, 240),
          ...(chunk.charStart === undefined ? {} : { startOffset: chunk.charStart }),
          ...(chunk.charEnd === undefined ? {} : { endOffset: chunk.charEnd }),
        },
      ],
      question: `Using the source, explain the central idea of “${rawTitle}”.`,
      rubric: {
        requiredConcepts: importantWords.length > 0 ? importantWords : [rawTitle.toLowerCase()],
        optionalConcepts: [],
        misconceptions: ["the source says the opposite"],
        acceptedKeywords: importantWords,
        referenceAnswer: summary,
      },
      tags: ["locally-extracted"],
    };
  });
  const links = nodes.slice(0, -1).map((node, index) => ({
    id: `fallback-link-${index + 1}`,
    source: node.id,
    target: nodes[index + 1]?.id ?? node.id,
    type: "prerequisite" as const,
    label: "precedes in source",
    explanation: "The source introduces this idea before the next concept; verify the dependency during study.",
    confidence: 0.58,
    prerequisiteWeight: 0.45,
    affectsMasteryPropagation: true,
    sourceSpans: node.sourceSpans,
  }));
  return normalizeGraph({
    schemaVersion: "1.0",
    id: `fallback-${request.document.id}`,
    title: request.document.title,
    description: "A deterministic source-grounded graph generated locally while AI was unavailable or intentionally bypassed.",
    domain: request.document.domainHint ?? "Uploaded material",
    createdAt: new Date().toISOString(),
    documentId: request.document.id,
    clusters,
    nodes,
    links,
    warnings: [
      "Deterministic extraction was used. Concept relationships are conservative and should be reviewed against the source.",
    ],
  });
}
