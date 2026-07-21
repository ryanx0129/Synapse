import type { Edge, Node } from "@xyflow/react";
import type { KnowledgeGraph, LearnerConceptState } from "./graphSchema";
import { statusFromMastery } from "@/domain/learning/mastery";

export interface ConceptViewData extends Record<string, unknown> {
  label: string;
  cluster: string;
  mastery: number;
  status: ReturnType<typeof statusFromMastery>;
  selected: boolean;
  inRepairPath: boolean;
}

const statusColor = {
  gap: "#ef4444",
  review: "#eab308",
  mastered: "#22c55e",
  locked: "#64748b",
} as const;

export function toReactFlowElements(
  graph: KnowledgeGraph,
  learnerStates: Record<string, LearnerConceptState>,
  selectedId: string | null,
  repairIds: Set<string>,
  reducedMotion = false,
) {
  const clusterColumns = new Map(graph.clusters.map((cluster, index) => [cluster.id, index]));
  const clusterRows = new Map<string, number>();
  const nodes: Array<Node<ConceptViewData>> = graph.nodes.map((node) => {
    const column = clusterColumns.get(node.cluster) ?? 0;
    const row = clusterRows.get(node.cluster) ?? 0;
    clusterRows.set(node.cluster, row + 1);
    const mastery = learnerStates[node.id]?.masteryProbability ?? node.initialMastery;
    return {
      id: node.id,
      type: "concept",
      position: { x: column * 270, y: row * 125 + (column % 2) * 48 },
      data: {
        label: node.shortLabel ?? node.label,
        cluster: node.cluster,
        mastery,
        status: statusFromMastery(mastery),
        selected: selectedId === node.id,
        inRepairPath: repairIds.has(node.id),
      },
      selectable: true,
      focusable: true,
    };
  });
  const edges: Edge[] = graph.links.map((link) => ({
    id: link.id,
    source: link.source,
    target: link.target,
    type: "smoothstep",
    animated: !reducedMotion && repairIds.has(link.source) && repairIds.has(link.target),
    label: selectedId === link.source || selectedId === link.target ? link.label : undefined,
    style: {
      stroke:
        repairIds.has(link.source) && repairIds.has(link.target)
          ? "#22d3ee"
          : link.type === "prerequisite"
            ? "#475569"
            : "#334155",
      opacity: repairIds.size > 0 && !repairIds.has(link.source) && !repairIds.has(link.target) ? 0.2 : 0.72,
    },
    markerEnd: { type: "arrowclosed" as const, color: "#64748b" },
  }));
  return { nodes, edges };
}

export function toForceGraphData(
  graph: KnowledgeGraph,
  learnerStates: Record<string, LearnerConceptState>,
  repairIds: Set<string>,
) {
  return {
    nodes: graph.nodes.map((node) => {
      const mastery = learnerStates[node.id]?.masteryProbability ?? node.initialMastery;
      const status = statusFromMastery(mastery);
      return {
        id: node.id,
        name: node.label,
        cluster: node.cluster,
        mastery,
        status,
        color: repairIds.has(node.id) ? "#22d3ee" : statusColor[status],
        val: 4 + node.importance * 7,
      };
    }),
    links: graph.links.map((link) => ({
      source: link.source,
      target: link.target,
      id: link.id,
      label: link.label,
      repair: repairIds.has(link.source) && repairIds.has(link.target),
    })),
  };
}
