import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Header } from "@/components/Header/Header";
import { GraphCanvas } from "@/components/Canvas/GraphCanvas";
import { ToolRail } from "@/components/Sidebar/ToolRail";
import { InspectorDrawer } from "@/components/Sidebar/InspectorDrawer";
import { DocumentUploadModal } from "@/components/Modals/DocumentUploadModal";
import { PerformanceSummary } from "@/components/Modals/PerformanceSummary";
import { useSynapseStore } from "@/stores/useSynapseStore";

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const state = useSynapseStore();
  const hydrate = useSynapseStore((store) => store.hydrate);

  useEffect(() => { void hydrate(); }, [hydrate]);

  return (
    <div className={`app-shell ${state.reducedMotion ? "reduced-motion" : ""}`}>
      <Header onUpload={() => setUploadOpen(true)} onSummary={() => setSummaryOpen(true)} />
      {(state.degradedMessage || state.storageWarning) && (
        <div className="degraded-banner" role="status">
          <AlertTriangle size={16} />
          <span>{state.degradedMessage ?? state.storageWarning}</span>
          <button onClick={() => state.showDegradedMessage(null)} aria-label="Dismiss notice"><X size={15} /></button>
        </div>
      )}
      <div className="workspace-grid">
        <ToolRail />
        <GraphCanvas />
        <InspectorDrawer key={state.selectedConceptId ?? "empty"} />
      </div>
      <footer className="session-strip">
        <span><i className={state.repairActive ? "active" : ""} />{state.repairActive ? `${state.repairPath.length} repair steps active` : "Knowledge field synchronized"}</span>
        <button onClick={() => setSummaryOpen(true)}>Session: {state.attempts.length} attempts · Review summary</button>
      </footer>
      <DocumentUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <PerformanceSummary open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}
