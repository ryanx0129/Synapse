import type {
  AttemptRecord,
  KnowledgeGraph,
  LearnerConceptState,
} from "@/domain/graph/graphSchema";
import { learnerConceptStateSchema } from "@/domain/graph/graphSchema";
import { database } from "./database";

const memory = {
  graphs: new Map<string, KnowledgeGraph>(),
  learner: new Map<string, LearnerConceptState>(),
  attempts: new Map<string, AttemptRecord>(),
  preferences: new Map<string, unknown>(),
};

let indexedDbAvailable = true;

async function safe<T>(operation: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (!indexedDbAvailable) return fallback();
  try {
    return await operation();
  } catch {
    indexedDbAvailable = false;
    return fallback();
  }
}

export const repositories = {
  get isPersistent() {
    return indexedDbAvailable;
  },
  async saveGraph(graph: KnowledgeGraph, hash?: string) {
    memory.graphs.set(graph.id, graph);
    await safe(
      async () => database.graphs.put({ id: graph.id, graph, ...(hash ? { hash } : {}), updatedAt: new Date().toISOString() }),
      () => undefined,
    );
  },
  async graphByHash(hash: string) {
    return safe(
      async () => (await database.graphs.where("hash").equals(hash).first())?.graph,
      () => [...memory.graphs.values()].find((graph) => graph.documentId === hash),
    );
  },
  async graphById(id: string) {
    return safe(
      async () => (await database.graphs.get(id))?.graph,
      () => memory.graphs.get(id),
    );
  },
  async loadLearnerStates(graphId: string) {
    const records = await safe(
      async () => database.learnerStates.where("graphId").equals(graphId).toArray(),
      () =>
        [...memory.learner.entries()]
          .filter(([key]) => key.startsWith(`${graphId}:`))
          .map(([, value]) => ({ ...value, key: `${graphId}:${value.conceptId}`, graphId })),
    );
    return Object.fromEntries(
      records.flatMap((record) => {
        const learnerState = Object.fromEntries(
          Object.entries(record).filter(([name]) => name !== "key" && name !== "graphId"),
        );
        const parsed = learnerConceptStateSchema.safeParse(learnerState);
        return parsed.success ? [[parsed.data.conceptId, parsed.data] as const] : [];
      }),
    );
  },
  async saveLearnerState(graphId: string, state: LearnerConceptState) {
    const key = `${graphId}:${state.conceptId}`;
    memory.learner.set(key, state);
    await safe(
      async () => database.learnerStates.put({ ...state, key, graphId }),
      () => undefined,
    );
  },
  async saveAttempt(attempt: AttemptRecord) {
    memory.attempts.set(attempt.id, attempt);
    await safe(async () => database.attempts.put(attempt), () => undefined);
  },
  async loadAttempts(graphId: string) {
    return safe(
      async () => database.attempts.where("graphId").equals(graphId).sortBy("timestamp"),
      () => [...memory.attempts.values()].filter((attempt) => attempt.graphId === graphId),
    );
  },
  async savePreference(key: string, value: unknown) {
    memory.preferences.set(key, value);
    await safe(async () => database.preferences.put({ key, value }), () => undefined);
  },
  async loadPreference<T>(key: string, fallback: T): Promise<T> {
    return safe(
      async () => ((await database.preferences.get(key))?.value as T | undefined) ?? fallback,
      () => (memory.preferences.get(key) as T | undefined) ?? fallback,
    );
  },
  async resetLearning() {
    memory.learner.clear();
    memory.attempts.clear();
    await safe(
      async () => {
        await database.transaction("rw", database.learnerStates, database.attempts, async () => {
          await database.learnerStates.clear();
          await database.attempts.clear();
        });
      },
      () => undefined,
    );
  },
  async resetAll() {
    memory.graphs.clear();
    memory.learner.clear();
    memory.attempts.clear();
    memory.preferences.clear();
    await safe(async () => database.delete(), () => undefined);
  },
};
