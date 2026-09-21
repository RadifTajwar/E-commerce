/**
 * Typed, safe localStorage helpers for non-sensitive browser state
 * (cart contents, UI preferences). Never store tokens here.
 * Every call is guarded so SSR and privacy modes cannot throw.
 */

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage disabled: ignore
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
