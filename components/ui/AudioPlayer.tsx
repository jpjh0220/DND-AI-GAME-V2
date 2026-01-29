

import React, { useState } from 'react';
import { RefreshCw, Volume2, AlertTriangle } from 'lucide-react';
// FIX: Corrected import path to point to the index file within the directory.
import { generateSpeech } from '../../api/index';

// --- UTILS ---
const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
};

const decodeAudioData = async (bytes: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
};

export const AudioPlayer: React.FC<{ text: string }> = ({ text }) => {
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);
    
    const playAudio = async () => {
        if (playing || loading) return;
        setLoading(true);
        setError(false);
        try {
            const base64 = await generateSpeech(text);
            if (base64) {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const bytes = decodeBase64(base64);
                const buffer = await decodeAudioData(bytes, ctx);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => setPlaying(false);
                source.start();
                setPlaying(true);
            }
        } catch (err) {
            console.error("TTS Error:", err);
            setError(true);
            setTimeout(() => setError(false), 3000); // Reset error state after 3s
        }
        setLoading(false);
    };

    const icon = error
        ? <AlertTriangle size={14} className="text-red-500" />
        : loading
        ? <RefreshCw size={14} className="animate-spin" />
        : <Volume2 size={14} />;

    return (
        <button onClick={playAudio} className={`p-1.5 rounded-full transition-all shrink-0 ${playing ? 'bg-indigo-500 text-white animate-pulse' : 'text-slate-500 hover:text-indigo-400'}`}>
            {icon}
        </button>
    );
};