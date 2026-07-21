# Master Codex Execution Prompt

You are the lead product engineer, ML engineer, interaction designer, QA engineer, and release owner for **Synapse: Spatial Knowledge Twin**, an OpenAI Build Week Devpost Education Track project.

Build the entire production-quality project in this repository autonomously.

## 1. Establish ground truth before coding

Read every file below completely before modifying code:

1. `README_FIRST.md`
2. `AGENTS.md`
3. `docs/SYNAPSE_BUILD_SPEC.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `docs/DATA_CONTRACTS.md`
6. `docs/AI_CONTRACTS_AND_PROMPTS.md`
7. `docs/DESIGN_SYSTEM.md`
8. `docs/ARCHITECTURE.md`
9. `docs/BUILD_CHECKLIST.md`
10. `docs/DEMO_AND_SUBMISSION.md`
11. `schemas/synapse-graph.schema.json`
12. `seed/machineLearningPreset.json`

Treat the priority order in `README_FIRST.md` as authoritative.

Inspect the repository, installed tools, Node version, package manager, and existing files. Resolve inconsistencies in favor of the specifications. Do not ask me to make routine implementation choices. Make professional, documented decisions and continue.

## 2. Deliver the complete application

Implement every **required** item in `docs/BUILD_CHECKLIST.md`, not only a scaffold.

The final result must be a runnable website with this complete vertical loop:

1. The Machine Learning preset loads instantly.
2. The user explores the same graph in 3D Galaxy and 2D Path views.
3. Selecting a node opens a source-grounded inspector.
4. The user submits a free-response active-recall answer.
5. The answer receives correct, partial, or incorrect feedback.
6. A Bayesian-style mastery estimate updates.
7. Prerequisite risk propagates.
8. A repair path recommends what to study next.
9. Mastery and session state persist across reloads.
10. PDF or pasted text can generate a graph through a server-side OpenAI route.
11. Model or network failure falls back cleanly to deterministic data.
12. The session summary shows progress and next actions.

A static mockup, hard-coded screenshot, fake upload button, text-only chatbot, or graph without adaptive learning does not satisfy the task.

## 3. Required stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- `react-force-graph-3d`
- `@xyflow/react`
- `pdfjs-dist`
- `katex` and `react-katex`
- `lucide-react`
- `canvas-confetti`
- `zod`
- `zustand`
- `dexie`
- OpenAI JavaScript SDK and Responses API
- Vitest
- React Testing Library
- Playwright
- ESLint and Prettier

Use the latest mutually compatible stable versions available in the environment. Record material substitutions in `docs/BUILD_STATUS.md`.

Use Vercel-compatible serverless routes under `api/` for AI operations. The normal Vite frontend must remain runnable without API credentials through deterministic fallback behavior. Add scripts for a frontend-only local mode and a full-stack local mode when feasible.

## 4. Architecture constraints

- Maintain a renderer-independent canonical graph.
- Build adapters for React Flow and react-force-graph-3d.
- Keep learner-model algorithms as pure TypeScript functions.
- Keep model prompts and API contracts server-side.
- Validate model output with Zod before normalization.
- Preserve page-level source spans.
- Reject dangling graph references.
- Merge duplicate concepts conservatively.
- Never use a browser-exposed API key.
- Persist documents, graphs, attempts, learner state, and preferences in IndexedDB.
- Lazy-load the 3D engine.
- Avoid rerendering the entire graph for one mastery update.
- Honor `prefers-reduced-motion`.
- Provide semantic status icons and labels in addition to colors.

## 5. GPT-5.6 and resilient AI behavior

Use GPT-5.6 through the OpenAI Responses API for:

- Source-grounded graph extraction
- Rubric-based free-response verification

Use strict structured output when supported by the installed SDK. If SDK details differ, use the current official supported structured-output mechanism and document the implementation.

Do not invent citations. Model output must reference source chunks provided in the request. The server must map source IDs back to page metadata.

Implement:

- Timeouts
- Abort handling
- At most one bounded retry
- Schema-validation failure handling
- Rate-limit and authentication errors
- Deterministic fallback mode
- User-visible degraded-mode messaging

If GPT-5.6 is unavailable to the runtime API account, honor `OPENAI_MODEL`, keep the API adapter model-configurable, and preserve all deterministic demo capabilities. Do not silently pretend a fallback response came from GPT-5.6.

## 6. Visual quality

Implement the design system in `docs/DESIGN_SYSTEM.md`.

The website should feel like a polished scientific instrument:

- Dark slate cyberpunk environment
- Restrained cyan/violet accents
- Glass panels
- Status colors: red, yellow, green
- Strong information hierarchy
- Smooth but optional motion
- Legible labels
- Responsive inspector
- Excellent loading, empty, error, and degraded states

Do not apply neon glow to every element. Reserve emphasis for selected concepts, repair paths, and mastery transitions.

Use 3D for overview and visual impact. Use 2D for readable prerequisite learning. Preserve graph state, selection, filters, and inspector content while switching views.

## 7. Build order

Follow `docs/BUILD_CHECKLIST.md` in order, but continue through all phases in this task.

After every phase:

1. Run the fastest relevant tests.
2. Fix regressions immediately.
3. Update completion marks only after verification.
4. Make a logical Git commit if Git identity is configured.
5. Continue without waiting for confirmation.

Prioritize a reliable complete preset loop before AI ingestion. Do not let API integration break the demo.

## 8. Testing requirements

Implement and run:

### Unit tests
- Schema validation
- Graph normalization
- Bayesian mastery updates
- Status thresholds
- Prerequisite-risk propagation
- Repair-path ranking
- Deterministic answer scoring
- Persistence serialization

### Component/integration tests
- Preset loading
- View switching without state loss
- Inspector content
- Correct, partial, and incorrect answer flows
- Status icon and label behavior
- Upload validation
- API failure fallback
- Session summary

### End-to-end tests
At minimum, Playwright must verify:

1. App opens with the Machine Learning preset.
2. A node can be selected.
3. The inspector opens.
4. A correct answer changes mastery and status.
5. 2D/3D switching preserves that state.
6. Repair Path can be activated.
7. Reload preserves learner state.
8. Text input produces a graph in mock mode.
9. An API failure shows degraded mode without crashing.

Use deterministic test fixtures. Do not require a real API key for automated tests.

## 9. Browser verification

Start the app and exercise it in an actual browser.

Inspect:

- Browser console
- Network failures
- Layout at desktop and mobile widths
- 2D interaction
- 3D/WebGL fallback
- Drawer focus behavior
- Keyboard navigation
- Reduced-motion mode
- Fresh-storage and restored-storage sessions

Fix all high-severity issues found.

## 10. Documentation and release output

Create or complete:

- `README.md`
- `LICENSE` using MIT unless an existing license conflicts
- `.env.example`
- Setup instructions
- Local and full-stack run instructions
- Deployment instructions
- Architecture explanation
- AI/data-flow explanation
- Privacy statement explaining local PDF extraction and server-bound chunks
- Third-party dependency acknowledgments
- Screenshots section with clear placeholders only when screenshots cannot be generated
- `docs/BUILD_STATUS.md`

The README must prominently explain how Codex and GPT-5.6 were used.

## 11. Honest completion standard

Do not hide failures. Do not replace required functionality with TODO comments. Do not claim tests passed unless you ran them and saw them pass.

If an environment limitation prevents one requirement:

1. Implement the strongest possible fallback.
2. Preserve the intended interface.
3. Document the exact limitation.
4. Continue completing all unaffected work.

## 12. Final response

When finished, give a concise engineering handoff containing:

1. Product capabilities delivered
2. Architecture summary
3. Key files created
4. Commands executed
5. Exact test/build results
6. Browser-verification results
7. Environment variables
8. How to run locally
9. How to deploy
10. Known limitations
11. The recommended sub-three-minute Devpost demo flow

Begin now. Read the specifications, inspect the repository, plan internally, and build the complete project.
