-- FAQ: 本リリース向けに正確な内容へ同期（アプリは faq-release-catalog を正本表示）
-- 既存シードの古い文言（SHOP準備中・ダッシュボード編集・有料は今後 等）を更新し、不足分を追加

-- 旧質問の文言更新
update public.support_faq_articles
set
  answer = $faq$Eldonia-Nex（エルドニア・ネクス）は、クリエイターとファンのための創作プラットフォームです。Gallery で作品を公開し、Lab で共同制作し、Shop で販売し、Events でチケット付きの催しを開き、Community で交流し、Works で Quest（制作依頼・協業）に挑戦できます。多言語表示と活動の可視化（EXP 等）を通じて、創作が次の機会や収益につながる Nexus を目指しています。$faq$,
  updated_at = now()
where category = 'getting_started'
  and question = 'Eldonia-Nex とは何ですか？';

update public.support_faq_articles
set
  answer = $faq$はい。Free プランでアカウントを作成でき、作品公開（上限あり）やコミュニティ参加など基本機能を利用できます。より多くの公開枠・Shop・イベント主催・Works などは Standard / Premium / Business の有料プランで拡張できます。プランの詳細は設定の「料金プラン」またはサインアップ時のプラン選択をご確認ください。$faq$,
  updated_at = now()
where category = 'getting_started'
  and question = 'アカウント登録は無料ですか？';

update public.support_faq_articles
set
  answer = $faq$主な収益の柱は次のとおりです。

・Shop: デジタル商品・グッズ等の販売（有料プランで出品。手数料は Standard 5% / Premium・Business 3%）
・Events: 有料チケットの販売（無料チケットも発行可）
・Works / Quest: 制作依頼・協業の報酬
・紹介プログラム: 有料会員が条件を満たす紹介で還元（詳細は紹介 FAQ・利用規約）

実績は EXP やポートフォリオ等で可視化され、次の依頼・販売につながります。出金・本人確認が必要な場合があります。$faq$,
  updated_at = now()
where category = 'getting_started'
  and question = 'クリエイターはどうやって収益を得られますか？';

update public.support_faq_articles
set
  answer = $faq$メールアドレスとパスワードが正しいか、大文字・小文字や全角・半角の違いをご確認ください。パスワードをお忘れの場合は、ログイン画面の「パスワードをお忘れの方」から再設定メールを送信できます。OAuth（Google / Discord / X 等）で登録した場合は、同じ方法でログインしてください。解決しない場合はお問い合わせフォームから「アカウント」カテゴリでご連絡ください。$faq$,
  updated_at = now()
where category = 'account'
  and question = 'ログインできない場合はどうすればよいですか？';

update public.support_faq_articles
set
  answer = $faq$ログイン後、設定（/settings）の「基本情報」から、表示名・ユーザー名・自己紹介・アバターなどを編集できます。旧ダッシュボードのプロフィール編集は設定へ統合されています。$faq$,
  updated_at = now()
where category = 'account'
  and question = 'プロフィールはどこで編集できますか？';

update public.support_faq_articles
set
  answer = $faq$対応形式の例は次のとおりです。

・画像: JPEG / PNG / GIF / WebP（端末により HEIC 等）
・動画: MP4 / MOV / WebM
・音声: MP3 / WAV / FLAC / M4A
・文書: PDF
・3D: GLB / GLTF

目安の上限: 通常ファイル約50MB、3Dモデル約100MB、サムネイル約5MB。投稿は設定の投稿ハブ、または Gallery の投稿導線から行えます。非ビジュアル作品ではサムネイルが必要な場合があります。$faq$,
  updated_at = now()
where category = 'gallery'
  and question = '作品はどのような形式で投稿できますか？';

update public.support_faq_articles
set
  answer = $faq$作品の公開設定がオンか、下書きのままになっていないかご確認ください。反映に数秒かかる場合があります。形式・容量上限、必須のサムネイル、プランの公開点数上限（Free は3点まで）もご確認ください。解決しない場合はお問い合わせから「GALLERY（作品）」カテゴリでご連絡ください。$faq$,
  updated_at = now()
where category = 'gallery'
  and question = '投稿した作品がギャラリーに表示されません';

update public.support_faq_articles
set
  answer = $faq$有料プラン、Shop の有料商品、有料イベントチケットなどは、Stripe 経由のカード決済などに対応しています（利用可能なカードブランドはチェックアウト画面の表示に従います）。¥0 のデジタル商品や無料イベントチケットは、Stripe を使わず取得できる場合があります。料金・領収の詳細は「請求・お支払い」カテゴリでお問い合わせください。$faq$,
  updated_at = now()
where category = 'billing'
  and question = '支払い方法は何が使えますか？';

update public.support_faq_articles
set
  answer = $faq$通常、平日 10:00〜18:00（JST）の受付を目安に、1〜2 営業日以内の初回返信を目指しています。アカウント停止・決済障害など緊急度の高い案件は優先対応します。チケット番号（ENX-YYYYMMDD-XXXXXX）を控えてください。メール: support@eldonia-nex.com$faq$,
  updated_at = now()
where category = 'support'
  and question = '問い合わせ後、どのくらいで返信がありますか？';

update public.support_faq_articles
set
  answer = $faq$ログイン済みの場合は、ヘルプの「マイチケット」（/help/tickets）から該当チケットを開き、追加メッセージを送信できます。未ログインで送信した場合は、同じメールアドレスから再度お問い合わせいただくか、アカウント作成後にサポートへチケット番号をお知らせください。$faq$,
  updated_at = now()
where category = 'support'
  and question = '問い合わせ内容を追加・返信したい';

-- 新規 FAQ（なければ追加）
insert into public.support_faq_articles (category, question, answer, sort_order)
select
  'billing',
  '料金プランには何がありますか？',
  $faq$主なプランは次のとおりです（税込表示の目安。最新は設定の料金プランをご確認ください）。

・Free（¥0/月）: 作品公開（3点まで）、コミュニティ、基本プロフィール
・Standard（¥800/月）: 無制限公開、Shop（手数料5%）、イベント参加・主催、カスタムプロフィール
・Premium（¥2,980/月）: Standard のすべて、Shop 手数料3%、Works の依頼・応募、分析、優先サポート
・Business（¥10,000/月）: 法人・チーム向け。導入はお問い合わせ

有料プランの支払いは Stripe 等の決済を利用します。料金・特典は告知により調整される場合があります。$faq$,
  1
where not exists (
  select 1 from public.support_faq_articles
  where question = '料金プランには何がありますか？'
);

insert into public.support_faq_articles (category, question, answer, sort_order)
select
  'billing',
  '紹介プログラム（紹介料）はどうなりますか？',
  $faq$Free 以外の有料プラン会員には、サインイン確定後に紹介コード・URL・QR が設定画面（紹介コード）で付与されます。

現行の還元方針: 紹介が成立し、被紹介者の対象となる有料利用が続く場合、紹介成立から3か月目以降、日本国内向けは対象額の10%、日本以外向けは15%を還元します（「永久」は条件を満たす期間に限ります）。

自作自演・循環紹介などの不正は禁止で、還元取消やアカウント措置の対象です。詳細は利用規約の紹介料条項と設定画面の表示を優先してください。$faq$,
  2
where not exists (
  select 1 from public.support_faq_articles
  where question = '紹介プログラム（紹介料）はどうなりますか？'
);

insert into public.support_faq_articles (category, question, answer, sort_order)
select
  'billing',
  'イベントチケットはどう購入・取得しますか？',
  $faq$イベント詳細ページから取得します。無料イベントは「無料チケットを取得」で即時発行されます。有料イベントはカート経由で Stripe 決済後に発行されます。取得済みチケットは「マイチケット」から確認・PDF 等の出力ができます。主催は設定の投稿からイベントを作成できます。$faq$,
  4
where not exists (
  select 1 from public.support_faq_articles
  where question = 'イベントチケットはどう購入・取得しますか？'
);
