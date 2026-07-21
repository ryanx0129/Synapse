# Synapse: Spatial Knowledge Twin — Build Specification

## 1. Product definition

Synapse transforms dense educational material into a **source-grounded spatial knowledge graph** and maintains a parallel model of what the learner appears to know.

It is not merely:

- A PDF summary
- A chatbot over documents
- A static concept map
- A multiple-choice quiz generator
- A decorative 3D graph

Synapse combines:

1. Document understanding
2. Concept and relationship extraction
3. Spatial graph exploration
4. Free-response retrieval practice
5. Probabilistic mastery estimation
6. Prerequisite-aware diagnosis
7. Repair-path recommendation
8. Review scheduling and session reflection

### Product statement

> Synapse turns educational documents into a living map of the material and of the learner's understanding, showing what they know, where the gaps are, why those gaps matter, and what to repair next.

## 2. Track and judging alignment

### Technological implementation

The implementation must visibly demonstrate:

- A non-trivial React/TypeScript application
- Codex-assisted engineering evidence
- GPT-5.6 use for source-grounded graph extraction and/or rubric verification
- Typed schemas and validation
- Graph algorithms
- Learner-model calculations
- Automated tests
- Reliable fallback behavior

### Design

The application must provide one coherent product journey:

```text
Open preset or upload document
→ inspect generated graph
→ select concept
→ answer active-recall prompt
→ receive diagnostic feedback
→ mastery changes
→ prerequisites and repair path update
→ review session progress
```

### Potential impact

Primary users:

- STEM students
- Medical students
- Law students
- High-school and college students
- Self-learners and researchers

Primary problem:

Dense linear reading encourages passive recognition rather than demonstrated recall. Learners often cannot locate the prerequisite responsible for a misunderstanding.

### Idea differentiation

The differentiator is the adaptive **learner twin**:

- The document graph models domain knowledge.
- Learner state models estimated concept mastery.
- Answer evidence changes mastery.
- Weak prerequisites influence downstream risk.
- Synapse recommends a repair path rather than merely giving another explanation.

## 3. Required user stories

### US-1: Instant demo

As a judge, I can open Synapse and immediately explore a high-quality Machine Learning graph without uploading anything or configuring an API key.

### US-2: Synchronized visual modes

As a learner, I can switch between a 3D Galaxy view and a 2D Path view without losing my selected concept, filters, mastery, or session progress.

### US-3: Source-grounded inspection

As a learner, I can select a concept and see:

- Summary
- Formula when applicable
- Citation
- Source excerpt
- Relationship context
- Prerequisites
- Active-recall question

### US-4: Active recall

As a learner, I can type a free-response answer and receive:

- Correct, partial, or incorrect verdict
- Covered concepts
- Missing concepts
- Misconceptions
- Concise feedback
- A targeted hint when needed

### US-5: Adaptive mastery

As a learner, my concept mastery estimate updates from answer evidence and persists across page reloads.

### US-6: Repair path

As a learner, I can see which weak prerequisite concepts contribute to my current gap and activate a focused repair path.

### US-7: Document ingestion

As a learner, I can upload a text-based PDF or paste Markdown/plain text and obtain a graph with page-level citations.

### US-8: Fail-safe demo

As a judge, I can still use the application when an AI provider, API key, network request, WebGL renderer, or uploaded document fails.

## 4. Required application routes and major surfaces

A single-page application is acceptable.

### Main workspace

- Fixed top header
- Optional compact left tool rail
- Full remaining graph canvas
- Right inspector drawer
- Bottom session/progress strip or compact progress element

### Header

Required controls:

- Synapse logo and neural icon
- Current document/preset selector
- 2D/3D segmented toggle
- Progress indicator
- Upload PDF/Text button

Preset options:

- Machine Learning
- Neuroscience
- Constitutional Law

Only Machine Learning requires the fully curated 20+ node dataset. Other presets may use smaller but credible curated graphs.

### Tool rail

- Search concepts
- Cluster filter
- Status filter
- Repair Path toggle
- Recenter
- Fit view
- Legend
- Reduced-motion preference

### Inspector drawer

Sections:

1. Concept header
2. Mastery meter
3. Summary
4. Formula
5. Source citation and excerpt
6. Prerequisites and downstream concepts
7. Active-recall question
8. Answer input
9. Verify Knowledge action
10. Feedback
11. Repair recommendation

The drawer must be keyboard accessible and responsive.

## 5. Canonical graph behavior

The application uses a renderer-independent graph model.

Node status is derived from mastery probability:

\[
\operatorname{status}(p)=
\begin{cases}
\text{gap}, & p < 0.40\\
\text{review}, & 0.40 \le p < 0.80\\
\text{mastered}, & p \ge 0.80
\end{cases}
\]

Default colors:

- Gap: `#ef4444`
- Review: `#eab308`
- Mastered: `#22c55e`
- Locked: slate with dashed treatment

Status must also use a label and icon.

### Graph relations

Supported relation types:

- `prerequisite`
- `causes`
- `part_of`
- `contrasts_with`
- `applies_to`
- `derived_from`
- `example_of`

Every edge must:

- Reference valid nodes
- Include a human-readable explanation
- Include confidence
- Prefer at least one source span
- Indicate whether it affects prerequisite propagation

### Hierarchical clusters

Initial render should show a manageable graph.

- Macro clusters can collapse/expand.
- Selecting a cluster reveals sub-concepts.
- Avoid rendering every label at all times.
- Keep the preset under approximately 60 visible nodes.
- Preserve a path to every concept.

## 6. 3D Galaxy view

Use `react-force-graph-3d`.

Required:

- WebGL canvas filling workspace
- Node status color and semantic shape/icon treatment where feasible
- Node labels on hover/selection
- Directional particles or pulse on relevant edges
- Click selection
- Neighbor highlighting
- Smooth camera focus
- Cluster filtering
- Recenter/fit
- Force simulation stops or cools after stabilization
- Reduced-motion behavior
- Graceful fallback to 2D when WebGL fails

3D is the exploration and demo-impact mode, not the only usable learning interface.

## 7. 2D Path view

Use `@xyflow/react`.

Required:

- Readable custom concept nodes
- Directional prerequisite layout
- Zoom/pan/fit controls
- Minimap optional
- Keyboard-selectable nodes
- Cluster grouping
- Edge labels on selection or detail view
- Same canonical selection and mastery state as 3D
- Repair path emphasized and unrelated edges de-emphasized

2D is the primary focused-study mode.

## 8. Document ingestion

### Input modes

Required:

- Text-based PDF
- Pasted Markdown/plain text

Optional:

- Scanned PDF OCR
- Image upload
- Handwriting recognition

Do not represent optional modes as implemented unless they work.

### PDF extraction

Use `pdfjs-dist`.

Extraction must produce ordered source chunks:

- Stable source ID
- Page number
- Text
- Approximate section heading when available
- Character count

Keep all extraction local in the browser.

Suggested chunking:

- Preserve page boundaries
- Target 800–1,500 characters
- Small overlap only within a page or adjacent section
- Never allow model citations to reference text not sent

### Processing states

- Idle
- Reading file
- Extracting text
- Chunking
- Generating graph
- Validating graph
- Ready
- Degraded fallback
- Error

Progress language must be truthful.

### Input limits

Choose practical demo-safe limits and show them in the UI, for example:

- PDF: 20 MB
- Extracted text: 100,000 characters
- Pasted text: 50,000 characters

For larger documents, process a bounded sample and explain the limitation.

## 9. AI graph extraction

Use a server-side endpoint:

```text
POST /api/extract-graph
```

Input contains document metadata and source chunks.

The model must output structured data matching the graph schema.

Server responsibilities:

- Validate input
- Limit request size
- Build source-grounded prompt
- Call OpenAI Responses API
- Parse structured output
- Validate with Zod
- Map cited source IDs back to page metadata
- Normalize concepts
- Remove dangling links
- Return warnings
- Handle timeout/rate-limit/auth/schema failures

Do not let the model invent page numbers.

### Extraction quality requirements

- 12–35 concepts for a normal demo document
- Concise labels
- Distinct concepts
- 2–6 clusters
- Connected graph when source supports it
- Explicit prerequisite edges
- Every node includes a question
- Every node includes a rubric
- Every node contains source evidence
- Formulas use valid KaTeX-compatible LaTeX when present

## 10. Active-recall verification

Use:

```text
POST /api/verify-answer
```

The verification contract is in `AI_CONTRACTS_AND_PROMPTS.md`.

Hybrid scoring may include:

1. Required-concept coverage
2. Deterministic keyword matching
3. Misconception detection
4. GPT rubric evaluation
5. Optional local semantic similarity

Never mark an answer correct from keyword presence alone.

### Verdict thresholds

The model returns a normalized score, but domain logic decides status:

- `correct`: score ≥ 0.78 and no critical misconception
- `partial`: 0.40 ≤ score < 0.78, or required concepts missing
- `incorrect`: score < 0.40 or critical misconception

Store the evidence and feedback.

### Offline verifier

For preset mode and automated tests, implement deterministic verification using:

- Normalized keyword matching
- Required-concept coverage
- Negation-aware misconception checks where practical
- Fixture-specific accepted answers

It must distinguish correct, partial, irrelevant, and keyword-stuffed wrong answers for test fixtures.

## 11. Learner model

### Bayesian-style mastery update

Each concept stores a probability that the learner knows it.

Let:

- \(p=P(L)\): current mastery
- \(s\): slip probability
- \(g\): guess probability
- \(t\): learning-transition probability

For a correct response:

\[
P(L \mid C)=
\frac{p(1-s)}
{p(1-s)+(1-p)g}
\]

For an incorrect response:

\[
P(L \mid I)=
\frac{ps}
{ps+(1-p)(1-g)}
\]

Then:

\[
p_{\text{next}}
=
P(L\mid \text{observation})
+
(1-P(L\mid \text{observation}))t
\]

For a partial answer, interpolate between incorrect and correct evidence based on score.

Recommended defaults:

```text
slip = 0.10
guess = 0.20
transition = 0.08
```

Clamp probabilities to `[0.02, 0.98]`.

Do not let one weak answer collapse a previously strong concept to zero. Do not let one correct guess guarantee permanent mastery.

### Attempt record

Store:

- Attempt ID
- Concept ID
- Timestamp
- Response text
- Verification score
- Verdict
- Covered concepts
- Missing concepts
- Misconceptions
- Mastery before
- Mastery after
- Verifier mode

## 12. Prerequisite risk

For concept \(v\):

\[
R(v) =
(1-p_v)
+
\lambda
\sum_{u \in Pred(v)}
w_{uv}(1-p_u)
\]

Use normalized weights and a configurable \(\lambda\), initially around `0.5`.

Risk is for ranking, not for directly overwriting mastery.

### Repair Path

For a selected weak concept:

1. Traverse prerequisite edges backward.
2. Rank prerequisite nodes by:
   - Low mastery
   - Edge strength
   - Distance to selected concept
   - Review urgency
3. Return a short ordered path, ideally 2–5 concepts.
4. Explain why each concept appears.
5. Visually emphasize the path.
6. Provide a “Start repair” action that selects the first concept.

When no weak prerequisite exists, recommend retrying the selected concept.

## 13. Review scheduling

Implement a lightweight review schedule.

Preferred: `ts-fsrs` if integration is reliable.

Acceptable MVP:

- Correct and high confidence: later review
- Partial: near-term review
- Incorrect: short retry interval
- Persist `lastReviewedAt`, `nextReviewAt`, and stability/difficulty fields

Do not let scheduling complexity jeopardize the core loop.

## 14. Persistence

Use Dexie/IndexedDB.

Suggested stores:

- `documents`
- `graphs`
- `learnerStates`
- `attempts`
- `sessions`
- `preferences`

Persist:

- Selected preset/document
- Canonical graph
- Mastery states
- Attempts
- Review dates
- Preferred view
- Motion preference
- Filters

Include “Reset learning progress” with confirmation.

Uploaded raw files do not need permanent storage; extracted text and graph may be stored with user-visible controls.

## 15. State management

Use Zustand for application/session state and Dexie for persistence.

Avoid one giant component.

Primary state domains:

- Document ingestion
- Canonical graph
- Learner state
- View/UI state
- Session progress
- AI request state
- Preferences

All mastery calculations and graph algorithms should be pure functions in domain modules.

## 16. Error and degraded behavior

Required failure cases:

- Invalid PDF
- Empty PDF text
- Oversized file
- OpenAI key missing
- OpenAI authentication failure
- Rate limit
- Timeout
- Malformed structured output
- No concepts extracted
- WebGL unavailable
- IndexedDB unavailable
- Corrupted persisted data

Behavior:

- Never crash the entire app.
- Preserve the current graph where possible.
- Explain what failed.
- Explain what remains available.
- Offer retry, fallback preset, or pasted-text recovery.
- Visually label mock/degraded mode.

## 17. Session summary

Required metrics:

- Concepts attempted
- Concepts newly mastered
- Current mastery percentage
- Concepts needing review
- Highest-risk gap
- Suggested next repair path
- Study duration
- Accuracy distribution

Celebrate major milestones, not every answer.

## 18. Privacy

The UI and README must explain:

- PDF text extraction happens locally.
- Only bounded source chunks needed for graph generation are sent to the configured AI endpoint.
- API keys are held server-side.
- Learner state is stored locally by default.
- Users can reset local data.

## 19. Performance targets

Reasonable demo targets on a modern laptop:

- Preset first meaningful render: under 2 seconds
- View switch: under 500 ms after bundle loaded
- Inspector open: under 100 ms
- Mastery update: immediate
- 2D graph: smooth at 60 visible nodes
- 3D graph: interactive at 60 visible nodes
- No continuous force simulation after stabilization
- Lazy-loaded 3D dependency
- No repeated AI call for cached identical document hash

Do not claim hard guarantees that are not measured.

## 20. Required repository layout

Codex may refine this, but all responsibilities must remain clear.

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
├── components/
│   ├── Header/
│   ├── Canvas/
│   │   ├── ThreeGalaxyView.tsx
│   │   ├── FlowchartView.tsx
│   │   ├── ConceptNode.tsx
│   │   └── ControlsOverlay.tsx
│   ├── Sidebar/
│   │   ├── InspectorDrawer.tsx
│   │   ├── ConceptDetails.tsx
│   │   ├── QuizVerification.tsx
│   │   └── RepairPath.tsx
│   ├── Modals/
│   │   ├── DocumentUploadModal.tsx
│   │   └── PerformanceSummary.tsx
│   └── common/
├── domain/
│   ├── graph/
│   │   ├── graphSchema.ts
│   │   ├── normalizeGraph.ts
│   │   ├── graphAlgorithms.ts
│   │   └── rendererAdapters.ts
│   ├── learning/
│   │   ├── mastery.ts
│   │   ├── prerequisiteRisk.ts
│   │   ├── repairPath.ts
│   │   ├── answerScorer.ts
│   │   └── reviewScheduler.ts
│   └── ingestion/
│       ├── chunkDocument.ts
│       └── sourceGrounding.ts
├── services/
│   ├── pdfParser.ts
│   ├── synapseApi.ts
│   └── documentHash.ts
├── storage/
│   ├── database.ts
│   └── repositories.ts
├── stores/
│   ├── graphStore.ts
│   ├── learnerStore.ts
│   └── uiStore.ts
├── workers/
│   └── pdfExtraction.worker.ts
├── data/
│   ├── machineLearningPreset.ts
│   ├── neurosciencePreset.ts
│   └── constitutionalLawPreset.ts
├── test/
│   ├── fixtures/
│   └── setup.ts
├── styles/
│   └── tokens.css
├── main.tsx
└── index.css

api/
├── extract-graph.ts
├── verify-answer.ts
└── _shared/
    ├── openaiClient.ts
    ├── schemas.ts
    ├── errors.ts
    └── prompts.ts

tests/
└── e2e/
```

## 21. Non-goals for the required MVP

Do not spend required build time on:

- User accounts
- Collaboration
- Teacher dashboards
- Cloud database
- Handwriting recognition
- Complex OCR
- Native mobile application
- Deep Knowledge Tracing neural-network training
- Very large document support
- Multiplayer graphs
- Production billing
- Fine-tuning

These can appear in roadmap documentation only.
