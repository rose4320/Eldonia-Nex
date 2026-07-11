"""Django Plan 変更後に Supabase へ自動同期する。"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def push_plans_after_admin_change(*, reason: str = "admin") -> str | None:
    """成功時は短いメッセージ、失敗時は None（ログのみ）。画面は止めない。"""
    try:
        from users.operations.sync_status import run_manual_plan_push

        outcome = run_manual_plan_push(reason=reason)
        if outcome.get("ok"):
            msg = outcome.get("message") or "Supabase 同期完了"
            logger.info(msg)
            return msg
        logger.warning("plan sync after admin change failed: %s", outcome.get("message"))
        return None
    except Exception as exc:  # noqa: BLE001 — admin UX: never block price save
        logger.warning("plan sync after admin change failed: %s", exc)
        return None
