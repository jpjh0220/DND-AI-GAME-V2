import React, { useState, useEffect } from 'react';
import { X, Key, Check, AlertTriangle, ExternalLink, Eye, EyeOff, Loader2, Trash2 } from 'lucide-react';
import { PROVIDERS, loadProviderConfig, saveProviderConfig, clearProviderConfig, loadProviderCredentials, callLLM } from '../api/providers';
import type { ProviderConfig, ProviderId } from '../api/providers';

interface SettingsProps {
    onClose: () => void;
    onConfigChange?: (config: ProviderConfig | null) => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({ onClose, onConfigChange }) => {
    const [providerId, setProviderId] = useState<ProviderId>('gemini');
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
    const [saved, setSaved] = useState(false);

    const providerInfo = PROVIDERS.find(p => p.id === providerId)!;

    useEffect(() => {
        const existing = loadProviderConfig();
        if (existing) {
            setProviderId(existing.providerId);
            setApiKey(existing.apiKey);
            setModel(existing.model);
            setBaseUrl(existing.baseUrl || '');
        }
    }, []);

    useEffect(() => {
        const info = PROVIDERS.find(p => p.id === providerId)!;
        // Load saved credentials for this specific provider
        const saved = loadProviderCredentials(providerId);
        if (saved) {
            setApiKey(saved.apiKey);
            setModel(saved.model || info.defaultModel);
            setBaseUrl(saved.baseUrl || '');
        } else {
            setApiKey('');
            setModel(info.defaultModel);
            setBaseUrl('');
        }
        setTestResult(null);
        setSaved(false);
    }, [providerId]);

    const buildConfig = (): ProviderConfig => ({
        providerId,
        apiKey: apiKey.trim(),
        model: model.trim(),
        ...(providerInfo.requiresBaseUrl && baseUrl.trim() ? { baseUrl: baseUrl.trim() } : {}),
    });

    const handleTest = async () => {
        if (!apiKey.trim()) { setTestResult({ ok: false, message: 'Enter an API key first.' }); return; }
        if (providerInfo.requiresBaseUrl && !baseUrl.trim()) { setTestResult({ ok: false, message: 'Enter a Base URL first (e.g. https://openrouter.ai/api/v1).' }); return; }
        setTesting(true);
        setTestResult(null);
        try {
            const config = buildConfig();
            const result = await callLLM('Respond with exactly this JSON and nothing else: {"test": true, "narration": "Connection successful."}', config);
            if (result && (result.test || result.narration)) {
                setTestResult({ ok: true, message: `Connected to ${providerInfo.name}` });
            } else {
                setTestResult({ ok: true, message: 'Connected (unexpected response format, but API works)' });
            }
        } catch (err: any) {
            setTestResult({ ok: false, message: err.message || 'Connection failed.' });
        }
        setTesting(false);
    };

    const handleSave = () => {
        if (!apiKey.trim()) return;
        if (providerInfo.requiresBaseUrl && !baseUrl.trim()) {
            setTestResult({ ok: false, message: 'Base URL is required for this provider.' });
            return;
        }
        const config = buildConfig();
        saveProviderConfig(config);
        setSaved(true);
        onConfigChange?.(config);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClear = () => {
        clearProviderConfig();
        setApiKey('');
        setModel(providerInfo.defaultModel);
        setBaseUrl('');
        setTestResult(null);
        setSaved(false);
        onConfigChange?.(null);
    };

    const canSave = apiKey.trim().length > 0 && model.trim().length > 0;

    return (
        <div className="absolute inset-0 bg-slate-950 flex flex-col z-30 animate-slide-in-from-bottom">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
                <h2 className="font-bold text-white uppercase tracking-tighter">Settings</h2>
                <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Provider Selection */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Key size={14}/> AI Provider
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {PROVIDERS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setProviderId(p.id)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    providerId === p.id
                                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <div className="text-sm font-bold">{p.name}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{p.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* API Key */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">API Key</label>
                        {providerInfo.docsUrl && (
                            <a
                                href={providerInfo.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
                            >
                                Get key <ExternalLink size={10}/>
                            </a>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type={showKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={e => { setApiKey(e.target.value); setSaved(false); setTestResult(null); }}
                            placeholder={`Enter your ${providerInfo.name} API key...`}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pr-10 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono"
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <button
                            onClick={() => setShowKey(!showKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            {showKey ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2">
                        Your key is stored locally in your browser. It never leaves your device except for API calls.
                    </p>
                </div>

                {/* Model Selection */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Model</label>
                    {providerInfo.models.length > 0 ? (
                        <div className="space-y-1.5">
                            {providerInfo.models.map(m => (
                                <button
                                    key={m}
                                    onClick={() => { setModel(m); setSaved(false); }}
                                    className={`w-full p-2.5 rounded-lg border text-left text-sm font-mono transition-all ${
                                        model === m
                                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={model}
                            onChange={e => { setModel(e.target.value); setSaved(false); }}
                            placeholder="Enter model name (e.g. mistralai/mistral-7b)"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono"
                        />
                    )}
                </div>

                {/* Base URL (for OpenAI-compatible) */}
                {providerInfo.requiresBaseUrl && (
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Base URL</label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={e => { setBaseUrl(e.target.value); setSaved(false); }}
                            placeholder="https://openrouter.ai/api/v1"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500 font-mono"
                        />
                        <p className="text-[10px] text-slate-600 mt-2">
                            The base URL for the OpenAI-compatible API endpoint (without /chat/completions).
                        </p>
                    </div>
                )}

                {/* Test Result */}
                {testResult && (
                    <div className={`p-3 rounded-xl border flex items-start gap-2 ${
                        testResult.ok
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}>
                        {testResult.ok ? <Check size={16} className="mt-0.5 shrink-0"/> : <AlertTriangle size={16} className="mt-0.5 shrink-0"/>}
                        <span className="text-sm">{testResult.message}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900 shrink-0">
                <div className="flex gap-2">
                    <button
                        onClick={handleTest}
                        disabled={!apiKey.trim() || testing}
                        className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                        {testing ? <Loader2 size={16} className="animate-spin"/> : <Key size={16}/>}
                        {testing ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                        onClick={handleClear}
                        className="py-3 px-4 bg-slate-800 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all active:scale-95"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className={`w-full py-4 font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        saved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                >
                    {saved ? <><Check size={18}/> Saved</> : <><Key size={18}/> Save Configuration</>}
                </button>
            </div>
        </div>
    );
};
