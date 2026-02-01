/**
 * Multi-LLM Provider Abstraction
 *
 * Supports Gemini, Claude (Anthropic), OpenAI, and any OpenAI-compatible endpoint.
 * Each provider implements the same interface so the game logic is provider-agnostic.
 */

// --- Types ---

export type ProviderId = 'gemini' | 'claude' | 'openai' | 'openai-compatible';

export interface ProviderConfig {
    providerId: ProviderId;
    apiKey: string;
    model: string;
    baseUrl?: string; // For OpenAI-compatible endpoints (e.g. Ollama, LM Studio, OpenRouter)
}

export interface LLMResponse {
    text: string;
}

export interface ProviderInfo {
    id: ProviderId;
    name: string;
    description: string;
    defaultModel: string;
    models: string[];
    requiresBaseUrl: boolean;
    docsUrl: string;
}

// --- Provider Registry ---

export const PROVIDERS: ProviderInfo[] = [
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Google AI Studio / Gemini API',
        defaultModel: 'gemini-3-flash-preview',
        models: ['gemini-3-flash-preview', 'gemini-2.5-flash-preview', 'gemini-2.5-pro-preview'],
        requiresBaseUrl: false,
        docsUrl: 'https://aistudio.google.com/apikey',
    },
    {
        id: 'claude',
        name: 'Anthropic Claude',
        description: 'Claude via Anthropic API',
        defaultModel: 'claude-sonnet-4-20250514',
        models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250514', 'claude-opus-4-20250514'],
        requiresBaseUrl: false,
        docsUrl: 'https://console.anthropic.com/settings/keys',
    },
    {
        id: 'openai',
        name: 'OpenAI',
        description: 'ChatGPT / GPT-4 API',
        defaultModel: 'gpt-4o-mini',
        models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'o4-mini'],
        requiresBaseUrl: false,
        docsUrl: 'https://platform.openai.com/api-keys',
    },
    {
        id: 'openai-compatible',
        name: 'OpenAI-Compatible',
        description: 'OpenRouter, Ollama, LM Studio, or any OpenAI-compatible API',
        defaultModel: 'custom',
        models: [],
        requiresBaseUrl: true,
        docsUrl: '',
    },
];

// --- Storage ---

const STORAGE_KEY = 'mythic_realms_llm_config';

export const saveProviderConfig = (config: ProviderConfig): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const loadProviderConfig = (): ProviderConfig | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && parsed.providerId && parsed.apiKey) return parsed as ProviderConfig;
        return null;
    } catch {
        return null;
    }
};

export const clearProviderConfig = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};

// --- Unified LLM Call ---

export const callLLM = async (prompt: string, config: ProviderConfig): Promise<any> => {
    switch (config.providerId) {
        case 'gemini':
            return callGemini(prompt, config);
        case 'claude':
            return callClaude(prompt, config);
        case 'openai':
        case 'openai-compatible':
            return callOpenAI(prompt, config);
        default:
            throw new Error(`Unknown provider: ${config.providerId}`);
    }
};

// --- Provider Implementations ---

async function callGemini(prompt: string, config: ProviderConfig): Promise<any> {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const response = await ai.models.generateContent({ model: config.model, contents: prompt });
    const rawText = response.text;
    if (!rawText) throw new Error("No response text from Gemini.");
    return parseJSONResponse(rawText);
}

async function callClaude(prompt: string, config: ProviderConfig): Promise<any> {
    // Anthropic API requires server-side calls due to CORS.
    // We use a direct fetch approach — users may need a CORS proxy or browser extension.
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
        }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Claude API error (${response.status}): ${err}`);
    }
    const data = await response.json();
    const rawText = data.content?.[0]?.text;
    if (!rawText) throw new Error("No response text from Claude.");
    return parseJSONResponse(rawText);
}

async function callOpenAI(prompt: string, config: ProviderConfig): Promise<any> {
    const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${err}`);
    }
    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("No response text from OpenAI.");
    return parseJSONResponse(rawText);
}

// --- JSON Parser (shared) ---

function parseJSONResponse(rawText: string): any {
    // Strip markdown code fences if present
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
        throw new Error(`Could not find JSON in response: ${rawText.substring(0, 200)}`);
    }
    return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
}
