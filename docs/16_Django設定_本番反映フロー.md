# Eldonia-Nex — Django 管理設定 → 本番反映フロー

**目的**: 運用者が Django Admin で変えた設定が、どこまで・どうやって本番に届くかを一本化する。  
**担当**: Django Manager + DevOps  
**本番 FE**: https://eldonia-nex.com  
**ローカル Admin**: http://127.0.0.1:8000/admin/

---

## 全体像

```
┌─────────────────────┐
│ Django Admin (運用) │  料金・手数料・告知・プラン詳細
└──────────┬──────────┘
           │ 確認画面 + 管理人パスワードで確定
           ▼
┌─────────────────────┐
│ 自動 Push           │  plan_push / announcement_service
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ Supabase (正本の一部)│  subscription_plans / user_notifications / user_presence
└──────────┬──────────┘
           │ FE が都度読み取り（キャッシュなし）
           ▼
┌─────────────────────┐
│ 本番 Next.js        │  LP / 登録 / 設定プラン / 最重要モーダル
│ eldonia-nex.com     │
└─────────────────────┘
```

**原則**: 料金・告知など「データ」は **FE 再デプロイ不要**。  
**コード変更**（新機能・UI）だけ Vercel 本番デプロイが必要。

---

## A. データ変更（再デプロイ不要）

| 操作 | Admin 画面 | 確定後の行き先 | 本番での見え方 |
|------|------------|----------------|----------------|
| サブスク料金 | `/admin/operations/subscription-plans/` | `subscription_plans` | LP・登録・設定プラン |
| プラン詳細 | `/admin/operations/settings/plan-details/` | Django Plan + Supabase | 試用日数・公開 |
| 手数料・還元 | `/admin/operations/settings/fees/` | `ops_settings`（Django）※FE連携は段階的 | Admin KPI |
| 通常告知 | `/admin/operations/announcements/` | `user_notifications` | 🔔 ベル |
| **最重要告知** | 同上 + 最重要チェック | `priority=critical` | **Frontend モーダル** |
| 手動同期 | ダッシュボード「Supabase へ今すぐ同期」 | 同上 | 差分解消 |

### 料金変更の正しい手順（必須）

1. 括弧内の金額を編集（またはプリセット）
2. **確認画面へ →**
3. 差分確認 → **管理人パスワード** → **この内容で更新する**
4. 成功メッセージに「Supabase 同期完了」が出ること
5. 本番 LP をハードリロード（Ctrl+Shift+R）

> 1画面目に「保存」ボタンはない（設計）。確認＋パスワードが保存。

### うまくいかないとき

| 症状 | 対処 |
|------|------|
| Admin は変わったが LP が古い | ハードリロード。それでもダメならダッシュボードで手動同期 |
| 同期失敗メッセージ | `.env` の `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` |
| 確認画面に進めない | 金額が変更前と同じ → 「変更はありません」 |
| 本番だけ古い | **FE にライブ料金コードが未デプロイ** → セクション B |

---

## B. コード変更（Vercel 本番デプロイが必要）

次はデータ同期だけでは足りない。

- 新しい Admin 画面・モーダル UI
- `getLivePlanCatalog` など FE の読み取りロジック追加
- デザイン・コピー変更

### デプロイ手順（承認後）

```powershell
cd c:\eldonia-nex
npm run lint
npx vercel --prod --yes
```

または `main` へマージ → GitHub Actions（`frontend-deploy-production.yml`）。

**承認ゲート**: ユーザーが「はい」と明示したときのみ本番デプロイ。

---

## C. Django Admin 自体を出先から使う（常時）

ローカル `127.0.0.1:8000` は出先から届かない。

| 方式 | 文書 |
|------|------|
| クラウド常時（Railway 推奨） | [`15_Djangoクラウド常時デプロイ.md`](./15_Djangoクラウド常時デプロイ.md) |
| 一時トンネル | cloudflared / ngrok（開発PC起動中のみ） |

クラウド化後も **料金の正本フローは A と同じ**（Admin → Supabase → FE）。

---

## D. チェックリスト（運用）

### 料金を本番 LP に出す

- [ ] Admin で確認＋パスワードまで完了
- [ ] メッセージに Supabase 同期完了
- [ ] ダッシュボードのプラン同期が「同期済み」
- [ ] https://eldonia-nex.com/lp をハードリロード
- [ ] Business 等の金額が一致

### 最重要告知を本番モーダルに出す

- [ ] 告知で「最重要」ON → 確認 → 送信
- [ ] 対象ユーザーで本番にログイン
- [ ] モーダル表示 → 閉じる → 再表示されない

### コードを本番に出す

- [ ] ユーザー承認「はい」
- [ ] `npx vercel --prod`
- [ ] health / LP 確認

---

## E. 環境変数（本番 FE）

Vercel に少なくとも次があること（料金ライブ読み取り）:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`（または ANON）
- サーバー用: `SUPABASE_SECRET_KEY` または `SUPABASE_SERVICE_ROLE_KEY`（推奨）

Django（ローカル or Railway）:

- 同上 + `SUPABASE_SERVICE_ROLE_KEY`（Push 用）
- `DJANGO_ADMIN_USERNAME` / `DJANGO_ADMIN_PASSWORD`（スーパーユーザー作成用）

---

## F. 禁止・注意

- `.env` をコミットしない
- 確認画面をスキップする裏技を作らない（料金・告知は承認付き）
- カタログ初期値で Admin 料金を上書きしない（`_ensure_django_catalog` は get_or_create のみ）
