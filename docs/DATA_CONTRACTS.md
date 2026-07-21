# Synapse Data Contracts

## 1. Canonical graph

Use these TypeScript shapes as the semantic contract. Implement them with Zod and infer TypeScript types from the schemas where practical.

```ts
type ConceptStatus = "gap" | "review" | "mastered" | "locked";

type RelationType =
  | "prerequisite"
  | "causes"
  | "part_of"
  | "contrasts_with"
  | "applies_to"
  | "derived_from"
  | "example_of";

interface SourceSpan {
  sourceId: string;
  page: number;
  section?: string;
  quote: string;
  startOffset?: number;
  endOffset?: number;
}

interface AnswerRubric {
  requiredConcepts: string[];
  optionalConcepts: string[];
  misconceptions: string[];
  acceptedKeywords: string[];
  referenceAnswer: string;
}

interface ConceptNode {
  id: string;
  label: string;
  shortLabel?: string;
  cluster: string;
  summary: string;
  latex?: string;
  difficulty: number;
  importance: number;
  initialMastery: number;
  sourceSpans: SourceSpan[];
  question: string;
  rubric: AnswerRubric;
  tags: string[];
}

interface ConceptLink {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label: string;
  explanation: string;
  confidence: number;
  prerequisiteWeight: number;
  affectsMasteryPropagation: boolean;
  sourceSpans: SourceSpan[];
}

interface KnowledgeGraph {
  schemaVersion: "1.0";
  id: string;
  title: string;
  description: string;
  domain: string;
  createdAt: string;
  documentId?: string;
  clusters: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  nodes: ConceptNode[];
  links: ConceptLink[];
  warnings: string[];
}
```

## 2. Learner state

```ts
interface LearnerConceptState {
  conceptId: string;
  masteryProbability: number;
  status: ConceptStatus;
  attempts: number;
  correctAttempts: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  stability?: number;
  difficulty?: number;
  updatedAt: string;
}

interface AttemptRecord {
  id: string;
  graphId: string;
  conceptId: string;
  timestamp: string;
  response: string;
  score: number;
  verdict: "correct" | "partial" | "incorrect";
  coveredConcepts: string[];
  missingConcepts: string[];
  misconceptions: string[];
  feedback: string;
  hint?: string;
  masteryBefore: number;
  masteryAfter: number;
  verifierMode: "gpt" | "local" | "mock";
}

interface StudySession {
  id: string;
  graphId: string;
  startedAt: string;
  endedAt?: string;
  attemptedConceptIds: string[];
  newlyMasteredConceptIds: string[];
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
}
```

## 3. Source chunks

```ts
interface SourceChunk {
  id: string;
  documentId: string;
  page: number;
  section?: string;
  text: string;
  charStart?: number;
  charEnd?: number;
}

interface ParsedDocument {
  id: string;
  title: string;
  fileName?: string;
  mimeType: "application/pdf" | "text/plain" | "text/markdown";
  pageCount?: number;
  characterCount: number;
  hash: string;
  chunks: SourceChunk[];
}
```

## 4. Extraction API

### Request

```ts
interface ExtractGraphRequest {
  document: {
    id: string;
    title: string;
    domainHint?: string;
  };
  chunks: SourceChunk[];
  options?: {
    targetConceptCount?: number;
    includeFormulas?: boolean;
    model?: string;
  };
}
```

### Response

```ts
interface ExtractGraphResponse {
  mode: "gpt" | "fallback";
  graph: KnowledgeGraph;
  warnings: string[];
  requestId?: string;
}
```

## 5. Verification API

### Request

```ts
interface VerifyAnswerRequest {
  graphId: string;
  concept: {
    id: string;
    label: string;
    summary: string;
    question: string;
    rubric: AnswerRubric;
    sourceSpans: SourceSpan[];
  };
  learnerAnswer: string;
}
```

### Response

```ts
interface VerificationResult {
  mode: "gpt" | "local" | "mock";
  score: number;
  verdict: "correct" | "partial" | "incorrect";
  coveredConcepts: string[];
  missingConcepts: string[];
  misconceptions: string[];
  feedback: string;
  hint?: string;
  confidence: number;
}
```

## 6. Validation invariants

The graph normalizer must enforce:

- Unique node IDs
- Unique link IDs
- Non-empty concise labels
- `difficulty`, `importance`, `initialMastery`, confidence, and weights in `[0,1]`
- Every edge source and target exists
- No self-edge unless explicitly justified and supported
- Every node has source evidence
- Every node has a non-empty question and rubric
- Every source page is a positive integer
- Every model-provided source ID exists in the request
- Status is derived from learner state, not persisted as model truth
- Duplicate concepts are merged only at high normalized-label similarity and compatible meaning
