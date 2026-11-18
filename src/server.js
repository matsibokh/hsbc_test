import { config } from "./config.js";
import { GeonamesClient } from "./clients/geonames.client.js";
import { MemoryCacheAdapter } from "./utils/cache/memory-cache.adapter.js";
import { createCitiesModule } from "./modules/cities/cities.module.js";
import { createApp } from "./app.js";

const geonamesClient = new GeonamesClient(config.geonames);
const cache = new MemoryCacheAdapter();

const app = createApp({
  modules: [
    createCitiesModule({
      geonamesClient,
      cache,
      cacheTtlMs: config.cities.cacheTtlMs,
    }),
  ],
});

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
