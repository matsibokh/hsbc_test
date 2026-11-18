import { test } from "node:test";
import assert from "node:assert/strict";
import { CitiesService } from "../src/modules/cities/cities.service.js";
import { MemoryCacheAdapter } from "../src/utils/cache/memory-cache.adapter.js";

function createService(cities) {
  const geonamesClient = {
    calls: 0,
    async getLargestCities() {
      this.calls += 1;
      return cities;
    },
  };
  const service = new CitiesService({
    geonamesClient,
    cache: new MemoryCacheAdapter(),
    cacheTtlMs: 60_000,
  });
  return { service, geonamesClient };
}

const cities = [
  { name: "Shanghai", country: "China" },
  { name: "Chongqing", country: "China" },
  { name: "Chengdu", country: "China" },
  { name: "Cairo", country: "Egypt" },
  { name: "Rio de Janeiro", country: "Brazil" },
];

test("counts cities by first letter, case-insensitive", async () => {
  const { service } = createService(cities);

  const result = await service.countByFirstLetter("C");

  assert.equal(result.letter, "c");
  assert.equal(result.count, 3);
  assert.deepEqual(
    result.cities.map((c) => c.name),
    ["Chongqing", "Chengdu", "Cairo"],
  );
  assert.equal((await service.countByFirstLetter("r")).count, 1);
  assert.equal((await service.countByFirstLetter("z")).count, 0);
});

test("loads cities from GeoNames once and then uses the cache", async () => {
  const { service, geonamesClient } = createService(cities);

  await service.countByFirstLetter("c");
  await service.countByFirstLetter("r");

  assert.equal(geonamesClient.calls, 1);
});
