# Codex Prompt: Redesign README for Judges and Public Users

You are a senior open-source product marketer, technical writer, developer-relations engineer, and visual README designer.

Redesign this repository's `README.md` as a polished, judge-facing and public-facing product page for **Synapse: Spatial Knowledge Twin**.

## First: inspect the real project

Before editing the README:

1. Read `AGENTS.md` and all files under `docs/`.
2. Inspect the actual source code, package scripts, API routes, tests, deployment configuration, screenshots, and current README.
3. Run or inspect the documented verification results when practical.
4. Use only capabilities that are genuinely implemented.
5. Do not invent metrics, users, benchmarks, deployments, screenshots, integrations, or test results.
6. If a required fact is unavailable, use an honest clearly marked placeholder or omit the claim.

## Remove internal build-diary content

The public README must not contain:

- “Suggested two-minute-fifty-second demo”
- Recording scripts
- Narration timing
- Personal implementation diary language
- Internal Codex task instructions
- Build checklists intended only for the developer
- Unverified claims such as “production ready,” “zero latency,” or “100% accurate”
- Secrets, private URLs, session transcripts, or local machine paths

Keep detailed demo scripting in `docs/DEMO_AND_SUBMISSION.md`, not in the public README.

## README objective

Make the README function as:

1. A high-impact product landing page for judges
2. A clear technical overview for engineers
3. A reproducible testing guide
4. Evidence of thoughtful Codex and GPT-5.6 usage
5. A credible foundation for a future education product

The README should make the product understandable in the first 20 seconds.

## Required structure

Create a polished README using approximately this structure, adapting it to the real implementation:

### 1. Hero section

Include:

- Synapse name
- One-sentence value proposition
- Education Track badge
- Relevant technology badges
- Links for Live Demo, Demo Video, and Devpost when real URLs exist
- A high-quality hero screenshot or GIF when an asset exists
- A short statement such as:

  “Turn dense educational documents into a living map of what the material means, what the learner knows, and what to repair next.”

Do not use excessive badges.

### 2. The problem

Explain the specific user problem:

- Dense reading is linear
- Knowledge is prerequisite-based and interconnected
- Passive rereading creates an illusion of familiarity
- Learners often know that they are stuck but not which prerequisite caused the gap

Keep this concise and concrete.

### 3. The solution

Explain the two connected twins:

- Domain knowledge graph from the source
- Learner mastery graph from active-recall evidence

Include the core loop:

`Document -> Source-grounded graph -> Active recall -> Mastery update -> Prerequisite diagnosis -> Repair Path`

### 4. Product highlights

Use visually balanced subsections or a table for:

- 3D Galaxy exploration
- 2D prerequisite Path
- Source-grounded inspector
- Free-response verification
- Probabilistic mastery tracking
- Repair Path
- PDF/text ingestion
- Local persistence
- Deterministic fallback mode

Every feature description must match actual code.

### 5. Visual walkthrough

Add 4-7 screenshot panels with captions when assets exist:

- 3D Galaxy
- 2D Path
- Inspector with formula and citation
- Verification result
- Repair Path
- Upload flow
- Session summary

If screenshots do not exist, create a clearly named `docs/assets/README_ASSET_CHECKLIST.md` listing the exact screenshots needed. Do not add broken image links.

### 6. Why Synapse is different

Clearly distinguish it from generic:

- PDF summarizers
- Chatbots over notes
- Static mind maps
- Flashcard generators

The central differentiation is:

“Synapse models both the knowledge structure and the learner's evolving mastery, then uses prerequisite-aware diagnosis to recommend what to repair.”

Avoid attacking competitors by name.

### 7. How it works

Include a clean architecture diagram using Mermaid that accurately matches the code.

Cover:

- Local PDF extraction and page-aware chunking
- Server-side GPT-5.6 structured extraction
- Zod validation and normalization
- Canonical graph
- 2D/3D renderers
- Active-recall verifier
- Learner model
- IndexedDB persistence

Also include a second compact data-flow diagram for answer verification and Repair Path.

### 8. Learner-model explanation

Briefly explain:

- Mastery probability
- Correct, partial, and incorrect evidence
- Status thresholds
- Prerequisite risk
- Repair-path ranking

Include one formula only if it improves understanding. Do not turn the README into a research paper.

### 9. Built with Codex and GPT-5.6

This section is required for hackathon judging.

Explain truthfully:

- Where Codex accelerated architecture, implementation, testing, debugging, and documentation
- Which product and engineering decisions remained human-directed
- How GPT-5.6 is used inside the product
- Which deterministic fallbacks protect the demo
- How structured output and Zod validation prevent raw model output from reaching the UI

Do not claim Codex autonomously made decisions that were actually supplied by the project specification.

### 10. Quick start

Provide exact commands verified against the repository:

- Prerequisites
- Install
- Environment file
- Frontend-only mock/demo mode
- Full-stack mode
- Tests
- Production build

Explain that API keys are server-side and must never use a `VITE_` prefix.

### 11. Judge testing guide

Provide a concise deterministic 60-90 second path:

1. Load Machine Learning preset
2. Select Backpropagation
3. Switch 3D/2D
4. Submit the documented correct answer
5. Observe mastery update
6. Submit a partial Vanishing Gradients answer
7. Activate Repair Path
8. Reload and confirm persistence
9. Optionally upload the included sample PDF

Link to the included sample PDF using a valid repository-relative path.

### 12. Verification and quality

Report only actual results from code or `docs/BUILD_STATUS.md`:

- Lint
- Type check
- Unit tests
- Component tests
- E2E tests
- Production build
- Browser verification

Use real numbers only. If numbers are unavailable, provide commands rather than fabricated results.

### 13. Privacy and resilience

Explain:

- PDF text extraction is local
- Bounded chunks may be sent to the configured AI route
- API keys remain server-side
- Learner state is local by default
- AI or WebGL failure has a fallback path

### 14. Current scope

State the honest version boundary.

For example:

“Version 1.0 focuses on a reliable individual learning loop for text-based educational PDFs and pasted text. It is a hackathon release, not yet a replacement for a full learning-management system.”

### 15. Roadmap: from 1.0 to an education platform

Create a credible future roadmap grouped by horizon.

#### Near-term: stronger document intelligence

- Better layout-aware PDF reading
- Tables, diagrams, equations, and scanned-document OCR
- Multimodal figure-to-concept relationships
- Improved section detection and citation alignment
- Duplicate-concept resolution across chapters
- Incremental graph updates for larger documents

#### Near-term: smarter assessment

- More reliable semantic grading across paraphrases
- Misconception-specific rubrics
- Confidence calibration
- Multi-step questions and derivations
- Socratic hints that reveal less on early attempts
- Human/teacher override of AI verification
- Evaluation datasets for grading quality

#### Medium-term: deeper learner modeling

- Personalized knowledge-tracing parameters
- FSRS-based review scheduling
- Uncertainty-aware mastery estimates
- Cross-document prerequisite graphs
- Learning-path optimization
- Longitudinal progress analytics

#### Medium-term: teacher and classroom tools

- Teacher-authored concept graphs and rubrics
- Assignment and cohort dashboards
- Anonymous misconception analytics
- Curriculum standards mapping
- Export to LMS and flashcard formats
- Accessibility profiles and multilingual learning

#### Long-term: business-grade platform

- Secure accounts and organizational workspaces
- Privacy, retention, audit, and data-governance controls
- Scalable background ingestion
- Team administration and billing
- Model routing and cost controls
- Observability and evaluation pipelines
- Enterprise SSO and LMS integrations
- Mobile and offline applications

Present the roadmap as planned objectives, not implemented features.

### 16. Limitations

Include a concise, credible limitations section such as:

- Best with text-based PDFs
- Model-generated graphs require validation
- Free-response grading is educational guidance, not an authoritative assessment
- Very large documents may require chunked or incremental processing
- 3D performance depends on the device

### 17. Contributing, license, and acknowledgments

Include:

- Contributing guidance
- License
- Main open-source libraries
- Original sample-document declaration
- Appropriate third-party acknowledgments

## Visual quality requirements

- Use strong hierarchy and generous spacing.
- Prefer short paragraphs.
- Use tables only when they genuinely improve scanning.
- Use Mermaid diagrams and real screenshots.
- Keep badges restrained.
- Use callouts for “Why it matters,” “Judge quick test,” and “Version 1.0 scope.”
- Avoid walls of text.
- Ensure all relative links work.
- Ensure images have useful alt text.
- Verify the README renders correctly on GitHub.

## Final verification

Before completing:

1. Search the README for “Suggested two-minute-fifty-second demo” and remove it.
2. Search for internal diary or recording-script language and remove it.
3. Verify all commands against `package.json`.
4. Verify every feature claim against source code.
5. Verify all relative links and image paths.
6. Verify no secret or private path is present.
7. Ensure the roadmap is clearly labeled as future work.
8. Ensure the README explicitly describes Codex collaboration and GPT-5.6 product usage.
9. Ensure the README is compelling even if a judge reads only the hero, highlights, differentiation, and quick-test sections.

At completion, report:

- README sections created or rewritten
- Claims removed because they were unverified
- Missing visual assets
- Commands and links verified
- Any remaining placeholders
