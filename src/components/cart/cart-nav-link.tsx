import Link from "next/link";

type CartNavLinkProps = {
  count: number;
  ariaLabel: string;
  className?: string;
};

export function CartNavLink({
  count,
  ariaLabel,
  className = "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-eldonia-text-muted transition hover:text-eldonia-gold-light",
}: CartNavLinkProps) {
  const label = count > 0 ? `${ariaLabel} (${count})` : ariaLabel;

  return (
    <Link href="/shop/cart" aria-label={label} title={label} className={className}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.25L21.5 7H6.2" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-eldonia-gold px-1 text-[10px] font-bold text-black">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
