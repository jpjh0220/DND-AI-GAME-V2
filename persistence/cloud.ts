


import { doc, setDoc, onSnapshot, Firestore, DocumentSnapshot, Unsubscribe } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Player, World, LogEntry, Choice, Enemy } from '../types';
// FIX: Corrected import path to point to the index file within the directory.
import { appId } from '../firebase/index';

const MAX_LOG_ENTRIES = 50;

export const saveGame = async (db: Firestore, user: User, p: Player, w: World, l: LogEntry[], c: Choice[], v: string, enemy: Enemy | null) => {
    if (!user || !db) return;
    const logToSave = l.slice(-MAX_LOG_ENTRIES);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'saves', 'active'), { player: p, world: w, log: logToSave, choices: c, view: v, enemy: enemy, updatedAt: Date.now() });
};

export const subscribeToSave = (db: Firestore, user: User, callbacks: {
    onData: (data: any) => void;
}): Unsubscribe => {
    return onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'saves', 'active'), (d: DocumentSnapshot) => {
        if (d.exists()) {
            callbacks.onData(d.data());
        }
    });
};