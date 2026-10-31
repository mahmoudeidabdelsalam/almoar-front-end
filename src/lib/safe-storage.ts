type StorageKind = 'local' | 'session';

// In-memory fallback used when the browser blocks Web Storage
// (private mode, in-app browsers, strict privacy settings). Accessing
// window.localStorage / sessionStorage can throw a SecurityError there.
const memoryStore: Record<StorageKind, Map<string, string>> = {
  local: new Map(),
  session: new Map(),
};

function getStorage(kind: StorageKind): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function safeGetItem(kind: StorageKind, key: string): string | null {
  try {
    const storage = getStorage(kind);
    if (storage) return storage.getItem(key);
  } catch {
    // fall through to the in-memory value
  }
  return memoryStore[kind].get(key) ?? null;
}

export function safeSetItem(kind: StorageKind, key: string, value: string): void {
  memoryStore[kind].set(key, value);
  try {
    getStorage(kind)?.setItem(key, value);
  } catch {
    // storage is blocked or full; the in-memory value above is enough
  }
}
