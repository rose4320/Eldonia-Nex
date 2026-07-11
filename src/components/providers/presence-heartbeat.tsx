"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { inferPresenceArea } from "@/lib/presence/areas";

const INTERVAL_MS = 45_000;

async function sendHeartbeat(path: string) {
  try {
    await fetch("/api/presence/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        area: inferPresenceArea(path),
        title: typeof document !== "undefined" ? document.title.slice(0, 200) : "",
      }),
      keepalive: true,
    });
  } catch {
    /* ignore — ops monitoring best-effort */
  }
}

/** Logged-in users report current path to ops live panel. */
export function PresenceHeartbeat() {
  const pathname = usePathname() || "/";
  const lastPath = useRef("");

  useEffect(() => {
    const path = pathname + (typeof window !== "undefined" ? window.location.search : "");
    lastPath.current = path;
    void sendHeartbeat(path);

    const timer = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      void sendHeartbeat(lastPath.current || path);
    }, INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat(lastPath.current || path);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname]);

  return null;
}
