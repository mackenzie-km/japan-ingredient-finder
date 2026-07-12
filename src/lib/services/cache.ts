// Module-level in-memory TTL cache. Fine for a single local dev process —
// not multi-instance-safe, would need Redis/etc. in a real deployment.
const store = new Map<string, { expiresAt: number; value: unknown }>();

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs = 15 * 60 * 1000): void {
  store.set(key, { expiresAt: Date.now() + ttlMs, value });
}
