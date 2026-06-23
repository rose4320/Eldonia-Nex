-- FAQ: 「Eldonia-Nex とは」を創作経済圏・収益循環を含む一般向けコピーに更新

update public.support_faq_articles
set
  answer =
    'Eldonia-Nex（エルドニア・ネクス）は、クリエイターが Quest（制作依頼・協業）に挑戦し、作品づくり・ファンとのつながり・販売・イベントをひとつの循環で楽しめる創作経済圏です。Gallery で作品を公開し、Shop や Events でファンと出会い、Works で Quest に応募したり依頼を受けたり、Community で交流できます。活動は EXP（経験値）や信用として可視化され、「挑戦が収益や次の機会につながる」Nexus を目指しています。',
  updated_at = now()
where category = 'getting_started'
  and question = 'Eldonia-Nex とは何ですか？';

insert into public.support_faq_articles (category, question, answer, sort_order)
select
  'getting_started',
  'クリエイターはどうやって収益を得られますか？',
  $faq$クリエイターの主な収益の柱は次のとおりです（※順次提供・拡充予定の機能があります）。

・Quest / Works：制作依頼・協業の報酬
・Shop：デジタル商品やグッズの販売
・Events：ライブ・ワークショップ・展示などのチケット収入
・ファンとのつながり：支援や継続的な購入

EXP やポートフォリオで実績が見える化されるため、信頼の蓄積が新しい依頼や販売機会につながります。料金プランや手数料の詳細は、今後の告知および「請求・お支払い」カテゴリの FAQ で順次お知らせします。$faq$,
  3
where not exists (
  select 1
  from public.support_faq_articles
  where category = 'getting_started'
    and question = 'クリエイターはどうやって収益を得られますか？'
);
