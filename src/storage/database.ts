import Dexie, { type EntityTable } from "dexie";
import type {
  AttemptRecord,
  KnowledgeGraph,
  LearnerConceptState,
} from "@/domain/graph/graphSchema";

export interface StoredGraph {
  id: string;
  graph: KnowledgeGraph;
  hash?: string;
  updatedAt: string;
}

export interface StoredLearnerState extends LearnerConceptState {
  key: string;
  graphId: string;
}

export interface StoredPreference {
  key: string;
  value: unknown;
}

export class SynapseDatabase extends Dexie {
  graphs!: EntityTable<StoredGraph, "id">;
  learnerStates!: EntityTable<StoredLearnerState, "key">;
  attempts!: EntityTable<AttemptRecord, "id">;
  preferences!: EntityTable<StoredPreference, "key">;

  constructor() {
    super("synapse-spatial-knowledge-twin");
    this.version(1).stores({
      graphs: "id, hash, updatedAt",
      learnerStates: "key, graphId, conceptId, updatedAt",
      attempts: "id, graphId, conceptId, timestamp",
      preferences: "key",
    });
  }
}

export const database = new SynapseDatabase();

