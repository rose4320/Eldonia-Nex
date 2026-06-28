# 管理画面（Admin）構成

**ベース URL**: https://eldonia-nex.com/admin  
**権限**: `profiles.is_ops_admin = true` または `QUEST_ADMIN_USER_IDS` 環境変数  
**最終更新**: 2026-06-23

---

## URL 構成

| パス | 説明 |
|------|------|
| `/admin` | ダッシュボード（未対応チケット数・最近の問い合わせ） |
| `/admin/support` | サポート受信箱（全チケット一覧） |
| `/admin/support/[id]` | チケット詳細 |
| `/works/manage` | Quest 管理（既存・admin からリンク） |

Django 旧管理（`/admin/operations/`）の代替として、Next.js + Supabase 上に段階的に移行します。

---

## アクセス制御

1. 未ログイン → `/auth/login?redirect_to=/admin/...`
2. ログイン済み・権限なし → `/?error=admin_forbidden`
3. 管理者 → 管理画面表示

判定ロジック: `src/lib/admin/require-admin.ts` → `isQuestAdmin()`（`is_ops_admin` フラグ）

---

## 関連ファイル

| パス | 説明 |
|------|------|
| `src/app/admin/` | 管理画面ルート |
| `src/components/admin/admin-nav.tsx` | サイドナビ |
| `src/lib/admin/require-admin.ts` | 認可ガード |
| `src/lib/supabase/admin.ts` | サービスロール（チケット全件取得） |

---

## 今後の拡張（予定）

- `/admin/settings` — 料金・手数料・お知らせ
- メール送信（さくら SMTP）・受信（IMAP）連携
- Django `/admin/` 機能の Supabase 移行

---

## Supabase Auth との関係

Auth の Redirect URL は引き続き `https://eldonia-nex.com/**`（ワイルドカード）を使用します。  
管理画面 `/admin/**` も同ワイルドカードに含まれます。Site URL は `https://eldonia-nex.com` のままです。
