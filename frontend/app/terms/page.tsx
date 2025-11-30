"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-gray-950 to-purple-950 py-10">
      <div className="w-full max-w-2xl bg-linear-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-200 drop-shadow-lg font-pt-serif">利用規約</h1>
        <div className="text-gray-200 text-sm space-y-6 font-noto-sans-jp">
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第1条（総則）</h2>
            <p>
              本規約は、Eldonia-Nex（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意の上、本サービスを利用するものとします。
              本サービスの利用には、別途定めるプライバシーポリシーが適用されます。
              本サービスは、予告なく内容の変更・一時停止・終了する場合があります。
              規約変更や重要事項は、サイト上または登録メールアドレス宛に通知します。
              本規約の準拠法は日本法とし、紛争が生じた場合は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第2条（アカウント登録）</h2>
            <p>
              ユーザーは、正確な情報をもってアカウント登録を行うものとし、虚偽の情報登録は禁止します。
              未成年者は、保護者の同意を得た上で本サービスを利用してください。
              外部サービス（SNS認証等）を利用する場合は、各サービスの規約も適用されます。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第3条（禁止事項・ペナルティ）</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>他者の権利（著作権・肖像権・プライバシー等）を侵害する行為</li>
              <li>不正アクセス・スパム・詐欺・なりすまし・情報改ざん行為</li>
              <li>本サービスの運営・システムを妨害する行為</li>
              <li>犯罪行為（詐欺・脅迫・恐喝・窃盗・児童ポルノ・薬物・暴力・その他違法行為）</li>
              <li>悪意ある行動（誹謗中傷・ハラスメント・差別・脅迫・迷惑行為・荒らし・炎上目的・虚偽情報拡散）</li>
              <li>金銭トラブル・不正な金銭授受・マネーロンダリング・無許可の金融取引</li>
              <li>ユーザー間の揉め事・トラブル（取引・契約・連絡・納品・支払い等）に関して、当社は原則関与しませんが、悪質な場合は調査・対応・アカウント停止等の措置を行う場合があります。</li>
              <li>未成年者の不適切利用・保護者の同意なき利用</li>
              <li>その他、当社が不適切と判断する行為</li>
              <li>自動化ツール・ボット・スクレイピング・逆コンパイル等の技術的な不正利用</li>
              <li>外部サービス連携時の不正利用・規約違反</li>
            </ul>
            <div className="mt-4 text-sm text-red-300">
              <strong>ペナルティ・対応措置：</strong><br />
              上記禁止事項に該当する場合、当社は事前通知なく投稿削除・アカウント停止・強制退会・損害賠償請求・法的措置等を行うことができます。
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第4条（グループ機能・公平性・報酬制度）</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>グループ（チーム・サークル等）は、全メンバーの公平性・透明性を保つよう運営してください。</li>
              <li>グループリーダーは、グループ運営・報酬配分・メンバー管理等の責任を持ちます。<br />
                <span className="block mt-1 text-xs text-purple-200">【リーダー放棄の基準】</span>
                <ul className="list-disc pl-6 text-xs text-purple-200">
                  <li>30日以上の長期不在・活動停止</li>
                  <li>連絡不能・意思疎通不可（7日以上）</li>
                  <li>辞任の意思表明（チャット・DM・公式申請等）</li>
                  <li>グループ内の合意によるリーダー交代</li>
                  <li>その他、当社がリーダー放棄と認めた場合</li>
                </ul>
                リーダーが放棄・不在となった場合は、グループ内の話し合いにより新リーダーを決定し、当社へ申請してください。
              </li>
              <li>報酬制度はEXP（経験値）を中心に配分され、グループリーダーおよびメンバー同士の話し合いで配分方法を決定してください。配分に関するトラブルは、原則グループ内で解決するものとします。</li>
              <li>EXP配分ルールは、グループリーダー・メンバーの合意に基づき、当社が定める基準に従うものとします。</li>
              <li>不公平・不正な配分・リーダーの権限乱用等が発覚した場合、当社は調査・是正・アカウント停止等の措置を行う場合があります。</li>
            </ul>
            <div className="mt-4 text-sm text-purple-300">
              <strong>グループ運営・報酬配分の原則：</strong><br />
              グループ内の報酬（EXP等）は、リーダー・メンバー全員の話し合い・合意により公平に配分してください。トラブル時はまずグループ内で協議し、解決困難な場合は当社へ相談できます。
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第5条（免責事項・責任制限）</h2>
            <p>
              本サービスの利用・ユーザー間のトラブル・金銭取引・犯罪行為・悪意ある行動等により生じた損害について、当社は一切の責任を負いません。<br />
              ユーザーは自己責任で本サービスを利用するものとします。
              サービス障害・第三者要因・不可抗力（天災・戦争・法令改正等）による損害についても、当社は免責される場合があります。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第4条（知的財産権）</h2>
            <p>
              本サービス上のコンテンツの著作権は、当社または正当な権利者に帰属します。ユーザーは無断で利用できません。
              ユーザーが投稿・アップロードしたコンテンツの権利は、原則としてユーザーに帰属しますが、当社はサービス運営・広報等の目的で利用できるものとします。
            </p>
          </section>
            <section>
              <h2 className="text-lg font-bold text-purple-300 mb-2">第7条（返金ポリシー）</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>有料プラン・決済・サービス利用料等の返金は、原則として受け付けておりません。</li>
                <li>ただし、以下の場合は例外的に返金対応を行うことがあります：
                  <ul className="list-disc pl-6 text-xs text-purple-200">
                    <li>システム障害・サービス停止による利用不能</li>
                    <li>二重決済・誤請求・不正利用（第三者による不正アクセス等）</li>
                    <li>当社が特別に認めた場合</li>
                  </ul>
                </li>
                <li>返金申請はお問い合わせフォームより行い、申請内容・状況を詳細に記載してください。</li>
                <li>当社は申請内容を審査・確認し、返金可否・金額・方法等を決定します。</li>
                <li>返金時は決済手数料・振込手数料・その他事務手数料等を差し引く場合があります。</li>
                <li>ユーザー都合による返金（途中解約・利用停止・プラン変更等）は原則不可です。</li>
                <li>第三者決済サービス（Stripe等）利用時は、各サービスの返金規約も適用されます。</li>
                <li>返金に関するトラブル・疑義は、当社および決済サービスの規約に従い、誠実に協議・解決するものとします。</li>
              </ul>
              <div className="mt-4 text-sm text-purple-300">
                <strong>注意事項：</strong><br />
                返金申請は速やかに行い、虚偽申請・不正申請が発覚した場合はアカウント停止等のペナルティを課す場合があります。
              </div>
            </section>
                      <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第8条（Shop・ショップについて）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>本サービスのShop（ショップ）で販売・提供される商品・サービスの内容・価格・仕様・各種手数料（決済手数料・サービス利用料・送料等）は、各商品ページに明記します。</li>
              <li>表示価格は税込・送料・各種手数料等の条件を明記します。手数料の詳細はFAQ・特定商取引法表示等にも記載します。</li>
              <li>ショップ手数料：有料デジタルコンテンツ20％、リアル商品10％</li>
              <li>注文・契約成立・支払い・配送・返品・キャンセル等の条件は各商品ページに記載します。</li>
              <li>不正注文・転売目的・虚偽情報による注文等は禁止します。違反時は注文取消・アカウント停止等の措置を行う場合があります。</li>
              <li>商品・サービスの品質・納期・在庫等について、当社は合理的な範囲で責任を負いますが、天災・事故・第三者要因等による遅延・不達・損害については免責される場合があります。</li>
              <li>手数料は運営側の判断で変更される場合があります。変更時は事前に通知機能および登録メールアドレス宛に通知します。</li>
              <li>その他、ショップに関する手数料・条件は運営側が定め、詳細はFAQ等に記載します。</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第9条（WORKS・ワークスについて）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>WORKS（仕事・案件）の募集・応募・契約・納品・報酬等に関する機能です。</li>
              <li>募集内容・応募条件・契約方法・納品期限・報酬額・手数料（求人成立20％）等は、各WORKSページに明記します。</li>
              <li>契約成立後は、当社または依頼主・受注者間で定める条件に従い、納品・報酬支払い等を行います。</li>
              <li>虚偽応募・納品遅延・不正請求・著作権侵害・迷惑行為等は禁止します。違反時は契約取消・アカウント停止等の措置を行う場合があります。</li>
              <li>WORKSの内容・条件・報酬・手数料等は、予告なく変更・中止となる場合があります。変更時は事前に通知機能および登録メールアドレス宛に通知します。</li>
              <li>WORKS利用に伴うトラブル・損害等について、当社は合理的な範囲で責任を負いますが、天災・第三者要因等による損害については免責される場合があります。</li>
              <li>その他、WORKS運営・利用に関する詳細は、各WORKSページ・FAQ等に記載します。</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第10条（EVENT・イベントについて）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>EVENT（イベント）は、当社または提携団体が主催・運営します。</li>
              <li>イベントの内容・参加条件・申込方法・定員・参加費・手数料（成立20％）等は、各イベントページに明記します。</li>
              <li>申込後のキャンセル・変更は、イベントごとに定める条件に従い、原則として開催日前日まで受付可能です。詳細は各イベントページに記載します。</li>
              <li>無断キャンセル・虚偽申込・迷惑行為・イベント運営妨害等は禁止します。違反時は参加資格取消・アカウント停止等の措置を行う場合があります。</li>
              <li>イベントの内容・日程・会場・講師・手数料等は、予告なく変更・中止となる場合があります。変更時は事前に通知機能および登録メールアドレス宛に通知します。</li>
              <li>イベント参加に伴う事故・トラブル・損害等について、当社は合理的な範囲で責任を負いますが、天災・第三者要因等による損害については免責される場合があります。</li>
              <li>その他、イベント運営・参加に関する詳細は、各イベントページ・FAQ等に記載します。</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第11条（Liveについて）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Live配信・コンテンツに関する機能です。</li>
              <li>Live手数料：10％。その他の条件・手数料は各Liveページ・FAQ等に明記します。</li>
              <li>配信内容・参加条件・禁止事項・免責事項等は各Liveページに記載します。</li>
              <li>手数料・条件は運営側の判断で変更される場合があります。変更時は事前に通知機能および登録メールアドレス宛に通知します。</li>
              <li>その他、Liveに関する詳細は、各Liveページ・FAQ等に記載します。</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第12条（報酬制度について）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>有料ユーザー報酬は、各サービス・機能ごとに定める料率・条件に基づき分配されます。</li>
              <li>報酬の分配方法・支払時期・条件等は、各サービスページ・FAQ等に明記します。</li>
              <li>不正取得・虚偽申請・規約違反等が発覚した場合、報酬の取消・アカウント停止等の措置を行う場合があります。</li>
              <li>報酬制度の内容・料率・条件等は、運営側の判断で変更される場合があります。変更時は事前に通知機能および登録メールアドレス宛に通知します。</li>
            </ol>
          </section>
          <section>
            <h2 className="text-lg font-bold text-purple-300 mb-2">第13条（退会について）</h2>
            <ol className="list-decimal pl-6 space-y-1">
              <li>ユーザーはいつでも本サービスの退会申請を行うことができます。</li>
              <li>退会申請は、マイページの「プラン変更」から行ってください。</li>
              <li>退会後は、アカウント・投稿・購入履歴・報酬等のデータは原則として削除され、復元できません。</li>
              <li>退会後は「Freeユーザー」となり、有料プラン・有料機能の利用権限は失われます。</li>
              <li>退会後も、退会前に成立した契約・支払い・トラブル等に関する責任は免除されません。</li>
              <li>不正利用・規約違反・損害賠償請求等が発覚した場合、退会後も当社は必要な対応・法的措置を行う場合があります。</li>
              <li>退会に関する詳細は、FAQ・ヘルプページ等に記載します。</li>
            </ol>
          </section>
          </div>
        <div className="flex justify-center mt-8">
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={e => {
              e.preventDefault();
              window.location.href = "/register?plan=****";
            }}
          >
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              利用規約に同意する
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
