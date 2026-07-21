# Synapse Build Status

Last updated: 2026-07-21 (Asia/Taipei)

## Completion statement

The required deterministic/no-key product path is implemented and verified. All five required repository commands pass, including the Playwright judged-learning flow with real text-PDF extraction. The final code state was also inspected in the in-app Chromium browser at desktop and mobile widths. Optional live-provider, public-deployment, and release-asset work is explicitly listed below rather than treated as complete.

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
| `npm run test` | **Passed**: 8 files, 23 tests in 3.01 s. Includes schemas, normalization, mastery, thresholds, risk, repair, scoring, ingestion, serialization, KaTeX rendering, UI flow, and server fallbacks. |
| `npm run build` | **Passed** with Vite 8.1.5 in 319 ms. The 3D chunk is lazy but Vite reports large-chunk warnings: main 887.70 kB and lazy 3D 1,369.35 kB before gzip. |
| `npm run test:e2e` | **Passed**: 1 Chromium test in 2.2 s (1.8 s test time). It covers judged recall, mastery, renderer synchronization, repair, reload persistence, deterministic pasted text, a generated valid text PDF, and simulated provider outage recovery. |
| Built-asset secret scan | **Passed**: no OpenAI-key-shaped value or `OPENAI_API_KEY` identifier found in built JavaScript. |

## Browser verification results

Flow under test: preset opens → 2D selection → Backpropagation source/formula → correct chain-rule answer → mastered state → 3D/2D preservation → Vanishing Gradients Repair Path → reload persistence → deterministic text graph → simulated API outage.

Observed against the final code state:

- Machine Learning preset and curated-mode indicator rendered.
- 2D and lazy 3D views rendered from the same graph; selection persisted between them.
- Search, Backpropagation selection, a structurally rendered KaTeX fraction, page-12 citation, and source excerpt rendered.
- A correct chain-rule answer produced correct feedback and a mastered semantic status.
- Vanishing Gradients produced an actionable Repair Path.
- Reload restored learner mastery through strict Zod-validated persistence.
- Local text and real one-page text-PDF ingestion both produced deterministic, source-grounded graphs.
- A simulated 503 kept the current graph intact and displayed an actionable degraded-mode notice.
- The Playwright run rejected unexpected console errors; the simulated 503 network diagnostic and environment-specific WebGL warnings are the only allow-listed messages.
- Desktop was visually inspected at 1280×720. Mobile was inspected at 390×844 with zero horizontal document overflow; the inspector became a bottom sheet at 219 px from the top and preserved the rendered formula and relationship controls.
- Final desktop and mobile QA captures were inspected at original resolution and intentionally kept outside the repository as verification artifacts.

The generated image concept informed five concrete checks: top-level hierarchy, left-rail filters/actions, graph-to-inspector balance, source-card prominence, and cyan/violet status styling. The implementation intentionally keeps its own documented product structure, responsive bottom sheet, and live canonical renderers rather than treating the generated concept as a replacement specification.

## Known limitations

- The force-graph and React Flow bundles are necessarily substantial; 3D is lazy-loaded, but bundle-size warnings remain.
- Deterministic text extraction uses conservative source order to propose prerequisite links and labels the result accordingly.
- PDF support is text-only; scanned documents receive an actionable paste-OCR recovery message.
- The default mastery `guess` parameter is 0.08 rather than the spec’s suggested 0.20 so a fully correct, rubric-complete Backpropagation retrieval can cross the judged mastered threshold from the curated starting state. Probabilities remain clamped and one incorrect response cannot collapse mastery to zero.
- No live GPT request was made, so account-specific GPT-5.6 availability and billing remain unverified; server error/fallback contracts are covered deterministically.
- No Figma file was mutated because the request provided no Figma file or project target; Figma plugin constraints were used to avoid inventing an external design target.
- No GitHub remote was created or changed because the GitHub connector found no existing Synapse repository and no destination/visibility was specified. The local `main` branch is committed and ready to publish.

## Environment variables

```text
OPENAI_API_KEY=        # optional, server-only
OPENAI_MODEL=gpt-5.6  # optional override
OPENAI_TIMEOUT_MS=20000
VITE_DETERMINISTIC_MODE=false
VITE_SIMULATE_API_FAILURE=false
```

## Deployment instructions

1. Run `npm install` and the five required checks; all five pass in the recorded local environment.
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
