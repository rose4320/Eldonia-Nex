import Link from "next/link";

const links = [
  { href: "/help", label: "ヘルプトップ" },
  { href: "/help/faq", label: "よくある質問" },
  { href: "/help/guides", label: "利用ガイド" },
  { href: "/help/contact", label: "お問い合わせ" },
  { href: "/help/tickets", label: "マイチケット" },
];

type HelpNavProps = {
  current: string;
};

export function HelpNav({ current }: HelpNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`eldonia-nav-link ${
            current === link.href ? "eldonia-nav-link-active" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
