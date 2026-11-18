try {
  process.loadEnvFile();
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and set it.`,
    );
  }
  return value;
}

export const config = Object.freeze({
  port: Number(process.env.PORT) || 3000,
  geonames: Object.freeze({
    baseUrl: "http://api.geonames.org",
    username: requireEnv("GEONAMES_USERNAME"),
    timeoutMs: 5000,
  }),
  cities: Object.freeze({
    cacheTtlMs: 10 * 60 * 1000,
  }),
});
