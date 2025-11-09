-- PostgreSQL 15 初期化スクリプト (Aurora PostgreSQL compatible)
-- データベース: eldonia_nex_dev

-- Aurora PostgreSQL最適化設定
-- 本番環境では Aurora が自動で最適化するため、開発環境でも同様の設定を適用

-- 日本語対応の照合順序設定
CREATE COLLATION IF NOT EXISTS japanese (
    provider = icu,
    locale = 'ja-JP'
);

-- Aurora PostgreSQL拡張機能の有効化（開発環境用）
-- 本番Aurora環境では自動で利用可能
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE EXTENSION IF NOT EXISTS pg_buffercache;

-- パフォーマンス最適化のインデックス作成準備
-- これらは後でDjangoマイグレーションで作成されます

-- タイムゾーン設定（日本標準時）
SET timezone = 'Asia/Tokyo';

-- Aurora互換の設定
-- shared_preload_libraries は Aurora で自動設定されるため、開発環境では設定不要

-- ログ設定（開発環境用）
-- Aurora では CloudWatch Logs で管理されるため、ローカル開発用の設定
COMMENT ON DATABASE eldonia_nex_dev IS 'Eldonia-Nex Development Database (Aurora PostgreSQL compatible)';

-- 初期設定完了
SELECT 'PostgreSQL 15 initialization completed for Aurora compatibility' AS status;