import Link from "next/link";
import { HelpNav } from "@/components/support/help-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const guides = [
  {
    title: "1. アカウントを作成する",
    steps: [
      "トップページの「新規登録」からメールアドレスとパスワードを入力",
      "確認メールが届いた場合はリンクをクリックして登録完了",
      "ログイン後、ダッシュボードからプロフィールを設定",
    ],
    link: { href: "/auth/signup", label: "新規登録へ" },
  },
  {
    title: "2. プロフィールを整える",
    steps: [
      "ダッシュボード → プロフィール編集を開く",
      "表示名・ユーザー名（@handle）・自己紹介を入力",
      "クリエイターとして活動する場合はチェックをオン",
    ],
    link: { href: "/dashboard/profile", label: "プロフィール編集へ" },
  },
  {
    title: "3. 作品を GALLEY に投稿する",
    steps: [
      "ギャラリー →「作品を投稿」をクリック",
      "画像・動画・音声・PDF をアップロード",
      "タイトル・説明・カテゴリ・タグを入力して投稿",
    ],
    link: { href: "/gallery/upload", label: "作品投稿へ" },
  },
  {
    title: "4. 困ったときはサポートへ",
    steps: [
      "まず FAQ で同様の事例がないか確認",
      "解決しない場合はお問い合わせフォームからチケット作成",
      "ログイン済みならマイチケットで進捗確認・追加返信が可能",
    ],
    link: { href: "/help/contact", label: "お問い合わせへ" },
  },
];

export default function GuidesPage() {
  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <section className="space-y-4">
          <h1 className="eldonia-heading eldonia-heading-lg">利用ガイド</h1>
          <p className="eldonia-body text-sm">
            Eldonia-Nex を始めるための基本的な流れをご案内します。
          </p>
          <HelpNav current="/help/guides" />
        </section>

        <section className="grid gap-6">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="eldonia-card"
            >
              <h2 className="font-display text-lg font-semibold tracking-wide text-eldonia-gold-light">{guide.title}</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-eldonia-text-muted">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <Link
                href={guide.link.href}
                className="mt-4 inline-block text-sm eldonia-link font-medium"
              >
                {guide.link.label} →
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
