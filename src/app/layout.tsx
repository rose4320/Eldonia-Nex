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
  title: "ELDONIA NEX",
  description:
    "A Fantasy Nexus for Creators — ファンを集め、作品を共有し、収益化する総合プラットフォーム",
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
