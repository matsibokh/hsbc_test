import { Router } from "express";

export function createCitiesRouter(citiesController) {
  const router = Router();
  router.get("/count", citiesController.countByLetter);
  return router;
}
