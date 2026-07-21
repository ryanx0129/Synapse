# Synapse Acceptance Tests

Every “required” criterion below must be implemented and verified.

## A. Installation and build

- [ ] `npm install` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] `npm run typecheck` succeeds.
- [ ] `npm run test` succeeds.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:e2e` succeeds in the documented environment.
- [ ] No API secret appears in built frontend assets.
- [ ] README setup instructions work from a clean clone.

## B. Instant demo

- [ ] The application opens with the Machine Learning preset.
- [ ] The first meaningful UI appears without an API key.
- [ ] At least 20 meaningful ML concepts are present.
- [ ] Every preset node has summary, citation, question, and rubric.
- [ ] Every preset link references valid nodes.
- [ ] A visible indicator distinguishes preset/mock mode from AI-generated mode.

## C. Product navigation

- [ ] Header contains logo, preset selector, 2D/3D toggle, progress, and upload action.
- [ ] Search selects a concept.
- [ ] Cluster and status filters work.
- [ ] Recenter/fit controls work.
- [ ] The inspector opens and closes predictably.
- [ ] Desktop and narrow layouts remain usable.

## D. 2D and 3D synchronization

- [ ] 2D view renders the canonical graph.
- [ ] 3D view renders the canonical graph.
- [ ] Switching views preserves selected concept.
- [ ] Switching views preserves learner state.
- [ ] Switching views preserves filters.
- [ ] A mastery change appears in both views.
- [ ] WebGL failure produces a useful 2D fallback.

## E. Inspector and source grounding

- [ ] Selecting a concept displays its title and cluster.
- [ ] Summary is visible.
- [ ] KaTeX formula renders when present.
- [ ] Citation contains page/section.
- [ ] Source excerpt is visibly distinguished from generated explanation.
- [ ] Prerequisite and downstream relationships are accessible.
- [ ] Edge/relationship explanations can be inspected.

## F. Active recall

- [ ] Free-response text input is available.
- [ ] Empty answer cannot be submitted.
- [ ] Correct fixture answer returns `correct`.
- [ ] Incomplete fixture answer returns `partial`.
- [ ] Wrong or irrelevant fixture answer returns `incorrect`.
- [ ] Keyword-stuffed contradiction is not accepted as correct.
- [ ] Feedback identifies covered and missing ideas.
- [ ] Incorrect feedback provides a targeted hint.
- [ ] Request loading and retry states are visible.

## G. Learner model

- [ ] Correct evidence increases mastery.
- [ ] Incorrect evidence does not incorrectly create mastery.
- [ ] Partial evidence updates mastery proportionally.
- [ ] Probabilities remain bounded.
- [ ] Status derives from probability thresholds.
- [ ] An attempt record stores mastery before and after.
- [ ] Learner state persists after reload.
- [ ] Reset progress works after confirmation.

## H. Prerequisite risk and Repair Path

- [ ] Weak prerequisites increase downstream risk ranking.
- [ ] Risk does not overwrite mastery.
- [ ] Selecting a weak concept can produce a repair path.
- [ ] The path contains valid prerequisite-connected nodes.
- [ ] The UI explains why each recommended concept matters.
- [ ] Activating Repair Path highlights relevant nodes and edges.
- [ ] “Start repair” selects the first recommended concept.
- [ ] A concept without weak prerequisites has sensible fallback guidance.

## I. Document ingestion

- [ ] Text PDF upload works.
- [ ] Page numbers are preserved.
- [ ] Pasted plain text works.
- [ ] Pasted Markdown works.
- [ ] Invalid file type shows an actionable error.
- [ ] Oversized file shows an actionable error.
- [ ] Empty extracted text shows an actionable scanned-PDF message.
- [ ] Processing stages are visible.
- [ ] Duplicate document hash can reuse a cached graph.

## J. AI boundary

- [ ] AI requests use server-side routes.
- [ ] Graph output is schema validated.
- [ ] Model source IDs are checked against supplied chunks.
- [ ] Dangling links are removed.
- [ ] Invalid output triggers at most one bounded repair.
- [ ] Missing key, auth error, timeout, rate limit, and malformed output are handled.
- [ ] Degraded mode does not claim GPT processing.
- [ ] Automated tests do not call real external APIs.

## K. Persistence and privacy

- [ ] Graph and learner state are stored in IndexedDB when available.
- [ ] Learner preferences persist.
- [ ] IndexedDB failure falls back to in-memory operation.
- [ ] Privacy messaging explains local extraction and server-bound chunks.
- [ ] Raw API keys are never persisted in the browser.
- [ ] Local data can be reset.

## L. Accessibility

- [ ] Status has color, icon, and text.
- [ ] Core controls are keyboard operable.
- [ ] Concept search provides a keyboard-accessible path to selection.
- [ ] Focus is visible.
- [ ] Drawer/modal focus is managed.
- [ ] Form controls have labels.
- [ ] `prefers-reduced-motion` is honored.
- [ ] Major canvas functions have accessible names.

## M. Performance and resilience

- [ ] 3D bundle is lazy-loaded.
- [ ] Force simulation cools/stops.
- [ ] Labels are not all continuously rendered in 3D.
- [ ] A single mastery update does not rebuild unrelated domain data.
- [ ] Preset is usable with network disabled.
- [ ] Current graph remains available after a failed AI request.
- [ ] No uncaught high-severity console errors occur during the demo flow.

## N. Session summary

- [ ] Summary shows attempts.
- [ ] Summary shows newly mastered concepts.
- [ ] Summary shows correct/partial/incorrect distribution.
- [ ] Summary shows a high-risk gap.
- [ ] Summary recommends next study action.
- [ ] Celebration is limited to meaningful milestones.

## O. End-to-end judged flow

From a clean browser profile:

1. Open app.
2. Observe Machine Learning graph.
3. Switch between 3D and 2D.
4. Select Backpropagation.
5. Inspect formula and citation.
6. Submit a correct answer mentioning the chain rule.
7. Observe mastery increase and mastered status.
8. Select a weak downstream concept.
9. Activate Repair Path.
10. Observe prerequisite recommendation.
11. Reload and verify mastery persists.
12. Open text upload, submit sample text, and generate a graph in deterministic test mode.
13. Simulate AI failure and verify degraded mode without crash.

- [ ] This complete flow passes.
