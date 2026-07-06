"use client";

import { useEffect } from "react";
import {
  hardReload,
  isRecoverableNavigationError,
  reloadOnceForChunkError,
} from "@/lib/navigation/chunk-error";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error("[eldonia] route error:", error.message, error.digest);

    if (isRecoverableNavigationError(error)) {
      reloadOnceForChunkError();
    }
  }, [error]);

  return (
    <div className="lp-page flex min-h-screen flex-col items-center justify-center px-6 py-16 text-[#f8f1df]">
      <div className="w-full max-w-md rounded-2xl border border-[#d6a84f]/30 bg-[#020817]/95 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="eldonia-eyebrow">Error</p>
        <h1 className="eldonia-heading mt-3 text-2xl">ページを読み込めませんでした</h1>
        <p className="eldonia-body mt-3 text-sm leading-7 text-[#d8c8a8]">
          通信状況や更新タイミングの影響で表示に失敗した可能性があります。再読み込みするか、前のページへ戻ってください。
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="eldonia-btn-primary text-xs"
            onClick={() => hardReload()}
          >
            再読み込み
          </button>
          <button
            type="button"
            className="eldonia-btn-ghost text-xs"
            onClick={() => window.history.back()}
          >
            戻る
          </button>
          <button
            type="button"
            className="eldonia-link text-xs"
            onClick={() => window.location.assign("/gallery")}
          >
            Gallery へ
          </button>
        </div>
        {error.digest && (
          <p className="eldonia-hint mt-4 text-[0.65rem]">Ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
