import { isSupabaseConfigured, getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type HealthCheckResult = {
  name: string;
  ok: boolean;
  latencyMs: number;
  error?: string;
};

export type HealthReport = {
  status: HealthStatus;
  service: "eldonia-nex-frontend";
  version: string;
  environment: string;
  timestamp: string;
  totalLatencyMs: number;
  checks: HealthCheckResult[];
};

const SUPABASE_HEALTH_TIMEOUT_MS = 1500;

function resolveVersion(): string {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? process.env.npm_package_version ?? "unknown";
}

function resolveEnvironment(): string {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV;
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

async function checkSupabase(): Promise<HealthCheckResult> {
  const start = Date.now();

  if (!isSupabaseConfigured()) {
    return {
      name: "supabase",
      ok: false,
      latencyMs: Date.now() - start,
      error: "not_configured",
    };
  }

  try {
    const response = await fetch(`${getSupabaseUrl()}/auth/v1/health`, {
      method: "GET",
      headers: { apikey: getSupabasePublishableKey() },
      signal: AbortSignal.timeout(SUPABASE_HEALTH_TIMEOUT_MS),
      cache: "no-store",
    });

    return {
      name: "supabase",
      ok: response.ok,
      latencyMs: Date.now() - start,
      error: response.ok ? undefined : `http_${response.status}`,
    };
  } catch (error) {
    return {
      name: "supabase",
      ok: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : "fetch_failed",
    };
  }
}

export async function runHealthChecks(options?: { includeSupabase?: boolean }): Promise<HealthReport> {
  const started = Date.now();
  const includeSupabase = options?.includeSupabase ?? true;

  const checks: HealthCheckResult[] = [
    {
      name: "app",
      ok: true,
      latencyMs: 0,
    },
  ];

  if (includeSupabase) {
    checks.push(await checkSupabase());
  }

  const supabaseCheck = checks.find((check) => check.name === "supabase");
  let status: HealthStatus = "healthy";

  if (
    supabaseCheck &&
    !supabaseCheck.ok &&
    supabaseCheck.error !== "not_configured"
  ) {
    status = "degraded";
  }

  return {
    status,
    service: "eldonia-nex-frontend",
    version: resolveVersion(),
    environment: resolveEnvironment(),
    timestamp: new Date().toISOString(),
    totalLatencyMs: Date.now() - started,
    checks,
  };
}

export function healthHttpStatus(report: HealthReport): number {
  if (report.status === "unhealthy") return 503;
  return 200;
}
