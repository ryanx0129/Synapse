import { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  ArrowDownRight,
  ArrowUpLeft,
  BookOpenText,
  ChevronRight,
  LoaderCircle,
  Quote,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSynapseStore } from "@/stores/useSynapseStore";

export function InspectorDrawer() {
  const state = useSynapseStore();
  const concept = state.graph.nodes.find((node) => node.id === state.selectedConceptId);
  const [answer, setAnswer] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = state.reducedMotion;

  const relationships = useMemo(
    () =>
      concept
        ? state.graph.links
            .filter((link) => link.source === concept.id || link.target === concept.id)
            .map((link) => ({
              link,
              direction: link.target === concept.id ? "prerequisite" : "downstream",
              node: state.graph.nodes.find(
                (node) => node.id === (link.target === concept.id ? link.source : link.target),
              ),
            }))
        : [],
    [concept, state.graph],
  );

  useEffect(() => {
    if (concept) window.setTimeout(() => titleRef.current?.focus(), 0);
  }, [concept]);

  useEffect(() => {
    if (!state.newlyMasteredId || reducedMotion) return;
    void confetti({ particleCount: 55, spread: 52, origin: { x: 0.84, y: 0.35 }, colors: ["#22d3ee", "#8b5cf6", "#22c55e"] });
  }, [state.newlyMasteredId, reducedMotion]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && concept) state.selectConcept(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [concept, state]);

  if (!concept) {
    return (
      <aside className="inspector inspector-empty" aria-label="Concept inspector">
        <div className="empty-orbit" aria-hidden="true"><span /></div>
        <h2>Select a concept</h2>
        <p>Inspect its source evidence, retrieve it from memory, and diagnose prerequisite risk.</p>
        <button className="button-secondary" onClick={() => state.selectConcept("ml-backpropagation")}>
          Study Backpropagation <ChevronRight size={16} />
        </button>
      </aside>
    );
  }

  const learner = state.learnerStates[concept.id];
  const mastery = learner?.masteryProbability ?? concept.initialMastery;
  const status = learner?.status ?? "review";
  const cluster = state.graph.clusters.find((item) => item.id === concept.cluster);
  let renderedFormula: string | null = null;
  if (concept.latex) {
    try {
      renderedFormula = katex.renderToString(concept.latex, {
        displayMode: true,
        throwOnError: true,
        trust: false,
      });
    } catch {
      renderedFormula = null;
    }
  }

  return (
    <aside className="inspector" aria-label={`${concept.label} inspector`}>
      <div className="inspector-scroll">
        <div className="inspector-topline">
          <span>{cluster?.label ?? concept.cluster} / concept</span>
          <button className="icon-button" onClick={() => state.selectConcept(null)} aria-label="Close inspector">
            <X size={18} />
          </button>
        </div>
        <h2 ref={titleRef} tabIndex={-1}>{concept.label}</h2>
        <div className="mastery-row">
          <StatusBadge status={status} />
          <strong>{Math.round(mastery * 100)}% mastery</strong>
        </div>
        <div className="mastery-track" aria-label={`${Math.round(mastery * 100)} percent mastery`}>
          <span style={{ width: `${mastery * 100}%` }} />
        </div>

        <section className="inspector-section">
          <h3><Sparkles size={15} /> Generated explanation</h3>
          <p>{concept.summary}</p>
        </section>

        {concept.latex && (
          <section className="formula-card" aria-label="Formula">
            {renderedFormula ? (
              <div dangerouslySetInnerHTML={{ __html: renderedFormula }} />
            ) : (
              <code>{concept.latex}</code>
            )}
          </section>
        )}

        <section className="source-card">
          <div className="source-card-heading">
            <BookOpenText size={16} />
            <strong>Source evidence</strong>
            <span>p. {concept.sourceSpans[0]?.page}</span>
          </div>
          <p>{concept.sourceSpans[0]?.section ?? "Source passage"}</p>
          <blockquote><Quote size={15} />{concept.sourceSpans[0]?.quote}</blockquote>
        </section>

        <section className="inspector-section relationships-section">
          <h3>Concept relationships</h3>
          <div className="relationship-list">
            {relationships.map(({ link, node, direction }) =>
              node ? (
                <details key={link.id}>
                  <summary>
                    {direction === "prerequisite" ? <ArrowUpLeft size={14} /> : <ArrowDownRight size={14} />}
                    <button onClick={() => state.selectConcept(node.id)}>{node.label}</button>
                    <span>{link.type.replace(/_/gu, " ")}</span>
                  </summary>
                  <p>{link.explanation}</p>
                </details>
              ) : null,
            )}
          </div>
        </section>

        <section className="recall-card">
          <span className="eyebrow">Active recall</span>
          <h3>{concept.question}</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void state.verifySelectedAnswer(answer);
            }}
          >
            <label htmlFor="learner-answer">Explain in your own words</label>
            <textarea
              id="learner-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Retrieve the mechanism from memory…"
              rows={5}
              disabled={state.isVerifying}
            />
            <button className="button-primary verify-button" disabled={!answer.trim() || state.isVerifying}>
              {state.isVerifying ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}
              {state.isVerifying ? "Checking evidence…" : "Verify knowledge"}
            </button>
          </form>
        </section>

        {state.lastVerification && (
          <section className={`feedback-panel verdict-${state.lastVerification.verdict}`} aria-live="polite">
            <div>
              <strong>{state.lastVerification.verdict}</strong>
              <span>{Math.round(state.lastVerification.score * 100)}% evidence score · {state.lastVerification.mode}</span>
            </div>
            <p>{state.lastVerification.feedback}</p>
            {state.lastVerification.coveredConcepts.length > 0 && (
              <p><b>Covered:</b> {state.lastVerification.coveredConcepts.join(", ")}</p>
            )}
            {state.lastVerification.missingConcepts.length > 0 && (
              <p><b>Still missing:</b> {state.lastVerification.missingConcepts.join(", ")}</p>
            )}
            {state.lastVerification.hint && <p className="hint"><b>Hint:</b> {state.lastVerification.hint}</p>}
          </section>
        )}

        <section className="repair-card">
          <div>
            <Wrench size={17} />
            <div><strong>Repair Path</strong><span>Trace weak prerequisites behind this concept.</span></div>
          </div>
          <button className="button-secondary" onClick={state.activateRepairPath}>Diagnose path</button>
          {state.repairActive && (
            <ol>
              {state.repairPath.map((step) => {
                const node = state.graph.nodes.find((item) => item.id === step.conceptId);
                return node ? <li key={step.conceptId}><button onClick={() => state.selectConcept(node.id)}>{node.label}</button><p>{step.reason}</p></li> : null;
              })}
            </ol>
          )}
          {state.repairActive && <button className="button-primary" onClick={state.startRepair}>Start repair</button>}
        </section>
      </div>
    </aside>
  );
}
