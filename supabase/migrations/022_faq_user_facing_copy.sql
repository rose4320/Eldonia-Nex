-- FAQ: 開発者向け表現を一般ユーザー向けに修正

update public.support_faq_articles
set
  answer = 'メールアドレスとパスワードが正しいかご確認ください。大文字・小文字や全角・半角の入力ミスにもご注意ください。パスワードをお忘れの場合は、ログイン画面の案内に従って再設定してください（機能準備中の場合はお問い合わせください）。解決しない場合はお問い合わせフォームから「アカウント」カテゴリでご連絡ください。',
  updated_at = now()
where category = 'account'
  and question = 'ログインできない場合はどうすればよいですか？';

update public.support_faq_articles
set
  answer = 'ログイン後、ダッシュボードの「プロフィール編集」から、表示名・ユーザー名・自己紹介を変更できます。',
  updated_at = now()
where category = 'account'
  and question = 'プロフィールはどこで編集できますか？';

update public.support_faq_articles
set
  answer = '作品の「公開」設定がオンになっているかご確認ください。アップロード直後は反映に数秒かかる場合があります。それでも表示されない場合は、対応しているファイル形式か、ファイルサイズが上限以内かをご確認ください。解決しない場合はお問い合わせフォームから「GALLEY（作品）」カテゴリでご連絡ください。',
  updated_at = now()
where category = 'gallery'
  and question = '投稿した作品がギャラリーに表示されません';

update public.support_faq_articles
set
  answer = 'ブラウザのキャッシュを削除するか、別のブラウザ・シークレット（プライベート）ウィンドウで再度お試しください。インターネット接続を確認し、ページを再読み込みしてください。問題が続く場合は、表示されているエラーメッセージとあわせてお問い合わせフォームから「技術的な問題」カテゴリでご連絡ください。',
  updated_at = now()
where category = 'technical'
  and question = 'ページが表示されない・エラーが出る';
