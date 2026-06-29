type LpSectionTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function LpSectionTitle({ children, className = "" }: LpSectionTitleProps) {
  return (
    <div className={`lp-section-title ${className}`}>
      <span className="lp-section-title__line" aria-hidden />
      <h2 className="lp-section-title__text font-display text-2xl font-semibold tracking-[0.12em] text-[#f8f1df] sm:text-3xl">
        <span className="lp-section-title__star" aria-hidden>
          ✦
        </span>
        {children}
        <span className="lp-section-title__star" aria-hidden>
          ✦
        </span>
      </h2>
      <span className="lp-section-title__line" aria-hidden />
    </div>
  );
}
