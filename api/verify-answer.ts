import type { VercelRequest, VercelResponse } from "@vercel/node";
import { zodTextFormat } from "openai/helpers/zod";
import {
  verificationResultSchema,
  verifyAnswerRequestSchema,
  type VerificationResult,
} from "../src/domain/graph/graphSchema";
import { scoreAnswer } from "../src/domain/learning/answerScorer";
import { configuredModel, createOpenAIClient } from "./_shared/openaiClient";
import { VERIFICATION_SYSTEM_PROMPT, verificationUserPrompt } from "./_shared/prompts";

function enforceVerdict(result: VerificationResult): VerificationResult {
  const hasMisconception = result.misconceptions.length > 0;
  const verdict =
    result.score >= 0.78 && !hasMisconception && result.missingConcepts.length === 0
      ? "correct"
      : result.score >= 0.4 && !hasMisconception
        ? "partial"
        : "incorrect";
  return { ...result, mode: "gpt", verdict };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Use POST for answer verification." });
  }
  const parsed = verifyAnswerRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ message: "The answer request is invalid." });
  }
  const local = () => response.status(200).json(scoreAnswer(parsed.data.concept, parsed.data.learnerAnswer));
  const client = createOpenAIClient();
  if (!client) return local();
  try {
    const result = await client.responses.parse({
      model: configuredModel(),
      input: [
        { role: "system", content: VERIFICATION_SYSTEM_PROMPT },
        { role: "user", content: verificationUserPrompt(parsed.data) },
      ],
      text: { format: zodTextFormat(verificationResultSchema, "synapse_answer_verification") },
    });
    if (!result.output_parsed) return local();
    return response.status(200).json(enforceVerdict(result.output_parsed));
  } catch {
    return local();
  }
}

