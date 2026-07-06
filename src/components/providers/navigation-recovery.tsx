"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  clearChunkReloadGuard,
  isChunkLoadError,
  reloadOnceForChunkError,
} from "@/lib/navigation/chunk-error";

export function NavigationRecovery() {
  const router = useRouter();

  useEffect(() => {
    function handleError(event: ErrorEvent) {
      if (!isChunkLoadError(event.error ?? event.message)) return;
      reloadOnceForChunkError();
    }

    function handleRejection(event: PromiseRejectionEvent) {
      if (!isChunkLoadError(event.reason)) return;
      reloadOnceForChunkError();
    }

    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        router.refresh();
      }
      clearChunkReloadGuard();
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
