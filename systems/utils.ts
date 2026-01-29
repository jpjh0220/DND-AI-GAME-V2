import { World } from "../types";

export const formatCurrency = (c: number) => { 
    if (isNaN(c)) return "0c"; 
    const g = Math.floor(c / 10000); 
    const s = Math.floor((c % 10000) / 100); 
    const copper = c % 100;
    return `${g}g ${s}s ${copper}c`; 
};

export const getCurrentLocation = (facts: string[]): string => {
    for (let i = facts.length - 1; i >= 0; i--) {
        const fact = facts[i];
        if (fact.startsWith("Arrived at ")) {
            return fact.substring("Arrived at ".length);
        }
    }
    return "Unknown Realm";
};