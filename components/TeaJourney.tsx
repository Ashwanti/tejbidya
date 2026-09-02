"use client";

import { useState } from "react";
import { STAGES } from "@/lib/journey";
import { Eyebrow, Figure } from "./ui";

/**
 * TEA JOURNEY
 * ----------------------------------------------------------------------------
 * The full six-stage walkthrough, used on /journey. Stage content comes from
 * lib/journey.ts, which the homepage summary also reads, so the two can never
 * describe the process differently.
 *
 * Only the active photograph is mounted (keyed, CSS cross-fade) rather than all
 * six stacked at opacity 0 — six full-bleed images behind a tab strip was the
 * single heaviest thing on the old site.
 */
export default function TeaJourney() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <div>
      {/* ---- Stage tabs ---- */}
      <div
        role="tablist"
        aria-label="Stages of tea production"
        className="-mx-5 flex overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0"
      >
        {STAGES.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.key}
              role="tab"
              aria-selected={on}
              aria-controls="journey-panel"
              onClick={() => setActive(i)}
              className={`group relative shrink-0 px-4 pb-3.5 pt-1 text-left transition-colors duration-300 first:pl-0 sm:flex-1 ${
                on ? "text-ink" : "text-ink-mute hover:text-ink-soft"
              }`}
            >
              <span className="t-meta block">{s.n}</span>
              <span className="mt-1.5 block whitespace-nowrap font-display text-[1.05rem] leading-tight sm:text-[1.15rem]">
                {s.title}
              </span>
              <span
                aria-hidden
                className={`absolute -bottom-px left-0 h-px bg-brass-600 transition-all duration-500 ease-[var(--ease-soft)] ${
                  on ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ---- Panel ---- */}
      <div
        id="journey-panel"
        role="tabpanel"
        key={stage.key}
        className="fade-swap mt-10 grid gap-8 lg:grid-cols-2 lg:gap-14"
      >
        <Figure
          image={stage.img}
          ratio="landscape"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="lg:aspect-[4/5]"
        />

        <div className="flex flex-col justify-center">
          <Eyebrow className="text-brass-600">{stage.sub}</Eyebrow>
          <h3 className="t-h2 mt-4">{stage.title}</h3>
          <p className="t-body mt-4 max-w-xl text-ink-soft">{stage.body}</p>

          <dl className="mt-7 border-t border-line">
            {stage.detail.map((d) => (
              <div
                key={d.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-3"
              >
                <dt className="t-meta text-ink-mute">{d.label}</dt>
                <dd className="t-h4 text-right">{d.value}</dd>
              </div>
            ))}
          </dl>

          {/* Prev / next. Keyboard users get the same control as the tabs above. */}
          <div className="mt-7 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={active === 0}
              className="link-draw text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
            >
              Previous
            </button>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <button
              type="button"
              onClick={() => setActive((a) => Math.min(STAGES.length - 1, a + 1))}
              disabled={active === STAGES.length - 1}
              className="link-draw text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
            >
              Next stage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
