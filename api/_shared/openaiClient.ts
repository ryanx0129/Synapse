import OpenAI from "openai";

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const timeout = Number(process.env.OPENAI_TIMEOUT_MS ?? 20_000);
  return new OpenAI({
    apiKey,
    timeout: Number.isFinite(timeout) ? timeout : 20_000,
    maxRetries: 0,
  });
}

export const configuredModel = () => process.env.OPENAI_MODEL?.trim() || "gpt-5.6";

export function safeErrorCategory(error: unknown) {
  if (error instanceof OpenAI.AuthenticationError) return "authentication";
  if (error instanceof OpenAI.RateLimitError) return "rate_limit";
  if (error instanceof OpenAI.APIConnectionTimeoutError) return "timeout";
  if (error instanceof OpenAI.APIError) return `provider_${error.status ?? "error"}`;
  return "invalid_response";
}

