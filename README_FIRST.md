# Synapse Codex Build Pack

This folder is designed to be copied into the root of a new Git repository before asking Codex to build the application.

## Copy this structure into the repository

```text
your-repository/
├── AGENTS.md
├── CODEX_MASTER_PROMPT.md
├── .env.example
├── docs/
├── schemas/
└── seed/
```

The pack deliberately contains specifications rather than generated application code. Codex must create the application from these contracts.

## Source-of-truth order

When two instructions conflict, use this order:

1. `docs/ACCEPTANCE_TESTS.md`
2. `docs/SYNAPSE_BUILD_SPEC.md`
3. `docs/DATA_CONTRACTS.md`
4. `docs/AI_CONTRACTS_AND_PROMPTS.md`
5. `docs/DESIGN_SYSTEM.md`
6. `AGENTS.md`
7. `docs/BUILD_CHECKLIST.md`
8. Existing implementation

Acceptance tests rank first because observable behavior is the final definition of done.

## Recommended use

1. Create an empty Git repository.
2. Copy every file in this pack into the repository root.
3. Commit the specification pack:
   ```bash
   git add .
   git commit -m "docs: add Synapse build specification"
   ```
4. Open the repository in Codex.
5. Use GPT-5.6 in Codex, as required by the hackathon.
6. Paste the complete contents of `CODEX_MASTER_PROMPT.md`.
7. Let Codex implement and verify the project.
8. Review `docs/BUILD_STATUS.md`, which Codex is instructed to create.
9. Record the Codex session ID, commit history, and demo footage as evidence of Codex/GPT-5.6 usage.

## Important

A single autonomous run cannot mathematically guarantee a perfect implementation. This pack reduces ambiguity by giving Codex:

- A precise product definition
- Concrete architecture and file layout
- Exact schemas
- AI input/output contracts
- A deterministic demo dataset
- Testable acceptance criteria
- An ordered build checklist
- A final browser-based verification requirement

Codex must not claim completion if required checks fail.
