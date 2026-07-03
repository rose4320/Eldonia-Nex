import type { Metadata } from "next";
import { Cinzel, Noto_Serif_JP } from "next/font/google";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { htmlLang } from "@/lib/i18n/content/messages";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Eldonia-Nex｜イラスト投稿・クリエイター求人・同人グッズ販売の総合プラットフォーム",
    template: "%s | Eldonia-Nex",
  },
  description:
    "イラスト・VTuber・ゲームクリエイター向けのクリエイターコミュニティ＆ポートフォリオサイト。作品投稿、求人応募、同人グッズ販売、VTuberイベント、コミュニティ交流まで、創作活動をひとつのNexusで。",
  icons: {
    apple: "/logo.png",
    icon: "/logo.png",
  },
  other: {
    google: "notranslate",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getUiLocale();

  return (
    <html
      lang={htmlLang(locale)}
      translate="no"
      className={`notranslate ${cinzel.variable} ${notoSerifJp.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
