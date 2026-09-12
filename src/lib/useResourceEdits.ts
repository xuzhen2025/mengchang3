import { useEffect, useState } from "react";

const RESOURCE_EDITS_EVENT = "mengchang-resource-edits-change";
function readEdits<T extends object>(scope: string): Record<string, Partial<T>> {
  try {
    const value = JSON.parse(window.sessionStorage.getItem(`mengchang-resource-edits-v1-${scope}`) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}

export function saveResourceEdits<T extends object>(scope: string, updates: Record<string, Partial<T>>): boolean {
  const next = readEdits<T>(scope);
  for (const [id, patch] of Object.entries(updates)) next[id] = { ...next[id], ...patch };
  try {
    window.sessionStorage.setItem(`mengchang-resource-edits-v1-${scope}`, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(RESOURCE_EDITS_EVENT, { detail: scope }));
    return true;
  } catch { return false; }
}

// Keep prototype edits across resource tabs without persisting media files.
export function useResourceEdits<T extends object>(scope: string) {
  const [edits, setEdits] = useState<Record<string, Partial<T>>>(() => readEdits<T>(scope));
  useEffect(() => {
    const refresh = (event: Event) => { if ((event as CustomEvent).detail === scope) setEdits(readEdits<T>(scope)); };
    window.addEventListener(RESOURCE_EDITS_EVENT, refresh);
    return () => window.removeEventListener(RESOURCE_EDITS_EVENT, refresh);
  }, [scope]);
  const saveEdits = (updates: Record<string, Partial<T>>) => {
    return saveResourceEdits<T>(scope, updates);
  };
  return { edits, saveEdits };
}
