import {
  knowledgeGraphSchema,
  verificationResultSchema,
  type ConceptNode,
  type ExtractGraphRequest,
  type KnowledgeGraph,
  type VerificationResult,
} from "@/domain/graph/graphSchema";

interface GraphApiResponse {
  mode: "gpt" | "fallback";
  graph: KnowledgeGraph;
  warnings: string[];
  requestId?: string;
}

async function parseResponse(response: Response) {
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof body === "object" && body && "message" in body && typeof body.message === "string"
        ? body.message
        : "The AI service could not complete the request.";
    throw new Error(message);
  }
  return body;
}

export async function requestGraphExtraction(
  request: ExtractGraphRequest,
  signal?: AbortSignal,
): Promise<GraphApiResponse> {
  const body = await parseResponse(
    await fetch("/api/extract-graph", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
      ...(signal ? { signal } : {}),
    }),
  );
  if (typeof body !== "object" || !body || !("graph" in body) || !("mode" in body)) {
    throw new Error("The extraction service returned an invalid response.");
  }
  const graph = knowledgeGraphSchema.parse(body.graph);
  const mode = body.mode === "gpt" ? "gpt" : "fallback";
  const warnings = "warnings" in body && Array.isArray(body.warnings) ? body.warnings.map(String) : [];
  return { mode, graph, warnings };
}

export async function requestAnswerVerification(
  graphId: string,
  concept: ConceptNode,
  learnerAnswer: string,
  signal?: AbortSignal,
): Promise<VerificationResult> {
  const body = await parseResponse(
    await fetch("/api/verify-answer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        graphId,
        concept: {
          id: concept.id,
          label: concept.label,
          summary: concept.summary,
          question: concept.question,
          rubric: concept.rubric,
          sourceSpans: concept.sourceSpans,
        },
        learnerAnswer,
      }),
      ...(signal ? { signal } : {}),
    }),
  );
  return verificationResultSchema.parse(body);
}
