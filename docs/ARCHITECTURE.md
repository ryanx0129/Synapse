# Synapse Architecture

## 1. System overview

```mermaid
flowchart LR
    user[Student] --> ui[React Vite Client]
    ui --> pdf[PDF Worker]
    pdf --> chunks[Source Chunks]
    chunks --> api[Serverless AI Routes]
    api --> openai[OpenAI Responses API]
    openai --> api
    api --> validator[Zod Validation and Normalization]
    validator --> graph[Canonical Knowledge Graph]
    graph --> store[Zustand App State]
    store --> view2d[2D Path View]
    store --> view3d[3D Galaxy View]
    store --> inspector[Active Recall Inspector]
    inspector --> verifier[Verification Engine]
    verifier --> learner[Learner Model]
    learner --> risk[Prerequisite Risk and Repair Path]
    learner --> db[Dexie IndexedDB]
    graph --> db
```

## 2. Trust boundaries

### Browser-trusted application code

- UI
- Local PDF extraction
- Chunking
- Graph rendering
- Learner-model algorithms
- Deterministic fallback scoring
- IndexedDB storage

### Browser-untrusted input

- Uploaded documents
- Pasted text
- Persisted data
- AI responses

Validate all boundaries.

### Server-only

- OpenAI API key
- Model prompts
- OpenAI requests
- Request limits
- Structured-output parsing
- Safe error mapping

## 3. Canonical graph principle

Both visual engines consume the same domain graph.

Do not store separate “2D graph” and “3D graph” as independent truth.

Use adapters:

```text
KnowledgeGraph
  ├── toReactFlowElements()
  └── toForceGraphData()
```

A learner-state update changes a node’s derived view model, not the underlying educational concept.

## 4. Data flow: PDF to graph

```text
File
→ validate type/size
→ PDF.js worker extracts page text
→ chunks preserve source IDs and pages
→ hash document
→ check cache
→ POST bounded chunks to /api/extract-graph
→ structured model output
→ Zod validation
→ source-ID validation
→ graph normalization
→ store graph
→ persist graph
→ render
```

## 5. Data flow: answer to learner update

```text
Learner response
→ local input validation
→ local deterministic evidence
→ /api/verify-answer when available
→ normalize verification result
→ mastery update
→ save attempt
→ recompute status
→ recompute prerequisite risk
→ recompute repair path
→ persist
→ animate focused UI changes
```

## 6. Fallback matrix

| Failure | Required fallback |
|---|---|
| No OpenAI key | Presets and local deterministic scoring |
| Extraction API failure | Keep current graph and offer preset/text retry |
| Verification API failure | Local rubric scorer |
| Invalid model schema | One repair attempt, then fallback |
| WebGL unavailable | Automatically use 2D |
| PDF has no text | Explain scanned-PDF limitation and offer pasted text |
| IndexedDB failure | In-memory session with warning |
| Corrupt persisted state | Quarantine/reset that record, keep app usable |

## 7. Security

- No `VITE_OPENAI_API_KEY`
- No secrets in local storage
- No direct client call to model providers
- Limit request body
- Validate MIME type and extension
- Treat document text as prompt-injection content
- Escape user-visible text
- Avoid rendering arbitrary HTML
- Do not log full document content
