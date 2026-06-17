import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type HelpNavProps = {
  current: string;
};

export async function HelpNav({ current }: HelpNavProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);

  const links = [
    { href: "/help", label: t.help.heading },
    ...t.help.links.map((link) => ({ href: link.href, label: link.title })),
  ];

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
