/**
 * RAG (Retrieval-Augmented Generation) Memory System
 *
 * Stores game history entries (journal, codex, NPC interactions, world events)
 * as vectorized documents in a local store. When the AI needs context about
 * past events (e.g., an NPC from 20 sessions ago), the system retrieves
 * the most relevant memories via cosine similarity on TF-IDF vectors.
 *
 * Storage: IndexedDB for persistence across sessions.
 * Vectors: Lightweight TF-IDF with cosine similarity (no external dependencies).
 */

import { LogEntry, NPC, Player, World } from '../types';

// --- Types ---

export interface MemoryEntry {
    id: string;
    text: string;
    category: 'narration' | 'combat' | 'npc_interaction' | 'quest' | 'world_event' | 'discovery' | 'milestone' | 'location' | 'faction';
    tags: string[];          // searchable keywords: NPC names, locations, items, etc.
    timestamp: number;       // game day when this happened
    sessionDay: number;      // world.day
    sessionHour: number;     // world.hour
    vector?: number[];       // TF-IDF vector (computed on store)
}

export interface RetrievedMemory {
    entry: MemoryEntry;
    score: number;           // cosine similarity score
}

// --- TF-IDF Vectorizer ---

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet',
    'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'because', 'if', 'when', 'where',
    'while', 'how', 'what', 'which', 'who', 'whom', 'this', 'that',
    'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
    'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their',
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s'-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function buildVocabulary(documents: string[]): Map<string, number> {
    const vocab = new Map<string, number>();
    let idx = 0;
    for (const doc of documents) {
        for (const token of tokenize(doc)) {
            if (!vocab.has(token)) {
                vocab.set(token, idx++);
            }
        }
    }
    return vocab;
}

function computeTfIdfVector(text: string, vocab: Map<string, number>, idfScores: Map<string, number>): number[] {
    const tokens = tokenize(text);
    const tf = new Map<string, number>();
    for (const token of tokens) {
        tf.set(token, (tf.get(token) || 0) + 1);
    }
    const totalTokens = tokens.length || 1;

    const vector = new Array(vocab.size).fill(0);
    for (const [term, count] of tf) {
        const vocabIdx = vocab.get(term);
        if (vocabIdx !== undefined) {
            const tfScore = count / totalTokens;
            const idf = idfScores.get(term) || 1;
            vector[vocabIdx] = tfScore * idf;
        }
    }
    return vector;
}

function computeIdf(documents: string[], vocab: Map<string, number>): Map<string, number> {
    const docCount = documents.length;
    const idf = new Map<string, number>();
    const docFreq = new Map<string, number>();

    for (const doc of documents) {
        const uniqueTokens = new Set(tokenize(doc));
        for (const token of uniqueTokens) {
            docFreq.set(token, (docFreq.get(token) || 0) + 1);
        }
    }

    for (const [term] of vocab) {
        const df = docFreq.get(term) || 0;
        idf.set(term, Math.log((docCount + 1) / (df + 1)) + 1);
    }
    return idf;
}

function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
}

// --- IndexedDB Storage ---

const DB_NAME = 'mythic_realms_memory';
const DB_VERSION = 1;
const STORE_NAME = 'memories';

function openMemoryDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('category', 'category', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// --- Memory Store Class ---

export class MemoryStore {
    private entries: MemoryEntry[] = [];
    private vocab: Map<string, number> = new Map();
    private idfScores: Map<string, number> = new Map();
    private slotId: string;
    private dirty = false;

    constructor(slotId: string) {
        this.slotId = slotId;
    }

    /** Load all memories from IndexedDB for this save slot */
    async load(): Promise<void> {
        try {
            const db = await openMemoryDB();
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);

            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onsuccess = () => {
                    const all: MemoryEntry[] = request.result || [];
                    this.entries = all.filter(e => e.id.startsWith(this.slotId + '_'));
                    this.rebuildIndex();
                    resolve();
                };
                request.onerror = () => reject(request.error);
            });
        } catch (err) {
            console.warn('MemoryStore: Failed to load from IndexedDB, using empty store.', err);
            this.entries = [];
        }
    }

    /** Persist all dirty entries to IndexedDB */
    async save(): Promise<void> {
        if (!this.dirty) return;
        try {
            const db = await openMemoryDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            for (const entry of this.entries) {
                store.put(entry);
            }

            this.dirty = false;
        } catch (err) {
            console.warn('MemoryStore: Failed to save to IndexedDB.', err);
        }
    }

    /** Rebuild TF-IDF index from current entries */
    private rebuildIndex(): void {
        const documents = this.entries.map(e => e.text + ' ' + e.tags.join(' '));
        this.vocab = buildVocabulary(documents);
        this.idfScores = computeIdf(documents, this.vocab);

        // Recompute all vectors
        for (const entry of this.entries) {
            entry.vector = computeTfIdfVector(entry.text + ' ' + entry.tags.join(' '), this.vocab, this.idfScores);
        }
    }

    /** Add a new memory entry */
    addMemory(entry: Omit<MemoryEntry, 'id' | 'vector'>): void {
        const id = `${this.slotId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const fullText = entry.text + ' ' + entry.tags.join(' ');

        // Add to documents for vocabulary update
        const documents = this.entries.map(e => e.text + ' ' + e.tags.join(' '));
        documents.push(fullText);

        // Incrementally update vocabulary
        for (const token of tokenize(fullText)) {
            if (!this.vocab.has(token)) {
                this.vocab.set(token, this.vocab.size);
            }
        }

        // Recompute IDF with new document
        this.idfScores = computeIdf(documents, this.vocab);

        const vector = computeTfIdfVector(fullText, this.vocab, this.idfScores);

        const memoryEntry: MemoryEntry = {
            ...entry,
            id,
            vector,
        };

        this.entries.push(memoryEntry);
        this.dirty = true;

        // Periodically reindex (every 50 additions) for accuracy
        if (this.entries.length % 50 === 0) {
            this.rebuildIndex();
        }
    }

    /**
     * Retrieve the top-K most relevant memories for a given query.
     * Combines TF-IDF cosine similarity with tag matching and recency bonus.
     */
    retrieve(query: string, topK: number = 5, categoryFilter?: string): RetrievedMemory[] {
        if (this.entries.length === 0) return [];

        const queryVector = computeTfIdfVector(query, this.vocab, this.idfScores);
        const queryTokens = new Set(tokenize(query));
        const maxTimestamp = Math.max(...this.entries.map(e => e.timestamp), 1);

        const scored: RetrievedMemory[] = this.entries
            .filter(e => !categoryFilter || e.category === categoryFilter)
            .map(entry => {
                // Cosine similarity on TF-IDF vectors
                const cosineSim = entry.vector ? cosineSimilarity(queryVector, entry.vector) : 0;

                // Tag match bonus: if query tokens overlap with entry tags
                const tagOverlap = entry.tags.filter(t => queryTokens.has(t.toLowerCase())).length;
                const tagBonus = tagOverlap * 0.15;

                // Recency bonus: slight preference for more recent memories
                const recencyBonus = (entry.timestamp / maxTimestamp) * 0.05;

                const score = cosineSim + tagBonus + recencyBonus;

                return { entry, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        // Only return entries with meaningful relevance
        return scored.filter(s => s.score > 0.05);
    }

    /** Retrieve memories by specific tag (exact match) */
    retrieveByTag(tag: string, limit: number = 10): MemoryEntry[] {
        const tagLower = tag.toLowerCase();
        return this.entries
            .filter(e => e.tags.some(t => t.toLowerCase() === tagLower))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    /** Get total count of stored memories */
    get count(): number {
        return this.entries.length;
    }

    /** Clear all memories for this slot */
    async clear(): Promise<void> {
        try {
            const db = await openMemoryDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            for (const entry of this.entries) {
                store.delete(entry.id);
            }
        } catch (err) {
            console.warn('MemoryStore: Failed to clear IndexedDB entries.', err);
        }
        this.entries = [];
        this.vocab = new Map();
        this.idfScores = new Map();
    }
}

// --- Helper: Extract memories from game events ---

/** Convert a log entry into a memory entry for storage */
export function logEntryToMemory(entry: LogEntry, world: World, player: Player): Omit<MemoryEntry, 'id' | 'vector'> | null {
    const tags: string[] = [];

    // Extract NPC names, locations, etc. from the text
    if (player.activeNPC) {
        tags.push(player.activeNPC.name);
        if (player.activeNPC.factionAffiliation) tags.push(player.activeNPC.factionAffiliation);
    }

    // Add current location as tag
    const locationFact = world.facts.find(f => f.startsWith('Location:') || f.includes('currently in') || f.includes('arrived at'));
    if (locationFact) tags.push(locationFact);

    // Add player name for context
    tags.push(player.name);

    const categoryMap: Record<string, MemoryEntry['category']> = {
        'narration': 'narration',
        'combat': 'combat',
        'skillcheck': 'narration',
        'milestone': 'milestone',
        'worldevent': 'world_event',
        'levelup': 'milestone',
    };

    const category = categoryMap[entry.type] || 'narration';

    // Skip player input entries (they're just the raw action text)
    if (entry.type === 'player' || entry.type === 'error') return null;

    return {
        text: entry.text,
        category,
        tags,
        timestamp: Date.now(),
        sessionDay: world.day,
        sessionHour: world.hour,
    };
}

/** Build a context string from retrieved memories for injection into AI prompt */
export function formatRetrievedMemories(memories: RetrievedMemory[]): string {
    if (memories.length === 0) return '';

    const lines = memories.map((m, i) => {
        const dayInfo = `Day ${m.entry.sessionDay}`;
        const tagInfo = m.entry.tags.length > 0 ? ` [${m.entry.tags.slice(0, 3).join(', ')}]` : '';
        return `  ${i + 1}. (${dayInfo}${tagInfo}) ${m.entry.text.slice(0, 200)}${m.entry.text.length > 200 ? '...' : ''}`;
    });

    return `\nRELEVANT PAST MEMORIES (retrieved from game history):\n${lines.join('\n')}\n`;
}
