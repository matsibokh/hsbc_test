import { CitiesService } from "./cities.service.js";
import { CitiesController } from "./cities.controller.js";
import { createCitiesRouter } from "./cities.routes.js";

export function createCitiesModule({ geonamesClient, cache, cacheTtlMs }) {
  const citiesService = new CitiesService({
    geonamesClient,
    cache,
    cacheTtlMs,
  });
  const citiesController = new CitiesController(citiesService);

  return { path: "/cities", router: createCitiesRouter(citiesController) };
}
