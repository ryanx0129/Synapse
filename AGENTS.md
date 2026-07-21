# Synapse Repository Instructions

Synapse is an OpenAI Build Week / Devpost Education Track project.

## Required reading

Before editing code, read these files completely:

1. `docs/SYNAPSE_BUILD_SPEC.md`
2. `docs/ACCEPTANCE_TESTS.md`
3. `docs/DATA_CONTRACTS.md`
4. `docs/AI_CONTRACTS_AND_PROMPTS.md`
5. `docs/DESIGN_SYSTEM.md`
6. `docs/ARCHITECTURE.md`
7. `docs/BUILD_CHECKLIST.md`
8. `docs/DEMO_AND_SUBMISSION.md`

Use the priority order documented in `README_FIRST.md`.

## Product invariant

Synapse is a **Spatial Knowledge Twin**, not a generic PDF summarizer, chatbot, or static mind-map generator.

The completed application must:

1. Transform educational material into a source-grounded concept graph.
2. Render one canonical graph in synchronized 2D and 3D views.
3. test learners with free-response active recall.
4. Update probabilistic mastery from learner evidence.
5. Propagate prerequisite risk through the graph.
6. Recommend and visualize a repair path.
7. Remain demonstrable when AI or document processing fails.

Do not remove these behaviors to reduce scope.

## Engineering requirements

- React + TypeScript + Vite.
- TypeScript strict mode.
- Tailwind CSS.
- One canonical graph model shared by both renderers.
- Zod validation at every untrusted-data boundary.
- No API secrets in browser bundles.
- OpenAI calls through server-side routes only.
- Deterministic preset and local fallback paths.
- IndexedDB persistence through Dexie.
- Unit, component, and end-to-end tests.
- Accessible keyboard behavior and reduced-motion support.
- Status must not be represented by color alone.
- User-facing errors must explain recovery actions.
- No pseudocode, placeholder buttons, fake upload flows, or unimplemented controls in the final application.

## Implementation behavior

- Inspect the repository before modifying it.
- Prefer reliable, boring architecture over unnecessary infrastructure.
- Build vertical slices so a complete preset study loop works early.
- Preserve citations and page numbers through ingestion.
- Validate and normalize model-produced graphs before rendering.
- Keep domain logic outside React components.
- Put expensive PDF or embedding work in Web Workers where practical.
- Lazy-load the 3D renderer.
- Use environment variables and `.env.example`.
- Keep the app functional without environment variables by using deterministic fallback data.

## Required commands

Create scripts for and run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Also run the application in a browser, inspect console errors, and exercise the acceptance-test demo flow.

## Completion rule

Do not state that the project is complete while any required acceptance criterion is unverified or failing.

At the end, create `docs/BUILD_STATUS.md` containing:

- Implemented requirements
- Deferred optional requirements
- Files and architecture created
- Commands executed
- Exact test results
- Browser verification results
- Known limitations
- Environment variables
- Deployment instructions
- Suggested Devpost demo sequence
