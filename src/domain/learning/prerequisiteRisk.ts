import type {
  KnowledgeGraph,
  LearnerConceptState,
} from "@/domain/graph/graphSchema";

export interface ConceptRisk {
  conceptId: string;
  risk: number;
  ownGap: number;
  prerequisiteContribution: number;
}

export function computePrerequisiteRisk(
  graph: KnowledgeGraph,
  learnerStates: Record<string, LearnerConceptState>,
  lambda = 0.5,
): ConceptRisk[] {
  return graph.nodes
    .map((node) => {
      const mastery = learnerStates[node.id]?.masteryProbability ?? node.initialMastery;
      const incoming = graph.links.filter(
        (link) =>
          link.target === node.id && link.type === "prerequisite" && link.affectsMasteryPropagation,
      );
      const totalWeight = incoming.reduce((sum, link) => sum + link.prerequisiteWeight, 0) || 1;
      const prerequisiteContribution = incoming.reduce((sum, link) => {
        const prerequisite = graph.nodes.find((candidate) => candidate.id === link.source);
        const probability = prerequisite
          ? (learnerStates[prerequisite.id]?.masteryProbability ?? prerequisite.initialMastery)
          : 1;
        return sum + (link.prerequisiteWeight / totalWeight) * (1 - probability);
      }, 0);
      const ownGap = 1 - mastery;
      return {
        conceptId: node.id,
        risk: Math.min(1, ownGap + lambda * prerequisiteContribution),
        ownGap,
        prerequisiteContribution,
      };
    })
    .sort((left, right) => right.risk - left.risk);
}

