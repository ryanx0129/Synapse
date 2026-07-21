import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { ConceptViewData } from "@/domain/graph/rendererAdapters";
import { StatusBadge } from "@/components/common/StatusBadge";

type ConceptFlowNode = Node<ConceptViewData, "concept">;

export function ConceptNode({ data, selected }: NodeProps<ConceptFlowNode>) {
  return (
    <article
      className={`concept-node status-border-${data.status} ${selected || data.selected ? "is-selected" : ""} ${data.inRepairPath ? "in-repair" : ""}`}
      aria-label={`${data.label}, ${data.status}, ${Math.round(data.mastery * 100)} percent mastery`}
    >
      <Handle type="target" position={Position.Top} className="concept-handle" />
      <div className="concept-node-heading">
        <StatusBadge status={data.status} compact />
        <span>{Math.round(data.mastery * 100)}%</span>
      </div>
      <strong>{data.label}</strong>
      <span className="concept-node-cluster">{data.cluster.replace(/-/gu, " ")}</span>
      <Handle type="source" position={Position.Bottom} className="concept-handle" />
    </article>
  );
}

