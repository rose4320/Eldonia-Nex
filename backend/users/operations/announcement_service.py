"""Supabase 経由でユーザー告知を配信（service_role）"""

from __future__ import annotations

import os
from typing import Any

import requests


class SupabaseAnnouncementError(Exception):
    pass


def _supabase_config() -> tuple[str, str]:
    url = (
        os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or os.getenv("SUPABASE_URL")
        or ""
    ).rstrip("/")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or ""
    if not url or not key:
        raise SupabaseAnnouncementError(
            "Supabase が未設定です。.env に NEXT_PUBLIC_SUPABASE_URL と "
            "SUPABASE_SERVICE_ROLE_KEY を設定してください。"
        )
    return url, key


def _headers(key: str) -> dict[str, str]:
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }


def fetch_supabase_profile_ids(
    *,
    target: str,
    email: str | None = None,
) -> list[str]:
    """配信対象の Supabase profile id 一覧"""
    url, key = _supabase_config()
    params: dict[str, str] = {"select": "id,user_settings(notify_announcement)"}

    if target == "creators":
        params["is_creator"] = "eq.true"

    if target == "email":
        if not email:
            raise SupabaseAnnouncementError("メールアドレスを指定してください。")
        auth_url = f"{url}/auth/v1/admin/users"
        resp = requests.get(
            auth_url,
            headers=_headers(key),
            params={"email": email},
            timeout=30,
        )
        if resp.status_code >= 400:
            raise SupabaseAnnouncementError(
                f"ユーザー検索に失敗しました: {resp.text[:200]}"
            )
        users = resp.json().get("users") or resp.json()
        if isinstance(users, dict):
            users = users.get("users", [])
        if not users:
            raise SupabaseAnnouncementError(f"メール {email} のユーザーが見つかりません。")
        return [str(users[0]["id"])]

    rest_url = f"{url}/rest/v1/profiles"
    resp = requests.get(rest_url, headers=_headers(key), params=params, timeout=30)
    if resp.status_code >= 400:
        raise SupabaseAnnouncementError(
            f"プロフィール取得に失敗しました: {resp.text[:200]}"
        )
    rows = resp.json()
    ids: list[str] = []
    for row in rows:
        if not row.get("id"):
            continue
        settings_row = row.get("user_settings")
        if isinstance(settings_row, list):
            settings_row = settings_row[0] if settings_row else None
        if settings_row and settings_row.get("notify_announcement") is False:
            continue
        ids.append(str(row["id"]))
    return ids


def _filter_announcement_recipients(user_ids: list[str]) -> list[str]:
    if not user_ids:
        return []
    url, key = _supabase_config()
    resp = requests.get(
        f"{url}/rest/v1/user_settings",
        headers=_headers(key),
        params={
            "user_id": f"in.({','.join(user_ids)})",
            "select": "user_id,notify_announcement",
        },
        timeout=30,
    )
    if resp.status_code >= 400:
        return user_ids
    opted_out = {
        str(row["user_id"])
        for row in resp.json()
        if row.get("notify_announcement") is False
    }
    return [uid for uid in user_ids if uid not in opted_out]


def send_announcement(
    *,
    title: str,
    body: str,
    href: str | None,
    target: str,
    email: str | None = None,
    priority: str = "normal",
) -> int:
    """user_notifications に announcement を一括 INSERT。配信件数を返す。"""
    url, key = _supabase_config()
    user_ids = _filter_announcement_recipients(
        fetch_supabase_profile_ids(target=target, email=email)
    )
    if not user_ids:
        raise SupabaseAnnouncementError("配信対象ユーザーが 0 件です。")

    priority_value = "critical" if priority == "critical" else "normal"

    rows: list[dict[str, Any]] = []
    for user_id in user_ids:
        row: dict[str, Any] = {
            "user_id": user_id,
            "kind": "announcement",
            "title": title[:120],
            "body": body[:2000] if body else None,
            "priority": priority_value,
        }
        if href:
            row["href"] = href[:500]
        rows.append(row)

    rest_url = f"{url}/rest/v1/user_notifications"
    batch_size = 100
    sent = 0
    for i in range(0, len(rows), batch_size):
        chunk = rows[i : i + batch_size]
        resp = requests.post(
            rest_url,
            headers=_headers(key),
            json=chunk,
            timeout=60,
        )
        if resp.status_code >= 400:
            raise SupabaseAnnouncementError(
                f"告知送信に失敗しました ({resp.status_code}): {resp.text[:300]}"
            )
        sent += len(chunk)

    return sent


def preview_announcement(
    *,
    title: str,
    body: str,
    href: str | None,
    target: str,
    email: str | None = None,
    priority: str = "normal",
) -> list[dict[str, str]]:
    user_ids = _filter_announcement_recipients(
        fetch_supabase_profile_ids(target=target, email=email)
    )
    target_label = {
        "all": "全ユーザー",
        "creators": "クリエイター",
        "email": f"個別 ({email})",
    }.get(target, target)
    priority_label = (
        "最重要（Frontend モーダル）" if priority == "critical" else "通常（通知ベル）"
    )
    return [
        {"label": "配信先", "value": f"{target_label} — {len(user_ids)} 件"},
        {"label": "重要度", "value": priority_label},
        {"label": "タイトル", "value": title},
        {"label": "本文", "value": body or "（なし）"},
        {"label": "リンク", "value": href or "（なし）"},
    ]
