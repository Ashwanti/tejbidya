"use client";

import { useState } from "react";
import { INDIA_PATH, MAP, project, regions } from "@/lib/regions";
import { images } from "@/lib/images";
import { HarvestStrip } from "./HarvestTimeline";
import { Badge, Eyebrow, Figure } from "./ui";

/**
 * ORIGIN MAP
 * ----------------------------------------------------------------------------
 * The country outline and every pin are projected from real latitude/longitude
 * (lib/regions.ts), so the geography is honest rather than decorative — the
 * Nilgiris really do sit in the far south, Assam really is out east.
 *
 * These are the regions where tea is grown in India, not a claim about where
 * Tejbidya buys. The page around the map says so plainly, and lib/regions.ts
 * carries a `sourced` flag to switch on once the client confirms their gardens.
 *
 * PERFORMANCE. The previous version rendered all seven region photographs at
 * once and cross-faded them with opacity, which downloaded seven full images on
 * a page most visitors never interact with. Only the active image is mounted
 * now; the swap is a 500ms CSS fade keyed on region id.
 */

const REGION_IMAGE = {
  darjeeling: images.slopes,
  assam: images.gardenEdge,
  nilgiris: images.hillsSoft,
  munnar: images.hillsDeep,
  sikkim: images.leafMountain,
  kangra: images.gardenTree,
  dooars: images.aerialRows,
} as const;

export default function OriginMap() {
  const [activeId, setActiveId] = useState(regions[0].id);
  const active = regions.find((r) => r.id === activeId) ?? regions[0];

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-14">
      {/* ---------------------------------------------------------------- MAP */}
      <div className="relative lg:sticky lg:top-28 lg:self-start">
        {/* The viewBox is padded either side of the projected map so the active
            region's leader line and label have room outside the coastline. */}
        <svg
          viewBox={`-78 -10 ${MAP.width + 156} ${MAP.height + 20}`}
          className="mx-auto h-auto w-full max-w-[440px] lg:mx-0 lg:max-w-none"
          role="group"
          aria-label="Map of tea-growing regions in India"
        >
          <defs>
            <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E3E8DA" />
              <stop offset="100%" stopColor="#C7D0BC" />
            </linearGradient>
          </defs>

          {/* Landmass */}
          <path
            d={INDIA_PATH}
            fill="url(#landFill)"
            stroke="#93A187"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Faint latitude lines, for a chart-like rather than travel-poster feel */}
          <g stroke="#93A187" strokeWidth="0.35" opacity="0.35">
            {[10, 15, 20, 25, 30, 35].map((lat) => {
              const { y } = project(0, lat);
              return <line key={lat} x1={-78} y1={y} x2={MAP.width + 78} y2={y} />;
            })}
          </g>

          {/* Pins */}
          {regions.map((r) => {
            const { x, y } = project(r.lon, r.lat);
            const on = r.id === activeId;
            const east = r.lon > 86;

            return (
              <g
                key={r.id}
                transform={`translate(${x} ${y})`}
                onMouseEnter={() => setActiveId(r.id)}
                onFocus={() => setActiveId(r.id)}
                onClick={() => setActiveId(r.id)}
                tabIndex={0}
                role="button"
                aria-label={`${r.name}, ${r.state}`}
                aria-pressed={on}
                className="cursor-pointer outline-none"
              >
                {/* Generous invisible hit area — the visible pin is 4px wide and
                    this has to be usable with a thumb. */}
                <circle r="16" fill="transparent" />
                <circle
                  r={on ? 5 : 3.4}
                  fill={on ? "#232B22" : "#5C6D53"}
                  className="transition-all duration-300 ease-[var(--ease-soft)]"
                />
                {on && <circle r="10" fill="none" stroke="#232B22" strokeWidth="0.8" opacity="0.35" />}

                {/* Only the active region is labelled. Darjeeling, Sikkim and the
                    Dooars sit within ~0.6° of each other, so labelling all seven
                    produced unreadable overlapping text. The button list beside
                    the map names every region anyway. */}
                {on && (
                  <>
                    <line
                      x1={east ? 9 : -9}
                      y1="0"
                      x2={east ? 20 : -20}
                      y2="0"
                      stroke="#232B22"
                      strokeWidth="0.8"
                      opacity="0.45"
                    />
                    <text
                      x={east ? 25 : -25}
                      y="3.4"
                      textAnchor={east ? "start" : "end"}
                      className="pointer-events-none select-none"
                      style={{
                        fontFamily: "var(--font-instrument), sans-serif",
                        fontSize: "10.5px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fill: "#22201C",
                        fontWeight: 500,
                      }}
                    >
                      {r.name.replace("The ", "").replace(" & the High Ranges", "")}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <p className="mt-3 text-center text-[0.78rem] leading-relaxed text-ink-mute lg:text-left">
          Pins are plotted from actual coordinates. The outline is a simplified
          rendering for illustration.
        </p>

        {/* Geographic facts sit with the map rather than under the prose.
            Harvest is no longer one of them: it earns a calendar of its own
            below, which says the same thing in a form you can actually plan
            a purchase against. */}
        <dl key={`${active.id}-facts`} className="fade-swap mt-8 border-t border-line">
          {[
            { k: "Altitude", v: active.altitude },
            { k: "Terrain", v: active.terrain },
          ].map((f) => (
            <div key={f.k} className="border-b border-line py-3.5">
              <dt className="t-meta text-ink-mute">{f.k}</dt>
              <dd className="t-small mt-1 text-ink-soft">{f.v}</dd>
            </div>
          ))}
        </dl>

        <div key={`${active.id}-harvest`} className="fade-swap mt-7">
          <HarvestStrip region={active} />
        </div>
      </div>

      {/* ------------------------------------------------------------- DETAIL */}
      <div>
        {/* Region selector */}
        <div className="flex flex-wrap gap-1.5">
          {regions.map((r) => {
            const on = r.id === activeId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveId(r.id)}
                aria-pressed={on}
                className={`rounded-xs border px-3 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${
                  on
                    ? "border-leaf-900 bg-leaf-900 text-paper"
                    : "border-line-strong text-ink-mute hover:border-ink hover:text-ink"
                }`}
              >
                {r.name.replace("The ", "")}
              </button>
            );
          })}
        </div>

        {/* Active region. key= remounts the block so the fade replays on change. */}
        <div key={active.id} className="fade-swap mt-7">
          <Figure
            image={REGION_IMAGE[active.id as keyof typeof REGION_IMAGE]}
            ratio="wide"
            sizes="(max-width: 1024px) 100vw, 52vw"
          />

          <div className="mt-6">
            <Eyebrow className="text-brass-600">{active.state}</Eyebrow>
            <h3 className="t-h2 mt-3">{active.name}</h3>
            <p className="mt-1.5 font-display text-[1.15rem] italic text-ink-mute">
              {active.character}
            </p>
            <p className="t-body mt-4 max-w-xl text-ink-soft">{active.blurb}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="t-meta mr-1 text-ink-mute">Classically produces</span>
              {active.teas.map((t) => (
                <Badge key={t} tone="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
