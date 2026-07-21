# Synapse Autonomous Build Checklist

Build mode: autonomous  
Verification pauses: none; Codex runs through the entire required MVP  
Git cadence: commit after logical phases when Git identity is configured  
Completion rule: an item is checked only after its verification succeeds

## Phase 1 — Repository foundation

- [ ] **1. Bootstrap production tooling**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Required repository layout`
  What to build: React, TypeScript, Vite, Tailwind, strict TypeScript, linting, formatting, Vitest, React Testing Library, Playwright, and required scripts.
  Acceptance: Section A of `ACCEPTANCE_TESTS.md`.
  Verify: `npm run lint && npm run typecheck && npm run test && npm run build`.

- [ ] **2. Implement canonical schemas and fixtures**
  Spec ref: `DATA_CONTRACTS.md`
  What to build: Zod schemas, inferred types, normalization utilities, preset loader, and validation of `seed/machineLearningPreset.json`.
  Acceptance: Sections B and J.
  Verify: Unit tests for valid and invalid graphs.

## Phase 2 — Reliable preset vertical slice

- [ ] **3. Build app shell and design tokens**
  Spec ref: `DESIGN_SYSTEM.md`
  What to build: Header, tool rail, responsive workspace, drawer shell, loading/error surfaces, status components, and accessible controls.
  Acceptance: Sections C and L.
  Verify: Component tests and manual responsive inspection.

- [ ] **4. Build synchronized 2D and 3D renderers**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > 3D Galaxy view` and `2D Path view`
  What to build: Renderer adapters, view toggle, shared selection, filters, camera/fit controls, WebGL fallback, lazy loading.
  Acceptance: Section D and relevant performance criteria.
  Verify: Component tests, browser interaction, and console inspection.

- [ ] **5. Build source-grounded inspector**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Inspector drawer`
  What to build: Summary, KaTeX, citation/source card, relationship inspection, prerequisites, question, answer form.
  Acceptance: Section E.
  Verify: Component tests for nodes with and without formulas.

## Phase 3 — Adaptive learner twin

- [ ] **6. Implement verification and attempt flow**
  Spec ref: `AI_CONTRACTS_AND_PROMPTS.md > Verification`
  What to build: Deterministic verifier, correct/partial/incorrect states, diagnostic feedback, attempt history, async adapter interface.
  Acceptance: Section F.
  Verify: Unit and integration fixtures including keyword-stuffed contradiction.

- [ ] **7. Implement mastery model and persistence**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Learner model`
  What to build: Bayesian-style updates, partial evidence interpolation, status thresholds, Zustand integration, Dexie repositories, reset behavior.
  Acceptance: Sections G and K.
  Verify: Unit tests and reload E2E.

- [ ] **8. Implement risk propagation and Repair Path**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Prerequisite risk`
  What to build: Risk scoring, prerequisite traversal/ranking, explanations, path highlighting, start-repair action.
  Acceptance: Section H.
  Verify: Graph-algorithm unit tests and browser flow.

- [ ] **9. Implement session summary**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Session summary`
  What to build: Session metrics, progress display, next-action recommendation, restrained milestone celebration.
  Acceptance: Section N.
  Verify: Integration test with mixed attempt outcomes.

## Phase 4 — Document ingestion

- [ ] **10. Implement PDF and text pipeline**
  Spec ref: `SYNAPSE_BUILD_SPEC.md > Document ingestion`
  What to build: Upload modal, tabs, validation, PDF.js worker, page-aware chunking, document hash, progress state, scanned-PDF messaging.
  Acceptance: Section I.
  Verify: Parser unit tests, fixture PDF, pasted-text integration test.

## Phase 5 — GPT-backed structured intelligence

- [ ] **11. Implement server-side graph extraction**
  Spec ref: `AI_CONTRACTS_AND_PROMPTS.md > Graph extraction`
  What to build: Vercel-compatible route, OpenAI Responses API adapter, structured output, source validation, normalization, timeout/retry/error mapping, deterministic fallback.
  Acceptance: Sections I and J.
  Verify: Mocked server tests; optional manual real-key smoke test without making it required.

- [ ] **12. Implement server-side answer verification**
  Spec ref: `AI_CONTRACTS_AND_PROMPTS.md > Answer verification`
  What to build: Vercel-compatible verifier route, rubric prompt, structured result, domain threshold enforcement, local fallback.
  Acceptance: Sections F and J.
  Verify: Mocked API tests and failure-mode integration tests.

## Phase 6 — Product polish and release

- [ ] **13. Finish accessibility, motion, resilience, and performance**
  Spec ref: `DESIGN_SYSTEM.md`, error behavior, and performance targets
  What to build: Reduced motion, keyboard paths, focus management, accessible concept search, optimized renderers, degraded-mode UI, edge pulses.
  Acceptance: Sections L and M.
  Verify: Browser checks, automated accessibility checks if available, console inspection.

- [ ] **14. Complete full E2E flow and release documentation**
  Spec ref: `DEMO_AND_SUBMISSION.md`
  What to build: Playwright judged flow, README, license, environment/setup/deployment/privacy docs, dependency acknowledgments, BUILD_STATUS.
  Acceptance: Sections A and O.
  Verify: All required commands plus clean-clone setup review.

- [ ] **15. Devpost handoff**
  Spec ref: `DEMO_AND_SUBMISSION.md`
  What to build: Confirm README explains Codex and GPT-5.6 usage; provide demo sequence, screenshot checklist, and submission checklist.
  Acceptance: Working project, repository, description support, and sub-three-minute demo plan.
  Verify: Manual final audit against official requirements.
