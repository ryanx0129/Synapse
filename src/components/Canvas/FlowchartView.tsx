import { useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type ReactFlowInstance,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ConceptNode } from "./ConceptNode";
import { toReactFlowElements } from "@/domain/graph/rendererAdapters";
import { useSynapseStore, visibleGraphFromState } from "@/stores/useSynapseStore";

const nodeTypes = { concept: ConceptNode };

export default function FlowchartView() {
  const state = useSynapseStore();
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
  const graph = visibleGraphFromState(state);
  const repairIds = useMemo(
    () => new Set(state.repairPath.map((step) => step.conceptId)),
    [state.repairPath],
  );
  const { nodes, edges } = useMemo(
    () =>
      toReactFlowElements(
        graph,
        state.learnerStates,
        state.selectedConceptId,
        repairIds,
        state.reducedMotion,
      ),
    [graph, state.learnerStates, state.selectedConceptId, repairIds, state.reducedMotion],
  );
  const onNodeClick: NodeMouseHandler = (_event, node) => state.selectConcept(node.id);

  useEffect(() => {
    if (!instance) return;
    const fit = () => void instance.fitView({ padding: 0.16, duration: 300 });
    const recenter = () => void instance.setCenter(0, 0, { zoom: 0.65, duration: 300 });
    window.addEventListener("synapse:fit", fit);
    window.addEventListener("synapse:recenter", recenter);
    return () => {
      window.removeEventListener("synapse:fit", fit);
      window.removeEventListener("synapse:recenter", recenter);
    };
  }, [instance]);

  return (
    <div className="graph-surface" aria-label="2D prerequisite path view">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={setInstance}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.2}
        maxZoom={1.8}
        nodesDraggable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={24} size={1} variant={BackgroundVariant.Dots} />
        <Controls
          position="bottom-right"
          showInteractive={false}
          aria-label="2D graph zoom and fit controls"
        />
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="canvas-empty" role="status">
          <strong>No concepts match these filters.</strong>
          <span>Re-enable a cluster or status in the tool rail.</span>
        </div>
      )}
    </div>
  );
}
