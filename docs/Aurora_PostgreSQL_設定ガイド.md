# Aurora PostgreSQL 本番環境設定ガイド

## 概要
Eldonia-Nexプロジェクトの本番環境ではAmazon Aurora PostgreSQLを使用します。
このガイドでは、開発環境（ローカルPostgreSQL）から本番環境（Aurora PostgreSQL）への移行手順と設定方法を説明します。

## 1. Aurora PostgreSQLクラスターの作成

### 1.1 AWS マネジメントコンソールでの設定

1. **RDSコンソールにアクセス**
   - AWS Management Console → RDS → データベース → データベースの作成

2. **エンジンオプション**
   - エンジンタイプ: Amazon Aurora
   - エディション: PostgreSQL 互換
   - バージョン: PostgreSQL 17.x互換（最新の安定版）

3. **テンプレート**
   - 本番稼働用: 本番環境
   - 開発/テスト: 開発/テスト（コスト削減用）

4. **設定**
   - DBクラスター識別子: `eldonia-nex-production`
   - マスターユーザー名: `postgres`（または任意）
   - マスターパスワード: **強力なパスワードを設定**（AWS Secrets Managerに保存推奨）

5. **インスタンス構成**
   - **本番環境推奨**: db.r6g.large（2vCPU, 16GB RAM）以上
   - **開発/テスト**: db.t4g.medium（2vCPU, 4GB RAM）

6. **可用性と耐久性**
   - マルチAZ配置: **有効**（本番環境では必須）
   - リードレプリカ: 最低1つ（読み取り負荷分散用）

7. **接続**
   - VPC: プロジェクト用VPCを選択
   - パブリックアクセス: **なし**（セキュリティ上の理由）
   - VPCセキュリティグループ: アプリケーションサーバーからのアクセスのみ許可
   - ポート: 5432（デフォルト）

8. **追加設定**
   - 初期データベース名: `eldonia_nex`
   - バックアップ保持期間: 7日以上（本番環境では30日推奨）
   - 暗号化: **有効**（AWS KMS）
   - 拡張モニタリング: **有効**（60秒間隔推奨）
   - ログのエクスポート: PostgreSQL log, Upgrade log

## 2. セキュリティグループ設定

### 2.1 インバウンドルール

```
タイプ: PostgreSQL
プロトコル: TCP
ポート範囲: 5432
ソース: <アプリケーションサーバーのセキュリティグループID>
説明: Django backend access
```

### 2.2 アウトバウンドルール

デフォルト設定（すべてのトラフィックを許可）で可

## 3. 接続情報の取得

### 3.1 エンドポイント情報

Aurora作成後、以下のエンドポイントが利用可能になります:

- **クラスターエンドポイント（Writer）**: `eldonia-nex-production.cluster-xxxxx.ap-northeast-1.rds.amazonaws.com`
  - 用途: 書き込み操作（INSERT, UPDATE, DELETE）
  - Django設定の`HOST`にこのエンドポイントを使用

- **読み取りエンドポイント（Reader）**: `eldonia-nex-production.cluster-ro-xxxxx.ap-northeast-1.rds.amazonaws.com`
  - 用途: 読み取り専用操作（SELECT）
  - 必要に応じてDjangoのデータベースルーターで使用

## 4. Django設定の変更

### 4.1 環境変数設定

本番環境用の`.env.production`ファイルを作成:

```env
# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=eldonia_nex
DB_USER=postgres
DB_PASSWORD=<Secrets Managerから取得>
DB_HOST=eldonia-nex-production.cluster-xxxxx.ap-northeast-1.rds.amazonaws.com
DB_PORT=5432

# SSL設定
DB_SSL_MODE=require
DB_SSL_ROOT_CERT=/path/to/rds-ca-2019-root.pem

# Connection Pooling
DB_CONN_MAX_AGE=600
DB_CONN_HEALTH_CHECKS=True
```

### 4.2 settings.pyの更新

```python
import os
from pathlib import Path

# 本番環境判定
IS_PRODUCTION = os.getenv('ENVIRONMENT') == 'production'

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.getenv('DB_NAME', 'eldonia_nex'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': int(os.getenv('DB_CONN_MAX_AGE', 600)),
        'CONN_HEALTH_CHECKS': os.getenv('DB_CONN_HEALTH_CHECKS', 'True') == 'True',
        'OPTIONS': {
            'sslmode': os.getenv('DB_SSL_MODE', 'require'),
            'connect_timeout': 10,
        } if IS_PRODUCTION else {},
    }
}

# 読み取りレプリカ設定（オプション）
if IS_PRODUCTION and os.getenv('DB_READER_HOST'):
    DATABASES['reader'] = {
        **DATABASES['default'],
        'HOST': os.getenv('DB_READER_HOST'),
    }
```

### 4.3 データベースルーター（オプション）

読み取り/書き込み分離が必要な場合:

```python
# common/db_router.py
class ReaderRouter:
    """読み取りクエリをリードレプリカにルーティング"""
    
    def db_for_read(self, model, **hints):
        """読み取りはreaderデータベースへ"""
        if 'reader' in settings.DATABASES:
            return 'reader'
        return 'default'
    
    def db_for_write(self, model, **hints):
        """書き込みはdefault（Writer）へ"""
        return 'default'

# settings.py
DATABASE_ROUTERS = ['common.db_router.ReaderRouter']
```

## 5. SSL証明書の取得とインストール

### 5.1 RDS CA証明書のダウンロード

```bash
# AWS RDSのルート証明書をダウンロード
curl -o /etc/ssl/certs/rds-ca-2019-root.pem https://truststore.pki.rds.amazonaws.com/ap-northeast-1/ap-northeast-1-bundle.pem

# 権限設定
chmod 644 /etc/ssl/certs/rds-ca-2019-root.pem
```

### 5.2 Djangoでの証明書設定

```python
# settings.py
if IS_PRODUCTION:
    DATABASES['default']['OPTIONS']['sslrootcert'] = '/etc/ssl/certs/rds-ca-2019-root.pem'
```

## 6. データ移行手順

### 6.1 ローカル環境からのデータエクスポート

```bash
# 開発環境でデータをダンプ
cd c:\eldonia-nex\backend
python manage.py dumpdata \
  --natural-foreign \
  --natural-primary \
  --exclude contenttypes \
  --exclude auth.permission \
  --indent 2 \
  > initial_data.json
```

### 6.2 Aurora PostgreSQLへのマイグレーション

```bash
# 1. 本番環境変数を設定
export ENVIRONMENT=production
export DB_PASSWORD="<Secrets Managerから取得>"
export DB_HOST="eldonia-nex-production.cluster-xxxxx.ap-northeast-1.rds.amazonaws.com"

# 2. マイグレーション実行
python manage.py migrate

# 3. 多言語・多通貨の初期データロード
python manage.py load_localization_data

# 4. 為替レート更新
python manage.py update_exchange_rates

# 5. その他のデータロード（必要に応じて）
python manage.py loaddata initial_data.json
```

### 6.3 スーパーユーザー作成

```bash
# 本番環境用管理者アカウント
python manage.py createsuperuser
# Username: admin
# Email: admin@eldonia-nex.com
# Password: <強力なパスワード>
```

## 7. パフォーマンス最適化

### 7.1 接続プーリング

PgBouncerまたはAWS RDS Proxyの使用を推奨:

```bash
# RDS Proxyエンドポイント
DB_HOST=eldonia-nex-proxy.proxy-xxxxx.ap-northeast-1.rds.amazonaws.com
```

### 7.2 インデックス最適化

```sql
-- よく使用されるクエリに対するインデックス
CREATE INDEX CONCURRENTLY idx_users_email ON users_customuser(email);
CREATE INDEX CONCURRENTLY idx_events_organizer ON events_event(organizer_id);
CREATE INDEX CONCURRENTLY idx_exchange_rate_lookup ON localization_exchangerate(from_currency_id, to_currency_id, effective_date DESC);
```

### 7.3 接続タイムアウト設定

```python
# settings.py
DATABASES['default']['OPTIONS'].update({
    'connect_timeout': 10,
    'keepalives': 1,
    'keepalives_idle': 30,
    'keepalives_interval': 10,
    'keepalives_count': 5,
})
```

## 8. モニタリングとアラート

### 8.1 CloudWatch メトリクス監視

重要なメトリクス:
- CPUUtilization（目標: <70%）
- DatabaseConnections（接続数監視）
- FreeableMemory（メモリ使用率）
- ReadLatency / WriteLatency（レイテンシー）
- DiskQueueDepth（ディスクI/O待機）

### 8.2 アラート設定

```yaml
# CloudWatch Alarms
CPU使用率:
  閾値: 80%以上が5分継続
  アクション: SNS通知

接続数:
  閾値: 最大接続数の80%
  アクション: SNS通知 + Auto Scaling

レプリケーション遅延:
  閾値: 5秒以上
  アクション: SNS通知
```

### 8.3 スロークエリログ

```sql
-- Aurora PostgreSQLパラメータグループ設定
log_min_duration_statement = 1000  -- 1秒以上のクエリをログ
```

## 9. バックアップとリカバリ

### 9.1 自動バックアップ

- **保持期間**: 30日（本番環境推奨）
- **バックアップウィンドウ**: 02:00-03:00 JST（トラフィック最小時）
- **スナップショット**: 重要な変更前に手動スナップショット取得

### 9.2 ポイントインタイムリカバリ（PITR）

```bash
# AWS CLIでの復元例
aws rds restore-db-cluster-to-point-in-time \
  --source-db-cluster-identifier eldonia-nex-production \
  --db-cluster-identifier eldonia-nex-recovery-2024-01-15 \
  --restore-to-time "2024-01-15T10:30:00Z"
```

### 9.3 バックアップテスト

月次でバックアップからの復元テストを実施:

```bash
# 1. テスト用クラスター作成
# 2. 最新スナップショットから復元
# 3. アプリケーション接続テスト
# 4. データ整合性チェック
# 5. テストクラスター削除
```

## 10. セキュリティベストプラクティス

### 10.1 認証情報管理

```bash
# AWS Secrets Managerでの認証情報管理
aws secretsmanager create-secret \
  --name eldonia-nex/production/db \
  --secret-string '{
    "username": "postgres",
    "password": "<強力なパスワード>",
    "host": "eldonia-nex-production.cluster-xxxxx.ap-northeast-1.rds.amazonaws.com",
    "port": 5432,
    "dbname": "eldonia_nex"
  }'
```

### 10.2 IAM認証（オプション）

```python
# settings.py
import boto3

def get_db_password():
    """Secrets Managerから認証情報取得"""
    if IS_PRODUCTION:
        client = boto3.client('secretsmanager', region_name='ap-northeast-1')
        secret = client.get_secret_value(SecretId='eldonia-nex/production/db')
        return json.loads(secret['SecretString'])['password']
    return os.getenv('DB_PASSWORD')

DATABASES['default']['PASSWORD'] = get_db_password()
```

### 10.3 暗号化

- **保存時の暗号化**: AWS KMS（有効化必須）
- **転送時の暗号化**: SSL/TLS（sslmode=require）
- **バックアップ暗号化**: 自動的にKMSで暗号化

## 11. コスト最適化

### 11.1 インスタンスサイジング

```
開発/テスト環境:
- db.t4g.medium: 月額 $85
- 1インスタンスのみ

本番環境（推奨）:
- db.r6g.large: 月額 $290
- Writer 1台 + Reader 1台: 月額 $580
```

### 11.2 Reserved Instances

1年または3年の予約購入で最大60%のコスト削減:

```bash
# AWS CLIでの予約購入例
aws rds purchase-reserved-db-instances-offering \
  --reserved-db-instances-offering-id <offering-id> \
  --reserved-db-instance-id eldonia-nex-reserved-1 \
  --db-instance-count 2
```

### 11.3 Aurora Serverless v2（スケーラビリティ重視の場合）

```yaml
最小ACU: 0.5（約$0.12/時間）
最大ACU: 16（約$3.84/時間）
スケーリング: 自動（負荷に応じて）
```

## 12. デプロイメントチェックリスト

### 12.1 本番環境デプロイ前

- [ ] Aurora PostgreSQLクラスター作成完了
- [ ] セキュリティグループ設定完了
- [ ] SSL証明書ダウンロード・配置完了
- [ ] Secrets Managerで認証情報管理設定
- [ ] RDS Proxyまたはconnection pooling設定
- [ ] CloudWatchアラート設定完了
- [ ] バックアップポリシー設定完了
- [ ] IAMロールとポリシー設定完了

### 12.2 マイグレーション当日

- [ ] メンテナンスモード有効化
- [ ] 最終バックアップ取得
- [ ] `python manage.py migrate` 実行
- [ ] `load_localization_data` 実行
- [ ] `update_exchange_rates` 実行
- [ ] スーパーユーザー作成
- [ ] 接続テスト（Django管理画面アクセス）
- [ ] API動作確認（Postman/curlテスト）
- [ ] フロントエンド動作確認
- [ ] メンテナンスモード解除

### 12.3 デプロイ後24時間監視

- [ ] CloudWatchメトリクス確認（15分毎）
- [ ] アプリケーションログ監視
- [ ] エラー率確認
- [ ] レスポンスタイム測定
- [ ] データベース接続数監視

## 13. トラブルシューティング

### 13.1 接続エラー

**症状**: `could not connect to server`

**確認事項**:
1. セキュリティグループでポート5432が開いているか
2. VPC内からのアクセスか（パブリックアクセス無効の場合）
3. エンドポイントが正しいか（Writer/Readerの区別）
4. SSL証明書のパスが正しいか

```bash
# 接続テスト
psql -h eldonia-nex-production.cluster-xxxxx.ap-northeast-1.rds.amazonaws.com \
     -U postgres \
     -d eldonia_nex \
     -p 5432 \
     "sslmode=require"
```

### 13.2 パフォーマンス問題

**症状**: クエリが遅い

**診断**:
```sql
-- 実行中のクエリ確認
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- スロークエリ確認
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 13.3 接続プール枯渇

**症状**: `Too many connections`

**対策**:
1. `max_connections`パラメータ増加
2. RDS Proxy導入
3. アプリケーション側でconnection pooling強化

```python
# settings.py
DATABASES['default']['CONN_MAX_AGE'] = 600  # 10分
DATABASES['default']['CONN_HEALTH_CHECKS'] = True
```

## 14. 関連ドキュメント

- [PostgreSQL_移行手順書.md](./PostgreSQL_移行手順書.md) - ローカル環境でのPostgreSQL移行
- [03_データベース設計書.fixed.md](./03_データベース設計書.fixed.md) - データベーススキーマ詳細
- [11_開発環境ルール設定書.md](./11_開発環境ルール設定書.md) - 開発ルール

## 15. まとめ

このガイドに従うことで、Eldonia-Nexプロジェクトを安全かつ効率的にAurora PostgreSQL本番環境にデプロイできます。

**重要ポイント**:
- セキュリティ: SSL/TLS、Secrets Manager、VPC内配置
- 可用性: マルチAZ、リードレプリカ
- パフォーマンス: 接続プーリング、インデックス最適化
- 監視: CloudWatch、スロークエリログ
- バックアップ: 30日保持、PITR有効

**次のステップ**:
1. AWSアカウントでAurora PostgreSQLクラスター作成
2. Secrets Managerで認証情報設定
3. Django設定ファイル更新
4. ステージング環境でテストデプロイ
5. 本番環境デプロイ

---

**作成日**: 2024-01-15  
**バージョン**: 1.0  
**担当者**: Eldonia-Nex開発チーム
