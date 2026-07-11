"""ユーザーの現在地（Supabase user_presence）を Admin 向けに取得。"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any

import requests


AREA_LABELS = {
    "home": "ホーム",
    "lp": "LP",
    "gallery": "Gallery",
    "lab": "Lab",
    "shop": "Shop",
    "community": "Community",
    "events": "Events",
    "works": "Works",
    "quest": "Quest",
    "portfolio": "Portfolio",
    "settings": "設定",
    "auth": "認証",
    "admin": "Admin",
    "notifications": "通知",
    "other": "その他",
}


def _supabase_config() -> tuple[str, str]:
    url = (
        os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or os.getenv("SUPABASE_URL")
        or ""
    ).rstrip("/")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or ""
    return url, key


def _area_label(area: str) -> str:
    return AREA_LABELS.get(area or "other", area or "その他")


def _seconds_ago(iso: str | None) -> int | None:
    if not iso:
        return None
    try:
        raw = iso.replace("Z", "+00:00")
        dt = datetime.fromisoformat(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return max(0, int((datetime.now(timezone.utc) - dt).total_seconds()))
    except Exception:  # noqa: BLE001
        return None


def _format_ago(seconds: int | None) -> str:
    if seconds is None:
        return "—"
    if seconds < 60:
        return f"{seconds}秒前"
    if seconds < 3600:
        return f"{seconds // 60}分前"
    return f"{seconds // 3600}時間前"


def get_live_user_presence(*, online_within_seconds: int = 180, limit: int = 40) -> dict[str, Any]:
    """直近 online_within_seconds 以内にハートビートしたユーザー一覧。"""
    url, key = _supabase_config()
    empty: dict[str, Any] = {
        "ok": False,
        "online_count": 0,
        "by_area": [],
        "users": [],
        "error": "",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "window_seconds": online_within_seconds,
    }
    if not url or not key:
        empty["error"] = "Supabase 未設定"
        return empty

    since = (datetime.now(timezone.utc) - timedelta(seconds=online_within_seconds)).isoformat()
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(
            f"{url}/rest/v1/user_presence",
            headers=headers,
            params={
                "select": "user_id,path,area,title,last_seen_at,is_authenticated",
                "last_seen_at": f"gte.{since}",
                "order": "last_seen_at.desc",
                "limit": str(limit),
            },
            timeout=8,
        )
        if not response.ok:
            empty["error"] = f"presence fetch {response.status_code}: {response.text[:160]}"
            return empty
        rows: list[dict[str, Any]] = response.json() or []
    except Exception as exc:  # noqa: BLE001
        empty["error"] = str(exc)
        return empty

    user_ids = [r["user_id"] for r in rows if r.get("user_id")]
    profiles: dict[str, dict[str, Any]] = {}
    if user_ids:
        try:
            # PostgREST: id=in.(uuid,uuid)
            id_list = ",".join(user_ids)
            pref = requests.get(
                f"{url}/rest/v1/profiles",
                headers=headers,
                params={
                    "select": "id,username,display_name,avatar_url,subscription_plan",
                    "id": f"in.({id_list})",
                },
                timeout=8,
            )
            if pref.ok:
                for p in pref.json() or []:
                    profiles[p["id"]] = p
        except Exception:  # noqa: BLE001
            pass

    area_counts: dict[str, int] = {}
    users: list[dict[str, Any]] = []
    for row in rows:
        area = row.get("area") or "other"
        area_counts[area] = area_counts.get(area, 0) + 1
        profile = profiles.get(row.get("user_id") or "", {})
        ago = _seconds_ago(row.get("last_seen_at"))
        display = (
            profile.get("display_name")
            or profile.get("username")
            or (row.get("user_id") or "")[:8]
        )
        users.append(
            {
                "user_id": row.get("user_id"),
                "display_name": display,
                "username": profile.get("username") or "",
                "avatar_url": profile.get("avatar_url") or "",
                "plan": profile.get("subscription_plan") or "free",
                "path": row.get("path") or "/",
                "area": area,
                "area_label": _area_label(area),
                "title": row.get("title") or "",
                "last_seen_at": row.get("last_seen_at") or "",
                "seconds_ago": ago,
                "ago_label": _format_ago(ago),
            }
        )

    by_area = [
        {"area": k, "label": _area_label(k), "count": v}
        for k, v in sorted(area_counts.items(), key=lambda x: (-x[1], x[0]))
    ]

    return {
        "ok": True,
        "online_count": len(users),
        "by_area": by_area,
        "users": users,
        "error": "",
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "window_seconds": online_within_seconds,
    }
