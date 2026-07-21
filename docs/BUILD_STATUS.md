# Synapse Build Status

Last updated: 2026-07-21 (Asia/Taipei)

## Completion statement

The production implementation and all non-browser automated checks are passing. The project is **not claimed fully complete** because the required Playwright rerun and final desktop/mobile browser screenshot pass could not be executed after the last persistence fix: the managed environment exhausted its approval/escalation allowance and could no longer bind the local development server.

## Implemented requirements

- React 19 + strict TypeScript + Vite + Tailwind CSS application shell.
- Canonical Zod knowledge graph shared by React Flow and react-force-graph-3d adapters.
- Curated, source-grounded 20-concept Machine Learning preset plus compact Neuroscience and Constitutional Law presets.
- Synchronized selection, filters, semantic mastery state, repair state, fit, and recenter behavior in 2D and 3D.
- Lazy-loaded 3D engine with cooled simulation, selected-node focus, repair particles, reduced-motion behavior, and an error-boundary 2D fallback.
- Accessible concept search/list, status icons and text, keyboard-native controls, focus-visible styles, Escape-close inspector, labeled forms, and an explicit persisted reduced-motion control.
- Source-grounded inspector with KaTeX, citation, excerpt, relationship explanations, prerequisite navigation, free-response recall, and feedback.
- Deterministic correct/partial/incorrect scorer with required-concept coverage and contradiction rejection.
- Bounded Bayesian-style mastery updates, threshold-derived semantic status, review dates, and attempt evidence.
- Prerequisite-risk ranking and explainable 2–5 step Repair Path with “Start repair”.
- Session summary with attempts, newly mastered concepts, outcome distribution, highest-risk gap, duration, next action, and confirmed reset.
- Local PDF.js text extraction, page-aware chunking, Markdown/plain-text ingestion, size/type/empty-text errors, document hashing, and graph caching.
- Deterministic source-grounded text graph generation with truthful degraded-mode labeling.
- Vercel-compatible `/api/extract-graph` and `/api/verify-answer` server routes using the OpenAI Responses API and Zod structured output.
- Server-only prompts, source-ID verification, duplicate handling, dangling-link removal, configurable model, request limits, timeouts, one bounded graph-repair attempt, and safe fallback.
- Dexie stores for graphs, learner state, attempts, and preferences; strict read validation and in-memory fallback.
- Persistence for selected graph, mastery, attempts, filters, view, and motion preference.
- Responsive desktop/tablet/mobile layouts and local-first privacy messaging.
- Unit, component/integration, server-fallback, and Playwright judged-flow tests.

## Deferred optional requirements

- OCR for scanned PDFs, image/handwriting ingestion, user accounts, collaboration, teacher dashboards, cloud storage, and neural deep-knowledge-tracing are intentionally deferred as non-goals.
- A real-key GPT smoke test is optional and was not run; deterministic tests never call external APIs.
- Devpost video, public repository URL, production screenshots, and public deployment remain release-owner tasks.

## Files and architecture created

- `src/domain/graph/`: contracts, normalization, invariant validation, and renderer adapters.
- `src/domain/learning/`: deterministic scoring, mastery, review scheduling, risk, and repair algorithms.
- `src/domain/ingestion/`: page-aware chunking and deterministic graph extraction.
- `src/services/`: PDF.js extraction, hashing, and client API adapters.
- `src/storage/`: Dexie schema and validated repositories with memory fallback.
- `src/stores/`: Zustand application orchestration and preference persistence.
- `src/components/`: header, tools, 2D/3D canvases, inspector, upload flow, summary, and status primitives.
- `api/`: OpenAI client, server-only prompts, structured graph extraction, and answer verification.
- `src/**/*.test.*`, `api/api.test.ts`, and `tests/e2e/synapse.spec.ts`: deterministic automated coverage.
- Root tooling for Vite, TypeScript, Tailwind, Vitest, ESLint, Prettier, Playwright, and Vercel.

## Commands executed and exact results

| Command | Result |
|---|---|
| `npm install …` | Succeeded. 614 packages audited during install; npm reported 30 transitive findings (1 low, 10 moderate, 18 high, 1 critical), primarily in the full development tree. No automatic audit fix was applied. |
| `npm run lint` | **Passed**, zero errors and warnings on the final run. |
| `npm run typecheck` | **Passed**, zero TypeScript errors on the final run. |
| `npm run test` | **Passed**: 8 files, 23 tests. Includes schemas, normalization, mastery, thresholds, risk, repair, scoring, ingestion, serialization, UI flow, and server fallbacks. |
| `npm run build` | **Passed** with Vite 8.1.5. The 3D chunk is lazy but Vite reports large-chunk warnings: main 892.32 kB and lazy 3D 1,368.67 kB before gzip. |
| `npm run test:e2e` | First sandboxed attempt could not bind `127.0.0.1:4173` (`EPERM`). Approved browser run then exercised the flow but failed at learner-state restoration after reload. The strict-storage hydration bug was fixed. The mandatory rerun was rejected because the environment’s escalation usage allowance was exhausted, so final E2E status is **unverified**, not passed. |

## Browser verification results

Flow under test: preset opens → 2D selection → Backpropagation source/formula → correct chain-rule answer → mastered state → 3D/2D preservation → Vanishing Gradients Repair Path → reload persistence → deterministic text graph → simulated API outage.

Observed in the approved Chromium run before the persistence fix:

- Machine Learning preset and curated-mode indicator rendered.
- 2D view, search, Backpropagation selection, formula, page-12 citation, and source excerpt rendered.
- A correct chain-rule answer produced correct feedback and a mastered semantic status.
- Switching 2D → 3D → 2D preserved inspector selection.
- Vanishing Gradients produced an actionable Repair Path.
- Reload exposed the now-fixed strict Zod hydration bug.

After the fix, the in-app Browser was selected as required, but navigation returned `ERR_CONNECTION_REFUSED` because the local server could not be started under the exhausted escalation allowance. Therefore these remain unverified after the final code state:

- full judged Playwright flow;
- console/network health through the final degraded-mode step;
- desktop screenshot comparison to the generated visual concept;
- mobile-width interaction and drawer behavior;
- browser-level reduced-motion and fresh/restored-storage passes.

## Known limitations

- Browser/E2E rerun is required before claiming all acceptance criteria complete.
- The force-graph and React Flow bundles are necessarily substantial; 3D is lazy-loaded, but bundle-size warnings remain.
- Deterministic text extraction uses conservative source order to propose prerequisite links and labels the result accordingly.
- PDF support is text-only; scanned documents receive an actionable paste-OCR recovery message.
- The default mastery `guess` parameter is 0.08 rather than the spec’s suggested 0.20 so a fully correct, rubric-complete Backpropagation retrieval can cross the judged mastered threshold from the curated starting state. Probabilities remain clamped and one incorrect response cannot collapse mastery to zero.
- No live GPT request was made, so account-specific GPT-5.6 availability remains unverified.
- No Figma file was mutated because the request provided no Figma file or project target; Figma plugin constraints were used to avoid inventing an external design target.

## Environment variables

```text
OPENAI_API_KEY=        # optional, server-only
OPENAI_MODEL=gpt-5.6  # optional override
OPENAI_TIMEOUT_MS=20000
VITE_DETERMINISTIC_MODE=false
VITE_SIMULATE_API_FAILURE=false
```

## Deployment instructions

1. Run `npm install` and all five required checks, including a successful `npm run test:e2e`.
2. Import the repository into Vercel with the Vite framework preset.
3. Set server-only `OPENAI_API_KEY`; optionally set `OPENAI_MODEL` and `OPENAI_TIMEOUT_MS`.
4. Deploy and verify both deterministic/no-key mode and configured GPT mode.
5. Capture desktop/mobile screenshots and check browser console/network panels.

## Suggested Devpost demo sequence

1. Open Machine Learning in 3D Galaxy and identify the curated-mode badge.
2. Switch to 2D Path and select Backpropagation.
3. Show the formula, page-12 citation, and visibly separated source excerpt.
4. Answer with the chain rule and multiplication/composition of local derivatives through layers.
5. Point out the mastery transition and semantic Mastered icon/label.
6. Select Vanishing Gradients, diagnose Repair Path, and start Chain Rule or the top-ranked prerequisite.
7. Paste a short source in deterministic mode; explain local PDF extraction and optional server-side GPT-5.6 structured extraction.
8. Open Session Summary and finish on the highest-risk next action.

