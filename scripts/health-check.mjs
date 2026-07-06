#!/usr/bin/env node
/**
 * Eldonia-Nex frontend health check.
 * Usage: node scripts/health-check.mjs [baseUrl]
 * Example: node scripts/health-check.mjs https://eldonia-nex.com
 */

const baseUrl = (process.argv[2] ?? process.env.HEALTH_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const healthUrl = `${baseUrl}/api/health`;
const maxAttempts = Number(process.env.HEALTH_RETRIES ?? 5);
const retryDelayMs = Number(process.env.HEALTH_RETRY_DELAY_MS ?? 15000);
const timeoutMs = Number(process.env.HEALTH_TIMEOUT_MS ?? 20000);
const failOnDegraded = process.env.HEALTH_FAIL_ON_DEGRADED !== "0";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHealth() {
  const started = Date.now();
  const response = await fetch(healthUrl, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { Accept: "application/json" },
  });
  const body = await response.json();
  const clientLatencyMs = Date.now() - started;

  return { response, body, clientLatencyMs };
}

async function main() {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { response, body, clientLatencyMs } = await fetchHealth();
      const payload = { ...body, clientLatencyMs, url: healthUrl, attempt };

      console.log(JSON.stringify(payload, null, 2));

      if (!response.ok || body.status === "unhealthy") {
        process.exit(1);
      }

      if (body.status === "degraded" && failOnDegraded) {
        console.error("Health check degraded (Supabase or dependency issue).");
        process.exit(1);
      }

      process.exit(0);
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${attempt}/${maxAttempts} failed:`,
        error instanceof Error ? error.message : error,
      );
      if (attempt < maxAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error("Health check failed after retries:", lastError?.message ?? lastError);
  process.exit(1);
}

main();
