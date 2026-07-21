import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, { type ForceGraphMethods } from "react-force-graph-3d";
import { toForceGraphData } from "@/domain/graph/rendererAdapters";
import { useSynapseStore, visibleGraphFromState } from "@/stores/useSynapseStore";

export default function ThreeGalaxyView() {
  const state = useSynapseStore();
  const graph = visibleGraphFromState(state);
  const repairIds = useMemo(
    () => new Set(state.repairPath.map((step) => step.conceptId)),
    [state.repairPath],
  );
  const graphData = useMemo(
    () => toForceGraphData(graph, state.learnerStates, repairIds),
    [graph, state.learnerStates, repairIds],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const reducedMotion = state.reducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resize = () => setSize({ width: container.clientWidth, height: container.clientHeight });
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const selected = graphData.nodes.find(
      (node) => node.id === state.selectedConceptId,
    ) as (typeof graphData.nodes[number] & { x?: number; y?: number; z?: number }) | undefined;
    if (!selected || typeof selected.x !== "number") return;
    const distance = 90;
    const ratio = 1 + distance / Math.hypot(selected.x, selected.y ?? 0, selected.z ?? 0);
    graphRef.current?.cameraPosition(
      { x: selected.x * ratio, y: (selected.y ?? 0) * ratio, z: (selected.z ?? 0) * ratio },
      { x: selected.x, y: selected.y ?? 0, z: selected.z ?? 0 },
      reducedMotion ? 0 : 650,
    );
  }, [state.selectedConceptId, reducedMotion, graphData]);

  useEffect(() => {
    const fit = () => graphRef.current?.zoomToFit(reducedMotion ? 0 : 400, 56);
    const recenter = () =>
      graphRef.current?.cameraPosition({ x: 0, y: 0, z: 260 }, { x: 0, y: 0, z: 0 }, reducedMotion ? 0 : 400);
    window.addEventListener("synapse:fit", fit);
    window.addEventListener("synapse:recenter", recenter);
    return () => {
      window.removeEventListener("synapse:fit", fit);
      window.removeEventListener("synapse:recenter", recenter);
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="graph-surface galaxy-surface" aria-label="3D galaxy concept view">
      <ForceGraph3D
        ref={graphRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        backgroundColor="#020617"
        nodeLabel={(node) => `${String(node.name)} · ${Math.round(Number(node.mastery) * 100)}%`}
        nodeColor={(node) => String(node.color)}
        nodeVal={(node) => Number(node.val)}
        linkColor={(link) => (link.repair ? "#22d3ee" : "#334155")}
        linkOpacity={0.52}
        linkWidth={(link) => (link.repair ? 2.4 : 0.8)}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={0.94}
        linkDirectionalParticles={(link) => (link.repair && !reducedMotion ? 2 : 0)}
        linkDirectionalParticleColor={() => "#22d3ee"}
        linkDirectionalParticleSpeed={0.004}
        onNodeClick={(node) => state.selectConcept(String(node.id))}
        onEngineStop={() => graphRef.current?.zoomToFit(reducedMotion ? 0 : 450, 56)}
        cooldownTicks={reducedMotion ? 1 : 80}
        d3AlphaDecay={0.045}
        enableNodeDrag={!reducedMotion}
        showNavInfo={false}
      />
      <p className="galaxy-help">Drag to orbit · scroll to zoom · select a sphere to study</p>
    </div>
  );
}
