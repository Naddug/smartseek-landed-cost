import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const apiKey =
      process.env.AI_INTEGRATIONS_OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "sk-dummy" || apiKey.startsWith("sk-your") || apiKey.length < 20) {
      throw new Error(
        "OpenAI API key not configured. Add OPENAI_API_KEY=sk-... to your .env file. Get a key at https://platform.openai.com/api-keys"
      );
    }

    _client = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
    });
  }

  return _client;
}
