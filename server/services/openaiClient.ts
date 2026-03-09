import OpenAI from "openai";

let _client: OpenAI | null = null;

/** API key validation - returns true if a valid key is configured */
function getValidApiKey(): string | null {
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "sk-dummy" || apiKey.startsWith("sk-your") || apiKey.length < 20) {
    return null;
  }
  return apiKey;
}

/** Check if OpenAI is configured (does not create client or throw) */
export function isOpenAIConfigured(): boolean {
  return getValidApiKey() !== null;
}

/** Get OpenAI client; throws if not configured */
export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey = getValidApiKey();
    if (!apiKey) {
      throw new Error(
        "OpenAI API key not configured. Add OPENAI_API_KEY or AI_INTEGRATIONS_OPENAI_API_KEY to your .env file. Get a key at https://platform.openai.com/api-keys"
      );
    }

    _client = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
    });
  }

  return _client;
}

/** Get OpenAI client or null if not configured (for optional AI features) */
export function getOpenAIClientOrNull(): OpenAI | null {
  if (!getValidApiKey()) return null;
  try {
    return getOpenAIClient();
  } catch {
    return null;
  }
}

/** Default model for complex tasks (reports, analysis) */
export const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/** Lightweight model for simple tasks (summaries, drafts) */
export const LIGHT_MODEL = process.env.OPENAI_LIGHT_MODEL || "gpt-4o-mini";

/** Get default model config for chat completions */
export function getDefaultChatOptions(options?: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  return {
    model: options?.model ?? DEFAULT_MODEL,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
  };
}

/** Accumulated token usage (for cost tracking) */
let _usageLog: { promptTokens: number; completionTokens: number; totalTokens: number } = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};

/** Log usage from a completion response */
export function logUsage(usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | null) {
  if (!usage) return;
  _usageLog.promptTokens += usage.prompt_tokens ?? 0;
  _usageLog.completionTokens += usage.completion_tokens ?? 0;
  _usageLog.totalTokens += usage.total_tokens ?? 0;
}

/** Get current usage stats */
export function getUsageLog() {
  return { ..._usageLog };
}

/** Reset usage log (e.g. at start of day) */
export function resetUsageLog() {
  _usageLog = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

/** Retry config for transient errors */
const RETRY_DELAYS = [1000, 2000, 4000];
const RETRYABLE_CODES = ["rate_limit_exceeded", "overloaded_error", "service_unavailable"];

/** Chat completion with retry and usage logging */
export async function chatWithRetry(
  params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming
): Promise<OpenAI.Chat.ChatCompletion> {
  const client = getOpenAIClient();
  const opts = getDefaultChatOptions();
  const merged = { ...opts, ...params };

  let lastError: Error | null = null;
  for (let i = 0; i <= RETRY_DELAYS.length; i++) {
    try {
      const response = await client.chat.completions.create(merged);
      logUsage(response.usage ?? null);
      return response;
    } catch (err) {
      lastError = err as Error;
      const code = (err as { code?: string })?.code;
      const isRetryable = RETRYABLE_CODES.includes(code || "") || (err as Error).message?.includes("rate limit");
      if (!isRetryable || i === RETRY_DELAYS.length) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAYS[i]));
    }
  }
  throw lastError;
}

/** Streaming chat completion helper - yields chunks */
export async function* streamChat(
  params: Omit<OpenAI.Chat.ChatCompletionCreateParams, "stream"> & { stream?: true }
): AsyncGenerator<OpenAI.Chat.Completions.ChatCompletionChunk> {
  const client = getOpenAIClient();
  const opts = getDefaultChatOptions();
  const merged = { ...opts, ...params, stream: true as const };

  const stream = await client.chat.completions.create(merged);
  for await (const chunk of stream) {
    yield chunk;
  }
}
