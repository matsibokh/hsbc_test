export class CacheAdapter {
  async get(key) {
    throw new Error(`${this.constructor.name}.get() is not implemented`);
  }

  async set(key, value, ttlMs) {
    throw new Error(`${this.constructor.name}.set() is not implemented`);
  }

  async delete(key) {
    throw new Error(`${this.constructor.name}.delete() is not implemented`);
  }
}
