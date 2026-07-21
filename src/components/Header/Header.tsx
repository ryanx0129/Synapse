import { BrainCircuit, ChartNoAxesCombined, FileUp, Orbit, Route } from "lucide-react";
import { useSynapseStore } from "@/stores/useSynapseStore";

export function Header({
  onUpload,
  onSummary,
}: {
  onUpload: () => void;
  onSummary: () => void;
}) {
  const graph = useSynapseStore((state) => state.graph);
  const graphMode = useSynapseStore((state) => state.graphMode);
  const learnerStates = useSynapseStore((state) => state.learnerStates);
  const view = useSynapseStore((state) => state.view);
  const setView = useSynapseStore((state) => state.setView);
  const loadPreset = useSynapseStore((state) => state.loadPreset);
  const mastered = graph.nodes.filter((node) => learnerStates[node.id]?.status === "mastered").length;
  const average =
    graph.nodes.reduce(
      (sum, node) => sum + (learnerStates[node.id]?.masteryProbability ?? node.initialMastery),
      0,
    ) / graph.nodes.length;

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <BrainCircuit size={24} />
        </div>
        <div>
          <strong>Synapse</strong>
          <span>Spatial Knowledge Twin</span>
        </div>
      </div>

      <div className="header-center">
        <label className="preset-control">
          <span className="sr-only">Knowledge graph preset</span>
          <select
            value={graph.id in { "preset-machine-learning": 1, "preset-neuroscience": 1, "preset-constitutional-law": 1 } ? graph.id : "custom"}
            onChange={(event) => {
              if (event.target.value !== "custom") {
                void loadPreset(event.target.value as "preset-machine-learning");
              }
            }}
          >
            <option value="preset-machine-learning">Machine Learning</option>
            <option value="preset-neuroscience">Neuroscience</option>
            <option value="preset-constitutional-law">Constitutional Law</option>
            {!graph.id.startsWith("preset-") && <option value="custom">{graph.title}</option>}
          </select>
        </label>
        <span className={`mode-pill mode-${graphMode}`}>
          <span aria-hidden="true" />
          {graphMode === "gpt" ? "GPT GENERATED" : graphMode === "fallback" ? "DETERMINISTIC" : "CURATED PRESET"}
        </span>
        <div className="segmented-control" aria-label="Graph view" role="group">
          <button
            className={view === "2d" ? "active" : ""}
            onClick={() => setView("2d")}
            aria-pressed={view === "2d"}
          >
            <Route size={15} />
            <span>2D Path</span>
          </button>
          <button
            className={view === "3d" ? "active" : ""}
            onClick={() => setView("3d")}
            aria-pressed={view === "3d"}
          >
            <Orbit size={15} />
            <span>3D Galaxy</span>
          </button>
        </div>
      </div>

      <div className="header-actions">
        <button className="progress-control" onClick={onSummary} aria-label="Open session summary">
          <span className="progress-ring" style={{ "--progress": `${average * 360}deg` } as React.CSSProperties}>
            <span>{Math.round(average * 100)}</span>
          </span>
          <span className="progress-copy">
            <strong>{mastered}/{graph.nodes.length}</strong>
            <small>mastered</small>
          </span>
        </button>
        <button className="icon-button header-summary" onClick={onSummary} aria-label="Session summary">
          <ChartNoAxesCombined size={19} />
        </button>
        <button className="button-primary upload-button" onClick={onUpload}>
          <FileUp size={17} />
          <span>Upload PDF / Text</span>
        </button>
      </div>
    </header>
  );
}

