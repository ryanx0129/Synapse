import type {
  KnowledgeGraph,
  LearnerConceptState,
} from "@/domain/graph/graphSchema";

export interface RepairStep {
  conceptId: string;
  distance: number;
  score: number;
  reason: string;
}

export function buildRepairPath(
  graph: KnowledgeGraph,
  selectedConceptId: string,
  learnerStates: Record<string, LearnerConceptState>,
  maximumSteps = 5,
): RepairStep[] {
  const queue: Array<{ conceptId: string; distance: number; weight: number }> = [
    { conceptId: selectedConceptId, distance: 0, weight: 1 },
  ];
  const seen = new Set([selectedConceptId]);
  const candidates: RepairStep[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const incoming = graph.links.filter(
      (link) =>
        link.target === current.conceptId &&
        link.type === "prerequisite" &&
        link.affectsMasteryPropagation,
    );
    for (const link of incoming) {
      if (seen.has(link.source)) continue;
      seen.add(link.source);
      const node = graph.nodes.find((candidate) => candidate.id === link.source);
      if (!node) continue;
      const distance = current.distance + 1;
      const learnerState = learnerStates[node.id];
      const mastery = learnerState?.masteryProbability ?? node.initialMastery;
      const urgency = learnerState?.nextReviewAt
        ? Number(new Date(learnerState.nextReviewAt) <= new Date())
        : 0;
      const score = (1 - mastery) * 0.6 + link.prerequisiteWeight * 0.25 + 0.1 / distance + urgency * 0.05;
      candidates.push({
        conceptId: node.id,
        distance,
        score,
        reason: `${node.label} is a weak prerequisite ${distance === 1 ? "directly" : `${distance} steps`} upstream and carries ${Math.round(link.prerequisiteWeight * 100)}% dependency weight.`,
      });
      queue.push({ conceptId: node.id, distance, weight: link.prerequisiteWeight });
    }
  }

  const weak = candidates
    .filter((candidate) => {
      const node = graph.nodes.find((item) => item.id === candidate.conceptId);
      if (!node) return false;
      return (learnerStates[node.id]?.masteryProbability ?? node.initialMastery) < 0.8;
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, maximumSteps)
    .sort((left, right) => right.distance - left.distance);

  if (weak.length > 0) return weak;
  const selected = graph.nodes.find((node) => node.id === selectedConceptId);
  return selected
    ? [
        {
          conceptId: selected.id,
          distance: 0,
          score: 1 - (learnerStates[selected.id]?.masteryProbability ?? selected.initialMastery),
          reason: "No weak prerequisite is blocking this concept; retrieve it again from the source.",
        },
      ]
    : [];
}
