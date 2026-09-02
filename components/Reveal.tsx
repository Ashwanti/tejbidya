"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal.
 *
 * Uses a single IntersectionObserver per instance to add [data-reveal="visible"]
 * once, then disconnects - so there is no scroll handler and nothing running
 * after the element has appeared.
 *
 * The hiding is done in CSS (see globals.css). A `.no-js` class on <html> is
 * removed by an inline script in the layout, which means that if JavaScript
 * fails entirely the content stays visible rather than being stuck at opacity 0.
 * prefers-reduced-motion disables the transform and fade wholesale.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  /** Fraction of the element that must be visible before it reveals. */
  threshold = 0.12,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already past the fold on load, show it immediately -
    // avoids a flash of hidden content when the user lands mid-page.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "visible");
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
