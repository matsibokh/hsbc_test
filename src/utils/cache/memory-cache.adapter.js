import { CacheAdapter } from "./cache.adapter.js";

export class MemoryCacheAdapter extends CacheAdapter {
  #entries = new Map(); // key -> { value, expiresAt }

  async get(key) {
    const entry = this.#entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.#entries.delete(key);
      return undefined;
    }
    return structuredClone(entry.value);
  }

  async set(key, value, ttlMs) {
    this.#entries.set(key, {
      value: structuredClone(value),
      expiresAt: Date.now() + ttlMs,
    });
  }

  async delete(key) {
    this.#entries.delete(key);
  }
}
