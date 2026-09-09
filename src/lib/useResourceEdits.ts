import { useState } from "react";

// Keep prototype edits across resource tabs without persisting media files.
export function useResourceEdits<T extends object>(scope: string) {
  const key = `mengchang-resource-edits-v1-${scope}`;
  const [edits, setEdits] = useState<Record<string, Partial<T>>>(() => {
    try {
      const value = JSON.parse(window.sessionStorage.getItem(key) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  });
  const saveEdits = (updates: Record<string, Partial<T>>) => {
    const next = { ...edits };
    for (const [id, patch] of Object.entries(updates)) next[id] = { ...next[id], ...patch };
    try {
      window.sessionStorage.setItem(key, JSON.stringify(next));
      setEdits(next);
      return true;
    } catch {
      return false;
    }
  };
  return { edits, saveEdits };
}
