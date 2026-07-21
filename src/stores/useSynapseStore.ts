import { create } from "zustand";
import type {
  AttemptRecord,
  ConceptStatus,
  ExtractGraphRequest,
  KnowledgeGraph,
  LearnerConceptState,
  VerificationResult,
} from "@/domain/graph/graphSchema";
import { scoreAnswer } from "@/domain/learning/answerScorer";
import { updateMastery, statusFromMastery } from "@/domain/learning/mastery";
import { buildRepairPath, type RepairStep } from "@/domain/learning/repairPath";
import { nextReviewDate } from "@/domain/learning/reviewScheduler";
import { createFallbackGraph } from "@/domain/ingestion/fallbackGraph";
import { machineLearningPreset, presets } from "@/data/presets";
import { requestAnswerVerification, requestGraphExtraction } from "@/services/synapseApi";
import { repositories } from "@/storage/repositories";

export type GraphMode = "preset" | "gpt" | "fallback";
export type GraphView = "2d" | "3d";
export type ProcessingStage =
  | "idle"
  | "reading"
  | "extracting"
  | "chunking"
  | "generating"
  | "validating"
  | "ready"
  | "degraded"
  | "error";

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `synapse-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialLearnerStates = (graph: KnowledgeGraph): Record<string, LearnerConceptState> =>
  Object.fromEntries(
    graph.nodes.map((node) => {
      const now = new Date().toISOString();
      return [
        node.id,
        {
          conceptId: node.id,
          masteryProbability: node.initialMastery,
          status: statusFromMastery(node.initialMastery),
          attempts: 0,
          correctAttempts: 0,
          updatedAt: now,
        },
      ];
    }),
  );

interface SynapseState {
  graph: KnowledgeGraph;
  graphMode: GraphMode;
  selectedConceptId: string | null;
  view: GraphView;
  learnerStates: Record<string, LearnerConceptState>;
  attempts: AttemptRecord[];
  clusterFilters: string[];
  statusFilters: ConceptStatus[];
  searchQuery: string;
  repairActive: boolean;
  repairPath: RepairStep[];
  lastVerification: VerificationResult | null;
  newlyMasteredId: string | null;
  isVerifying: boolean;
  processingStage: ProcessingStage;
  degradedMessage: string | null;
  storageWarning: string | null;
  sessionStartedAt: string;
  reducedMotion: boolean;
  hydrate: () => Promise<void>;
  selectConcept: (conceptId: string | null) => void;
  setView: (view: GraphView) => void;
  loadPreset: (presetId: keyof typeof presets) => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleCluster: (clusterId: string) => void;
  toggleStatus: (status: ConceptStatus) => void;
  activateRepairPath: () => void;
  clearRepairPath: () => void;
  startRepair: () => void;
  verifySelectedAnswer: (answer: string) => Promise<VerificationResult | null>;
  ingestGraph: (request: ExtractGraphRequest, localOnly: boolean) => Promise<boolean>;
  setProcessingStage: (stage: ProcessingStage) => void;
  showDegradedMessage: (message: string | null) => void;
  toggleReducedMotion: () => void;
  resetLearning: () => Promise<void>;
}

export const useSynapseStore = create<SynapseState>((set, get) => ({
  graph: machineLearningPreset,
  graphMode: "preset",
  selectedConceptId: null,
  view: "3d",
  learnerStates: initialLearnerStates(machineLearningPreset),
  attempts: [],
  clusterFilters: machineLearningPreset.clusters.map((cluster) => cluster.id),
  statusFilters: ["gap", "review", "mastered", "locked"],
  searchQuery: "",
  repairActive: false,
  repairPath: [],
  lastVerification: null,
  newlyMasteredId: null,
  isVerifying: false,
  processingStage: "idle",
  degradedMessage: null,
  storageWarning: null,
  sessionStartedAt: new Date().toISOString(),
  reducedMotion:
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  hydrate: async () => {
    const selectedGraphId = await repositories.loadPreference<string>(
      "selectedGraph",
      get().graph.id,
    );
    const graph =
      selectedGraphId in presets
        ? presets[selectedGraphId as keyof typeof presets]
        : ((await repositories.graphById(selectedGraphId)) ?? get().graph);
    const [persistedLearner, attempts, preferredView, storedFilters, reducedMotion] = await Promise.all([
      repositories.loadLearnerStates(graph.id),
      repositories.loadAttempts(graph.id),
      repositories.loadPreference<GraphView>("view", get().view),
      repositories.loadPreference<{ clusters: string[]; statuses: ConceptStatus[] }>(
        `filters:${graph.id}`,
        {
          clusters: graph.clusters.map((cluster) => cluster.id),
          statuses: ["gap", "review", "mastered", "locked"],
        },
      ),
      repositories.loadPreference<boolean>("reducedMotion", get().reducedMotion),
    ]);
    set({
      graph,
      graphMode: graph.id.startsWith("preset-") ? "preset" : graph.id.startsWith("fallback-") ? "fallback" : "gpt",
      learnerStates: { ...initialLearnerStates(graph), ...persistedLearner },
      attempts,
      view: preferredView,
      clusterFilters: storedFilters.clusters.filter((id) => graph.clusters.some((cluster) => cluster.id === id)),
      statusFilters: storedFilters.statuses,
      reducedMotion,
      storageWarning: repositories.isPersistent
        ? null
        : "IndexedDB is unavailable. This session will continue in memory and may not survive reload.",
    });
  },

  selectConcept: (selectedConceptId) =>
    set({ selectedConceptId, lastVerification: null, newlyMasteredId: null }),

  setView: (view) => {
    set({ view });
    void repositories.savePreference("view", view);
  },

  loadPreset: async (presetId) => {
    const graph = presets[presetId];
    const persistedLearner = await repositories.loadLearnerStates(graph.id);
    const attempts = await repositories.loadAttempts(graph.id);
    set({
      graph,
      graphMode: "preset",
      learnerStates: { ...initialLearnerStates(graph), ...persistedLearner },
      attempts,
      clusterFilters: graph.clusters.map((cluster) => cluster.id),
      selectedConceptId: null,
      repairActive: false,
      repairPath: [],
      lastVerification: null,
      degradedMessage: null,
      processingStage: "ready",
    });
    await repositories.savePreference("selectedGraph", presetId);
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleCluster: (clusterId) =>
    set((state) => {
      const clusterFilters = state.clusterFilters.includes(clusterId)
        ? state.clusterFilters.filter((id) => id !== clusterId)
        : [...state.clusterFilters, clusterId];
      void repositories.savePreference(`filters:${state.graph.id}`, {
        clusters: clusterFilters,
        statuses: state.statusFilters,
      });
      return { clusterFilters };
    }),

  toggleStatus: (status) =>
    set((state) => {
      const statusFilters = state.statusFilters.includes(status)
        ? state.statusFilters.filter((item) => item !== status)
        : [...state.statusFilters, status];
      void repositories.savePreference(`filters:${state.graph.id}`, {
        clusters: state.clusterFilters,
        statuses: statusFilters,
      });
      return { statusFilters };
    }),

  activateRepairPath: () => {
    const state = get();
    if (!state.selectedConceptId) return;
    set({
      repairActive: true,
      repairPath: buildRepairPath(state.graph, state.selectedConceptId, state.learnerStates),
    });
  },

  clearRepairPath: () => set({ repairActive: false, repairPath: [] }),

  startRepair: () => {
    const first = get().repairPath[0];
    if (first) set({ selectedConceptId: first.conceptId, lastVerification: null });
  },

  verifySelectedAnswer: async (answer) => {
    const state = get();
    const concept = state.graph.nodes.find((node) => node.id === state.selectedConceptId);
    if (!concept || !answer.trim()) return null;
    set({ isVerifying: true, newlyMasteredId: null, degradedMessage: null });
    let verification: VerificationResult;
    try {
      if (state.graphMode === "gpt" && !import.meta.env.VITE_DETERMINISTIC_MODE) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 12_000);
        try {
          verification = await requestAnswerVerification(
            state.graph.id,
            concept,
            answer,
            controller.signal,
          );
        } finally {
          window.clearTimeout(timer);
        }
      } else {
        verification = scoreAnswer(concept, answer);
      }
    } catch {
      verification = scoreAnswer(concept, answer);
      set({
        degradedMessage:
          "AI verification was unavailable, so Synapse used the transparent local rubric scorer. Your graph and progress remain available.",
      });
    }

    const previous = state.learnerStates[concept.id] ?? initialLearnerStates(state.graph)[concept.id];
    if (!previous) return null;
    const masteryAfter = updateMastery(previous.masteryProbability, verification.score);
    const updatedAt = new Date().toISOString();
    const learnerState: LearnerConceptState = {
      ...previous,
      masteryProbability: masteryAfter,
      status: statusFromMastery(masteryAfter),
      attempts: previous.attempts + 1,
      correctAttempts: previous.correctAttempts + Number(verification.verdict === "correct"),
      lastReviewedAt: updatedAt,
      nextReviewAt: nextReviewDate(verification.verdict),
      stability: verification.verdict === "correct" ? (previous.stability ?? 1) * 1.4 : 0.8,
      difficulty: Math.min(1, Math.max(0, 1 - verification.score)),
      updatedAt,
    };
    const attempt: AttemptRecord = {
      id: createId(),
      graphId: state.graph.id,
      conceptId: concept.id,
      timestamp: updatedAt,
      response: answer,
      score: verification.score,
      verdict: verification.verdict,
      coveredConcepts: verification.coveredConcepts,
      missingConcepts: verification.missingConcepts,
      misconceptions: verification.misconceptions,
      feedback: verification.feedback,
      ...(verification.hint ? { hint: verification.hint } : {}),
      masteryBefore: previous.masteryProbability,
      masteryAfter,
      verifierMode: verification.mode,
    };
    const newlyMastered = previous.status !== "mastered" && learnerState.status === "mastered";
    const learnerStates = { ...state.learnerStates, [concept.id]: learnerState };
    const repairPath = state.repairActive
      ? buildRepairPath(state.graph, concept.id, learnerStates)
      : state.repairPath;
    set({
      learnerStates,
      attempts: [...state.attempts, attempt],
      lastVerification: verification,
      newlyMasteredId: newlyMastered ? concept.id : null,
      isVerifying: false,
      repairPath,
    });
    await Promise.all([
      repositories.saveLearnerState(state.graph.id, learnerState),
      repositories.saveAttempt(attempt),
    ]);
    return verification;
  },

  ingestGraph: async (request, localOnly) => {
    set({ processingStage: "generating", degradedMessage: null });
    try {
      const cached = await repositories.graphByHash(request.document.id);
      if (cached) {
        set({
          graph: cached,
          graphMode: cached.id.startsWith("fallback-") ? "fallback" : "gpt",
          learnerStates: initialLearnerStates(cached),
          attempts: [],
          clusterFilters: cached.clusters.map((cluster) => cluster.id),
          selectedConceptId: cached.nodes[0]?.id ?? null,
          processingStage: "ready",
          degradedMessage: "Reused the validated graph cached for this document hash.",
          repairActive: false,
          repairPath: [],
        });
        return true;
      }
      const result = localOnly
        ? { mode: "fallback" as const, graph: createFallbackGraph(request), warnings: [] }
        : await requestGraphExtraction(request);
      set({ processingStage: "validating" });
      const learnerStates = initialLearnerStates(result.graph);
      set({
        graph: result.graph,
        graphMode: result.mode,
        learnerStates,
        attempts: [],
        clusterFilters: result.graph.clusters.map((cluster) => cluster.id),
        selectedConceptId: result.graph.nodes[0]?.id ?? null,
        processingStage: result.mode === "fallback" ? "degraded" : "ready",
        degradedMessage:
          result.mode === "fallback"
            ? "Deterministic extraction is active. Citations come from your source; inferred relationships are conservative."
            : null,
        repairActive: false,
        repairPath: [],
      });
      await repositories.saveGraph(result.graph, request.document.id);
      await repositories.savePreference("selectedGraph", result.graph.id);
      return true;
    } catch (error) {
      set({
        processingStage: "degraded",
        degradedMessage: `${error instanceof Error ? error.message : "AI extraction failed"} The current graph is unchanged. Choose deterministic generation to continue locally.`,
      });
      return false;
    }
  },

  setProcessingStage: (processingStage) => set({ processingStage }),
  showDegradedMessage: (degradedMessage) => set({ degradedMessage }),
  toggleReducedMotion: () =>
    set((state) => {
      const reducedMotion = !state.reducedMotion;
      void repositories.savePreference("reducedMotion", reducedMotion);
      return { reducedMotion };
    }),

  resetLearning: async () => {
    const { graph } = get();
    await repositories.resetLearning();
    set({
      learnerStates: initialLearnerStates(graph),
      attempts: [],
      repairPath: [],
      repairActive: false,
      lastVerification: null,
      newlyMasteredId: null,
    });
  },
}));

export const visibleGraphFromState = (state: SynapseState): KnowledgeGraph => {
  const nodes = state.graph.nodes.filter((node) => {
    const learner = state.learnerStates[node.id];
    const status = learner?.status ?? statusFromMastery(node.initialMastery);
    const search = state.searchQuery.trim().toLowerCase();
    return (
      state.clusterFilters.includes(node.cluster) &&
      state.statusFilters.includes(status) &&
      (!search || node.label.toLowerCase().includes(search) || node.tags.some((tag) => tag.includes(search)))
    );
  });
  const nodeIds = new Set(nodes.map((node) => node.id));
  return {
    ...state.graph,
    nodes,
    links: state.graph.links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target)),
  };
};
