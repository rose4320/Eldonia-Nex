type LpSectionRuleProps = {
  className?: string;
  variant?: "fade" | "simple" | "seal" | "ornate" | "compact" | "flourish";
};

/** Horizontal gold divider between LP sections. */
export function LpSectionRule({ className = "", variant = "fade" }: LpSectionRuleProps) {
  return (
    <div
      className={`lp-section-rule lp-section-rule--${variant} ${className}`}
      role="presentation"
      aria-hidden
    />
  );
}
