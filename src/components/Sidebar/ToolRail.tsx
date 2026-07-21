import { Focus, Gauge, Maximize2, Search, Wrench } from "lucide-react";
import type { ConceptStatus } from "@/domain/graph/graphSchema";
import { StatusBadge } from "@/components/common/StatusBadge";
import { statusFromMastery } from "@/domain/learning/mastery";
import { useSynapseStore } from "@/stores/useSynapseStore";

const statuses: ConceptStatus[] = ["gap", "review", "mastered", "locked"];

export function ToolRail() {
  const state = useSynapseStore();
  const searchResults = state.searchQuery.trim()
    ? state.graph.nodes
        .filter((node) => node.label.toLowerCase().includes(state.searchQuery.toLowerCase()))
        .slice(0, 6)
    : [];
  const dispatch = (name: "fit" | "recenter") =>
    window.dispatchEvent(new CustomEvent(`synapse:${name}`));

  return (
    <aside className="tool-rail" aria-label="Graph tools and accessible concept list">
      <label className="search-box">
        <Search size={16} aria-hidden="true" />
        <span className="sr-only">Search concepts</span>
        <input
          value={state.searchQuery}
          onChange={(event) => state.setSearchQuery(event.target.value)}
          placeholder="Search concepts…"
        />
      </label>
      {searchResults.length > 0 && (
        <ul className="search-results" aria-label="Concept search results">
          {searchResults.map((node) => {
            const mastery = state.learnerStates[node.id]?.masteryProbability ?? node.initialMastery;
            return (
              <li key={node.id}>
                <button onClick={() => state.selectConcept(node.id)}>
                  <StatusBadge status={statusFromMastery(mastery)} compact />
                  <span>{node.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <fieldset className="filter-group">
        <legend>Clusters</legend>
        {state.graph.clusters.map((cluster) => (
          <label key={cluster.id} title={cluster.description}>
            <input
              type="checkbox"
              checked={state.clusterFilters.includes(cluster.id)}
              onChange={() => state.toggleCluster(cluster.id)}
            />
            <span className="cluster-dot" />
            <span>{cluster.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group status-filter-group">
        <legend>Knowledge status</legend>
        {statuses.map((status) => (
          <label key={status}>
            <input
              type="checkbox"
              checked={state.statusFilters.includes(status)}
              onChange={() => state.toggleStatus(status)}
            />
            <StatusBadge status={status} />
          </label>
        ))}
      </fieldset>

      <div className="rail-actions">
        <button className="button-secondary" onClick={() => dispatch("recenter")}>
          <Focus size={16} /> Recenter
        </button>
        <button className="button-secondary" onClick={() => dispatch("fit")}>
          <Maximize2 size={16} /> Fit graph
        </button>
        <button
          className={`button-secondary ${state.repairActive ? "active" : ""}`}
          onClick={() => (state.repairActive ? state.clearRepairPath() : state.activateRepairPath())}
          disabled={!state.selectedConceptId}
        >
          <Wrench size={16} /> Repair Path
        </button>
        <button
          className={`button-secondary ${state.reducedMotion ? "active" : ""}`}
          onClick={state.toggleReducedMotion}
          aria-pressed={state.reducedMotion}
        >
          <Gauge size={16} /> Reduced motion {state.reducedMotion ? "on" : "off"}
        </button>
      </div>

      <details className="legend-panel">
        <summary>Graph legend</summary>
        <p>Arrows point from prerequisites toward dependent concepts. Cyan paths mark active repair steps.</p>
      </details>
    </aside>
  );
}
