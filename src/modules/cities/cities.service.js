const INDEX_CACHE_KEY = "cities:largest:by-first-letter";

export class CitiesService {
  #geonamesClient;
  #cache;
  #cacheTtlMs;

  constructor({ geonamesClient, cache, cacheTtlMs }) {
    this.#geonamesClient = geonamesClient;
    this.#cache = cache;
    this.#cacheTtlMs = cacheTtlMs;
  }

  async countByFirstLetter(letter) {
    const key = letter.toLowerCase();
    const index = await this.#getIndex();
    const cities = Object.hasOwn(index, key) ? index[key] : [];
    return { letter: key, count: cities.length, cities };
  }

  async #getIndex() {
    const cached = await this.#cache.get(INDEX_CACHE_KEY);
    if (cached) return cached;

    const cities = await this.#geonamesClient.getLargestCities();
    const index = CitiesService.#buildIndex(cities);
    await this.#cache.set(INDEX_CACHE_KEY, index, this.#cacheTtlMs);
    return index;
  }

  static #buildIndex(cities) {
    const index = {};
    for (const city of cities) {
      if (!city.name) continue;
      const key = city.name.charAt(0).toLowerCase();
      (index[key] ??= []).push(city);
    }
    return index;
  }
}
