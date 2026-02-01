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
        defaultModel: 'gemini-2.5-flash',
        models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'],
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
// Uses a single localStorage key with a ProviderState object containing all provider configs.
// Each provider's credentials are stored separately within the configs map.

const STORAGE_KEY = 'mythic_realms_llm_config';

type ProviderConfigMap = Partial<Record<ProviderId, ProviderConfig>>;

interface ProviderState {
    selectedProviderId?: ProviderId;
    configs: ProviderConfigMap;
}

const normalizeProviderState = (raw: any): ProviderState => {
    // Migrate from legacy single-config format
    if (raw && raw.providerId && raw.apiKey) {
        const legacyConfig = raw as ProviderConfig;
        return {
            selectedProviderId: legacyConfig.providerId,
            configs: { [legacyConfig.providerId]: legacyConfig },
        };
    }
    if (raw && raw.configs) {
        return {
            selectedProviderId: raw.selectedProviderId,
            configs: raw.configs || {},
        };
    }
    return { configs: {} };
};

const loadProviderState = (): ProviderState => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { configs: {} };
        return normalizeProviderState(JSON.parse(raw));
    } catch {
        return { configs: {} };
    }
};

const saveProviderState = (state: ProviderState): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const saveProviderConfig = (config: ProviderConfig): void => {
    const state = loadProviderState();
    state.configs[config.providerId] = config;
    state.selectedProviderId = config.providerId;
    saveProviderState(state);
};

export const loadProviderConfig = (): ProviderConfig | null => {
    const state = loadProviderState();
    if (!state.selectedProviderId) return null;
    return state.configs[state.selectedProviderId] || null;
};

/** Load saved credentials for a specific provider (without changing active provider) */
export const loadProviderCredentials = (providerId: ProviderId): ProviderConfig | null => {
    const state = loadProviderState();
    return state.configs[providerId] || null;
};

export const clearProviderConfig = (providerId?: ProviderId): void => {
    if (!providerId) {
        localStorage.removeItem(STORAGE_KEY);
        return;
    }
    const state = loadProviderState();
    delete state.configs[providerId];
    if (state.selectedProviderId === providerId) {
        state.selectedProviderId = undefined;
    }
    saveProviderState(state);
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
    if (config.providerId === 'openai-compatible' && !config.baseUrl?.trim()) {
        throw new Error('OpenAI-Compatible provider requires a Base URL (e.g. https://openrouter.ai/api/v1)');
    }
    const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
    };
    // OpenRouter requires HTTP-Referer and optionally X-Title
    if (config.providerId === 'openai-compatible') {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'Mythic Realms RPG';
    }
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`${config.providerId === 'openai-compatible' ? 'API' : 'OpenAI API'} error (${response.status}): ${err}`);
    }
    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("No response text from API.");
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
