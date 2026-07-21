import type { VercelRequest, VercelResponse } from "@vercel/node";
import { zodTextFormat } from "openai/helpers/zod";
import { extractGraphRequestSchema, graphShapeSchema } from "../src/domain/graph/graphSchema";
import { normalizeGraph } from "../src/domain/graph/normalizeGraph";
import { createFallbackGraph } from "../src/domain/ingestion/fallbackGraph";
import { configuredModel, createOpenAIClient, safeErrorCategory } from "./_shared/openaiClient";
import { EXTRACTION_SYSTEM_PROMPT, extractionUserPrompt } from "./_shared/prompts";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Use POST for graph extraction." });
  }
  const parsed = extractGraphRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "The document payload is invalid or exceeds the safe demo limit.",
      issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
  }

  const fallback = (warning: string, requestId?: string) =>
    response.status(200).json({
      mode: "fallback",
      graph: createFallbackGraph(parsed.data),
      warnings: [warning],
      ...(requestId ? { requestId } : {}),
    });
  const client = createOpenAIClient();
  if (!client) return fallback("OPENAI_API_KEY is not configured; deterministic extraction was used.");

  const model = configuredModel();
  let repairMessage: string | undefined;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await client.responses.parse({
        model,
        input: [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: extractionUserPrompt(parsed.data, repairMessage) },
        ],
        text: { format: zodTextFormat(graphShapeSchema, "synapse_knowledge_graph") },
      });
      if (!result.output_parsed) throw new Error("The model returned no structured graph.");
      const allowedSourceIds = new Set(parsed.data.chunks.map((chunk) => chunk.id));
      const graph = normalizeGraph(result.output_parsed, { allowedSourceIds });
      if (graph.nodes.length === 0) throw new Error("No source-grounded concepts remained after validation.");
      return response.status(200).json({
        mode: "gpt",
        graph,
        warnings: graph.warnings,
        requestId: result.id,
      });
    } catch (error) {
      repairMessage = error instanceof Error ? error.message.slice(0, 600) : "Unknown validation error";
      if (attempt === 1) {
        return fallback(`GPT extraction degraded after one bounded repair attempt (${safeErrorCategory(error)}).`);
      }
    }
  }
  return fallback("GPT extraction was unavailable.");
}

