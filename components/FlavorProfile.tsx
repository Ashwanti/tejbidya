"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE_AXES, type Profile } from "@/lib/teas";

/**
 * FLAVOUR PROFILE
 * ----------------------------------------------------------------------------
 * FORM. Five named axes, one tea, magnitude on each — that is "compare magnitude
 * across categories", which is a bar/meter, not a radar. A spider chart scales
 * area quadratically and makes an arbitrary axis order look meaningful.
 * Horizontal meters also survive a narrow phone, which a radar does not.
 *
 * COLOUR. One series, so one hue: the leaf green from the palette, with the
 * track a lighter step of the same ramp so the whole bar carries state.
 * Deliberately not colour-coded per tea — six earth-tone hues would fail CVD
 * separation against each other, and teas are identified by name anyway.
 *
 * ACCESSIBILITY. Every meter carries a text value beside it, so nothing depends
 * on reading a bar length; a table view is one click away; the fill animation is
 * suppressed under prefers-reduced-motion by the global rule.
 */

const MAX = 5;

/** Words rather than bare numbers — the values are indicative, not measured. */
const SCALE = ["—", "Very low", "Low", "Medium", "High", "Very high"] as const;

export default function FlavorProfile({
  profile,
  teaName,
}: {
  profile: Profile;
  teaName: string;
}) {
  const [shown, setShown] = useState(false);
  const [table, setTable] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Grow the bars once, when the chart scrolls into view, then stop observing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="t-h3">Flavour profile</h3>
        <button
          type="button"
          onClick={() => setTable((t) => !t)}
          aria-expanded={table}
          className="link-draw text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
        >
          {table ? "As chart" : "As table"}
        </button>
      </div>

      {table ? (
        /* ---------------------------------------------------- TABLE VIEW */
        <table className="mt-6 w-full border-collapse text-left">
          <caption className="sr-only">
            Indicative flavour profile for {teaName}, each axis scored out of {MAX}
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="t-meta py-2.5 text-ink-mute">
                Axis
              </th>
              <th scope="col" className="t-meta py-2.5 text-right text-ink-mute">
                Level
              </th>
              <th scope="col" className="t-meta py-2.5 text-right text-ink-mute">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {PROFILE_AXES.map((axis) => {
              const v = profile[axis.key];
              return (
                <tr key={axis.key} className="border-b border-line">
                  <th scope="row" className="py-2.5 text-[0.92rem] font-normal text-ink">
                    {axis.label}
                  </th>
                  <td className="py-2.5 text-right text-[0.92rem] text-ink-soft">{SCALE[v]}</td>
                  <td className="py-2.5 text-right text-[0.92rem] tabular-nums text-ink-soft">
                    {v} / {MAX}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        /* ---------------------------------------------------- CHART VIEW */
        <div className="mt-6 space-y-5">
          {PROFILE_AXES.map((axis, i) => {
            const v = profile[axis.key];
            const pct = (v / MAX) * 100;

            return (
              <div key={axis.key}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[0.85rem] text-ink" title={axis.hint}>
                    {axis.label}
                  </span>
                  <span className="text-[0.72rem] uppercase tracking-[0.1em] text-ink-mute">
                    {SCALE[v]}
                  </span>
                </div>

                {/* Meter. Track is a lighter step of the same green ramp. */}
                <div
                  className="relative mt-2 h-1.5 w-full overflow-hidden rounded-xs bg-leaf-100"
                  role="img"
                  aria-label={`${axis.label}: ${SCALE[v]}, ${v} out of ${MAX}`}
                >
                  {/* Hairline scale marks at each whole step. */}
                  <div aria-hidden className="absolute inset-0 flex">
                    {Array.from({ length: MAX - 1 }).map((_, k) => (
                      <span key={k} className="h-full flex-1 border-r border-paper" />
                    ))}
                    <span className="h-full flex-1" />
                  </div>

                  {/* Fill: square at the baseline, rounded at the data end. */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-r-[3px] bg-leaf-700 transition-[width] duration-[900ms] ease-[var(--ease-soft)]"
                    style={{ width: shown ? `${pct}%` : "0%", transitionDelay: `${i * 70}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/*
        Non-negotiable disclosure: these values are typical of the tea category,
        not laboratory or cupping measurements of Tejbidya's own lots.
      */}
      <p className="mt-6 border-t border-line pt-3.5 text-[0.78rem] leading-relaxed text-ink-mute">
        Indicative profile, typical of this style of tea — not a measured
        specification. Confirmed cupping notes for a specific lot are provided
        with samples.
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   STRENGTH METER
   A single ratio against a fixed limit — a meter, per the form heuristic, never
   a five-slice pie or a one-bar chart.
   -------------------------------------------------------------------------- */

export function StrengthMeter({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="t-meta text-ink-mute">Strength</span>
        <span className="t-h4">{label}</span>
      </div>
      <div className="mt-2.5 flex gap-1" role="img" aria-label={`Strength: ${label}, ${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-[1px] ${i < value ? "bg-leaf-700" : "bg-leaf-100"}`}
          />
        ))}
      </div>
    </div>
  );
}
