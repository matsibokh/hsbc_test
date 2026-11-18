import { ExternalServiceError } from "../utils/errors.js";

export class GeonamesClient {
  #baseUrl;
  #username;
  #timeoutMs;

  constructor({ baseUrl, username, timeoutMs }) {
    this.#baseUrl = baseUrl;
    this.#username = username;
    this.#timeoutMs = timeoutMs;
  }

  async getLargestCities(limit = 50) {
    const body = await this.#search({
      featureClass: "P",
      maxRows: String(limit),
      orderby: "population",
    });
    return body.geonames.map((g) => ({
      name: g.name,
      country: g.countryName ?? null,
    }));
  }

  async #search(params) {
    const url = new URL("/searchJSON", this.#baseUrl);
    url.search = new URLSearchParams({
      ...params,
      username: this.#username,
    }).toString();

    let body;
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(this.#timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      body = await res.json();
    } catch (err) {
      throw new ExternalServiceError(
        "GeoNames",
        `GeoNames request failed: ${err.message}`,
      );
    }

    if (body.status) {
      throw new ExternalServiceError(
        "GeoNames",
        `GeoNames error: ${body.status.message}`,
      );
    }
    if (!Array.isArray(body.geonames)) {
      throw new ExternalServiceError(
        "GeoNames",
        'GeoNames response has no "geonames" array',
      );
    }
    return body;
  }
}
