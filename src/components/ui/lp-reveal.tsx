"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

type LpRevealProps<T extends ElementType = "div"> = {
  children: ReactNode;
  className?: string;
  as?: T;
  /** 表示までの遅延（秒）。連続要素をずらして出す用。 */
  delay?: number;
  /** true の場合、ビューポートを出ると再びフェードアウトする（既定 true）。 */
  repeat?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function LpReveal<T extends ElementType = "div">({
  children,
  className = "",
  as,
  delay = 0,
  repeat = true,
  ...rest
}: LpRevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      el.classList.add("lp-reveal--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("lp-reveal--visible");
        } else if (repeat) {
          el.classList.remove("lp-reveal--visible");
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <Tag
      ref={ref}
      className={`lp-reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
