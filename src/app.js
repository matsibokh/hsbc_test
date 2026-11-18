import path from "node:path";
import express from "express";
import {
  notFoundHandler,
  errorHandler,
} from "./middlewares/error-handler.js";

export function createApp({ modules }) {
  const app = express();

  app.use(express.static(path.join(import.meta.dirname, "..", "public")));

  for (const { path: modulePath, router } of modules) {
    app.use(`/api${modulePath}`, router);
  }
  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
