import { AlertTriangle, CheckCircle2, RotateCcw, Target, X } from "lucide-react";
import { computePrerequisiteRisk } from "@/domain/learning/prerequisiteRisk";
import { useSynapseStore } from "@/stores/useSynapseStore";

export function PerformanceSummary({ open, onClose }: { open: boolean; onClose: () => void }) {
  const state = useSynapseStore();
  if (!open) return null;
  const distribution = { correct: 0, partial: 0, incorrect: 0 };
  state.attempts.forEach((attempt) => { distribution[attempt.verdict] += 1; });
  const newlyMastered = new Set(
    state.attempts.filter((attempt) => attempt.masteryBefore < 0.8 && attempt.masteryAfter >= 0.8).map((attempt) => attempt.conceptId),
  );
  const risks = computePrerequisiteRisk(state.graph, state.learnerStates);
  const highestRisk = state.graph.nodes.find((node) => node.id === risks[0]?.conceptId);
  const sessionEnd = state.attempts.at(-1)?.timestamp ?? state.sessionStartedAt;
  const duration = Math.max(1, Math.round((new Date(sessionEnd).getTime() - new Date(state.sessionStartedAt).getTime()) / 60_000));

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title">
        <div className="modal-heading"><div><span className="eyebrow">Study session · {duration} min</span><h2 id="summary-title">Learner twin update</h2></div><button className="icon-button" onClick={onClose} aria-label="Close session summary"><X size={19} /></button></div>
        <div className="summary-metrics">
          <article><Target size={19} /><strong>{state.attempts.length}</strong><span>attempts</span></article>
          <article><CheckCircle2 size={19} /><strong>{newlyMastered.size}</strong><span>newly mastered</span></article>
          <article><AlertTriangle size={19} /><strong>{state.graph.nodes.filter((node) => state.learnerStates[node.id]?.status !== "mastered").length}</strong><span>need review</span></article>
        </div>
        <section className="distribution"><h3>Retrieval evidence</h3>{Object.entries(distribution).map(([verdict, count]) => <div key={verdict}><span>{verdict}</span><div><i style={{ width: `${state.attempts.length ? (count / state.attempts.length) * 100 : 0}%` }} /></div><strong>{count}</strong></div>)}</section>
        <section className="next-action"><span>Highest-risk gap</span><h3>{highestRisk?.label ?? "Complete one retrieval attempt"}</h3><p>{highestRisk ? `Its current gap and upstream prerequisite weakness give it the highest repair priority.` : "Select a concept and answer from memory to generate a recommendation."}</p>{highestRisk && <button className="button-primary" onClick={() => { state.selectConcept(highestRisk.id); state.activateRepairPath(); onClose(); }}>Open recommended repair</button>}</section>
        <button className="reset-button" onClick={() => { if (window.confirm("Reset all learning progress and attempts? This cannot be undone.")) void state.resetLearning(); }}><RotateCcw size={15} />Reset learning progress</button>
      </section>
    </div>
  );
}
