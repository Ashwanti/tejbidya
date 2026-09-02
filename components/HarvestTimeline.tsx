"use client";

import { useEffect, useState } from "react";
import {
  MONTHS,
  activeFlushes,
  regions,
  spansOf,
  type Flush,
  type Region,
} from "@/lib/regions";

/**
 * HARVEST TIMELINE
 * ----------------------------------------------------------------------------
 * When each region is actually picking, on one Jan–Dec track. For a buyer this
 * is the practical question the map cannot answer: a Darjeeling second flush
 * bought in February does not exist yet, and nobody wants to find that out in
 * an email thread.
 *
 * Two views over the same data — a strip for one region (beside the map) and a
 * chart of all seven (its own section). Both read from lib/regions.ts, so the
 * calendar can never drift from the prose describing it.
 *
 * The "now" marker is set after mount, never during render: these pages are
 * statically built, and a month baked in at build time would quietly go stale.
 */

const monthLabel = (m: number) => MONTHS[m - 1];

/** "Mar–Apr", or "Dec–Feb" where the window wraps the year. */
function describeRange(flush: Flush): string {
  return flush.from === 1 && flush.to === 12
    ? "All year"
    : `${monthLabel(flush.from)}–${monthLabel(flush.to)}`;
}

function describeRegion(region: Region): string {
  return region.flushes
    .map((f) => `${f.name}, ${describeRange(f)}${f.peak ? " (peak)" : ""}`)
    .join(". ");
}

/* ---------------------------------------------------------------------------
   Track — the 12-month bar for a single region.
   ------------------------------------------------------------------------- */

function Track({
  region,
  now,
  onPick,
  activeFlush,
}: {
  region: Region;
  now: number | null;
  onPick?: (flush: Flush) => void;
  activeFlush?: Flush | null;
}) {
  /* Peak bars are drawn last so they sit over the base season where the two
     overlap — the Nilgiri frost harvest runs inside a year-round picking. */
  const ordered = [...region.flushes].sort(
    (a, b) => Number(a.peak ?? false) - Number(b.peak ?? false)
  );

  return (
    <div className="relative grid h-9 grid-cols-12 items-center gap-px">
      {/* Empty months, so the year always reads as twelve slots.
          Pinned to row 1 explicitly: a year-round flush is placed across all
          twelve columns, and definite placement is resolved before auto
          placement — leaving these to auto-place pushed them onto a second row
          and floated the bar half a row above its own label. */}
      {MONTHS.map((m, i) => (
        <div
          key={m}
          style={{ gridRow: 1, gridColumn: i + 1 }}
          className={`h-9 ${
            now === i + 1 ? "bg-brass-300/25" : i % 2 === 0 ? "bg-paper-deep/40" : "bg-paper-deep/20"
          }`}
        />
      ))}

      {ordered.flatMap((flush) =>
        spansOf(flush).map((span, i) => {
          const isActive = activeFlush === flush;
          const interactive = Boolean(onPick);

          return (
            <button
              key={`${flush.name}-${i}`}
              type="button"
              disabled={!interactive}
              onClick={() => onPick?.(flush)}
              onMouseEnter={() => onPick?.(flush)}
              title={`${flush.name} · ${describeRange(flush)}`}
              aria-label={`${region.name}: ${flush.name}, ${describeRange(flush)}`}
              style={{ gridColumn: `${span.from} / ${span.to + 1}`, gridRow: 1 }}
              className={`z-10 h-[0.6rem] rounded-full transition-all duration-300 ease-[var(--ease-soft)] ${
                interactive ? "cursor-pointer" : "cursor-default"
              } ${
                flush.peak
                  ? "bg-leaf-900"
                  : "bg-leaf-400"
              } ${
                isActive ? "h-[0.85rem] ring-2 ring-brass-500 ring-offset-1 ring-offset-paper" : ""
              } ${interactive && !isActive ? "hover:h-[0.85rem]" : ""}`}
            />
          );
        })
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Month ruler
   ------------------------------------------------------------------------- */

function MonthRuler({ now }: { now: number | null }) {
  return (
    <div className="grid grid-cols-12 gap-px" aria-hidden="true">
      {MONTHS.map((m, i) => (
        <div
          key={m}
          className={`pb-2 text-center text-[0.6rem] font-medium uppercase tracking-[0.1em] ${
            now === i + 1 ? "text-brass-600" : "text-ink-mute"
          }`}
        >
          {/* Only the initial fits at phone widths; the full stub returns at sm. */}
          <span className="sm:hidden">{m[0]}</span>
          <span className="hidden sm:inline">{m}</span>
        </div>
      ))}
    </div>
  );
}

/** Shared by both views so the key never disagrees with what is drawn. */
function Legend({ withNow }: { withNow: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] text-ink-mute">
      <span className="inline-flex items-center gap-2">
        <span className="h-[0.55rem] w-6 rounded-full bg-leaf-400" />
        Picking
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-[0.55rem] w-6 rounded-full bg-leaf-900" />
        Peak window
      </span>
      {withNow && (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-xs bg-brass-300/50" />
          This month
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Single region — sits beside the map.
   ------------------------------------------------------------------------- */

export function HarvestStrip({ region }: { region: Region }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(new Date().getMonth() + 1), []);

  const picking = now ? activeFlushes(region, now) : [];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="t-meta text-ink-mute">Harvest calendar</span>
        {now && (
          <span className="text-[0.68rem] uppercase tracking-[0.12em] text-brass-600">
            {/* Not "dormant" — the bush is not dormant between flushes, it is
                simply not being picked, and a tea buyer would notice. */}
            {picking.length > 0 ? `Picking now · ${monthLabel(now)}` : `Not picking · ${monthLabel(now)}`}
          </span>
        )}
      </div>

      <div className="mt-3">
        <MonthRuler now={now} />
        <Track region={region} now={now} />
      </div>

      <ul className="mt-4 space-y-2.5">
        {region.flushes.map((flush) => (
          <li key={flush.name} className="flex gap-3">
            <span
              className={`mt-[0.42rem] h-[0.55rem] w-[0.55rem] shrink-0 rounded-full ${
                flush.peak ? "bg-leaf-900" : "bg-leaf-400"
              }`}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="text-[0.82rem] font-medium text-ink">{flush.name}</span>
              <span className="text-[0.82rem] text-ink-mute"> · {describeRange(flush)}</span>
              {flush.peak && (
                <span className="ml-2 text-[0.62rem] uppercase tracking-[0.14em] text-brass-600">
                  Peak
                </span>
              )}
              <span className="block text-[0.8rem] leading-snug text-ink-soft">{flush.note}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   All regions — the comparison chart.
   ------------------------------------------------------------------------- */

export default function HarvestChart() {
  const [now, setNow] = useState<number | null>(null);
  const [picked, setPicked] = useState<{ region: Region; flush: Flush } | null>(null);

  useEffect(() => setNow(new Date().getMonth() + 1), []);

  const inSeason = now ? regions.filter((r) => activeFlushes(r, now).length > 0) : [];

  return (
    <div>
      {/* Scrolls inside its own container so the page body never scrolls
          horizontally on a phone — same pattern as the comparison table. */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 sm:grid-cols-[10rem_1fr] sm:gap-x-6">
            <span className="t-meta self-end pb-2 text-ink-mute">Region</span>
            <MonthRuler now={now} />

            {regions.map((region) => (
              <div key={region.id} className="contents">
                <div className="flex items-center border-t border-line">
                  <span className="truncate text-[0.85rem] text-ink" title={region.name}>
                    {region.name.replace(" & the High Ranges", "")}
                  </span>
                </div>
                <div className="border-t border-line">
                  <Track
                    region={region}
                    now={now}
                    activeFlush={picked?.region.id === region.id ? picked.flush : null}
                    onPick={(flush) => setPicked({ region, flush })}
                  />
                </div>
                <span className="sr-only">{describeRegion(region)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Read-out for whatever the pointer is on. Reserves its own height so the
          chart does not jump as the caption appears and disappears. */}
      <div className="mt-5 min-h-[3.25rem] border-t border-line pt-4">
        {picked ? (
          <p key={`${picked.region.id}-${picked.flush.name}`} className="fade-swap t-small text-ink-soft">
            <span className="font-medium text-ink">
              {picked.region.name} · {picked.flush.name}
            </span>
            <span className="text-ink-mute"> · {describeRange(picked.flush)}</span>
            {picked.flush.peak && (
              <span className="ml-2 text-[0.62rem] uppercase tracking-[0.14em] text-brass-600">
                Peak
              </span>
            )}
            <span className="mt-0.5 block">{picked.flush.note}</span>
          </p>
        ) : (
          <p className="t-small text-ink-mute">
            {/* "Select", not "hover": the bars are tap targets too, and half
                the buyers reading this are on a phone. */}
            {now
              ? `In ${monthLabel(now)}, ${inSeason.length} of ${regions.length} regions are picking. Select a bar for detail.`
              : "Select a bar for detail."}
          </p>
        )}
      </div>

      <div className="mt-5">
        <Legend withNow={now !== null} />
      </div>
    </div>
  );
}
