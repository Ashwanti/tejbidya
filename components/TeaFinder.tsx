"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { teas } from "@/lib/teas";
import FinderIcon, { type IconName } from "./FinderIcons";
import { Arrow, Badge, Button, ButtonRow, Eyebrow, Figure } from "./ui";

/**
 * TEA FINDER
 * ----------------------------------------------------------------------------
 * A four-question preference quiz that scores every tea in the range and returns
 * the closest match plus a runner-up.
 *
 * The scoring is deliberately transparent: each answer carries a weight per tea
 * slug, weights are summed, and the highest total wins. There is no hidden model
 * and no invented "match percentage" dressed up as science.
 *
 * LAYOUT. A brief rail on the left, the live question on the right. The rail is
 * not decoration — it holds the answers given so far and the running standings,
 * which is what makes the transparency claim above visible rather than merely
 * asserted. It also fixes the previous version's real problem: one wide card
 * with four short labels in it, and half the panel left empty.
 */

type Option = {
  value: string;
  label: string;
  caption: string;
  icon: IconName;
  /** Points contributed to each tea slug. */
  weights: Partial<Record<string, number>>;
};

type Question = {
  id: string;
  /** Two or three words for the rail, where the full prompt will not fit. */
  short: string;
  prompt: string;
  helper: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: "serve",
    short: "How it is drunk",
    prompt: "How is it going to be drunk?",
    helper: "The single biggest factor in which leaf will suit you.",
    options: [
      {
        value: "plain",
        label: "On its own",
        caption: "No milk, no sugar",
        icon: "cup",
        weights: { "green-tea": 3, "white-tea": 3, "oolong-tea": 3, "black-tea": 1 },
      },
      {
        value: "milk",
        label: "With milk",
        caption: "The leaf has to hold up",
        icon: "milk",
        weights: { "black-tea": 3, "masala-chai": 3 },
      },
      {
        value: "iced",
        label: "Served iced",
        caption: "Cold brew or over ice",
        icon: "ice",
        weights: { "green-tea": 2, "black-tea": 2, "oolong-tea": 2, "flavoured-blends": 2 },
      },
      {
        value: "range",
        label: "A bit of everything",
        caption: "Building a full range",
        icon: "spectrum",
        weights: {
          "black-tea": 2,
          "green-tea": 2,
          "white-tea": 1,
          "oolong-tea": 1,
          "masala-chai": 2,
          "flavoured-blends": 1,
        },
      },
    ],
  },
  {
    id: "strength",
    short: "Strength",
    prompt: "How strong should the cup be?",
    helper: "From barely-there to properly bracing.",
    options: [
      {
        value: "delicate",
        label: "Delicate",
        caption: "Subtle, quiet, easy to over-brew",
        icon: "weight-light",
        weights: { "white-tea": 4, "green-tea": 2, "oolong-tea": 1 },
      },
      {
        value: "balanced",
        label: "Balanced",
        caption: "Present but not heavy",
        icon: "weight-mid",
        weights: { "oolong-tea": 3, "green-tea": 2, "flavoured-blends": 2 },
      },
      {
        value: "bold",
        label: "Bold",
        caption: "Strong, dark, wakes you up",
        icon: "weight-full",
        weights: { "black-tea": 4, "masala-chai": 3 },
      },
    ],
  },
  {
    id: "flavour",
    short: "Flavour",
    prompt: "Which of these reads best to you?",
    helper: "Pick on instinct — first reaction is usually right.",
    options: [
      {
        value: "floral",
        label: "Floral & aromatic",
        caption: "Orchid, honey, blossom",
        icon: "blossom",
        weights: { "white-tea": 3, "oolong-tea": 3, "flavoured-blends": 2 },
      },
      {
        value: "grassy",
        label: "Fresh & grassy",
        caption: "Green, clean, a little nutty",
        icon: "sprig",
        weights: { "green-tea": 4 },
      },
      {
        value: "malty",
        label: "Malty & rich",
        caption: "Deep, brisk, amber",
        icon: "grain",
        weights: { "black-tea": 4 },
      },
      {
        value: "spiced",
        label: "Warming & spiced",
        caption: "Cardamom, ginger, cinnamon",
        icon: "spice",
        weights: { "masala-chai": 4, "flavoured-blends": 1 },
      },
    ],
  },
  {
    id: "purpose",
    short: "What it is for",
    prompt: "And what is it for?",
    helper: "This shapes format and volume more than flavour.",
    options: [
      {
        value: "retail",
        label: "A retail shelf",
        caption: "Packed, branded, sold on",
        icon: "shelf",
        weights: { "flavoured-blends": 2, "black-tea": 2, "green-tea": 2 },
      },
      {
        value: "food",
        label: "Café or foodservice",
        caption: "Volume, consistency, speed",
        icon: "service",
        weights: { "masala-chai": 3, "black-tea": 3 },
      },
      {
        value: "label",
        label: "A private-label line",
        caption: "Our brief, your leaf",
        icon: "tag",
        weights: { "flavoured-blends": 4, "black-tea": 1 },
      },
      {
        value: "speciality",
        label: "A speciality range",
        caption: "Small lots, high positioning",
        icon: "gem",
        weights: { "white-tea": 3, "oolong-tea": 3 },
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Standings — shared by the live rail and the result breakdown.
   ------------------------------------------------------------------------- */

function Standings({
  ranked,
  max,
  limit,
  dark = false,
}: {
  ranked: { tea: (typeof teas)[number]; score: number }[];
  max: number;
  limit: number;
  dark?: boolean;
}) {
  return (
    <ul className="space-y-3.5">
      {ranked.slice(0, limit).map(({ tea, score }, i) => (
        <li key={tea.slug}>
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`truncate text-[0.82rem] ${
                i === 0
                  ? dark
                    ? "text-paper"
                    : "text-ink"
                  : dark
                    ? "text-paper/60"
                    : "text-ink-mute"
              }`}
            >
              {tea.name}
            </span>
            <span
              className={`shrink-0 text-[0.72rem] tabular-nums ${
                dark ? "text-paper/50" : "text-ink-mute"
              }`}
            >
              {score}
            </span>
          </div>
          <div className={`mt-1.5 h-[3px] ${dark ? "bg-paper/15" : "bg-paper-deep"}`}>
            {/* Width is the whole animation: bars grow as answers land, which
                is the finder showing its working. */}
            <div
              className={`h-[3px] transition-[width] duration-700 ease-[var(--ease-soft)] ${
                i === 0 ? (dark ? "bg-brass-300" : "bg-leaf-900") : dark ? "bg-paper/35" : "bg-leaf-400"
              }`}
              style={{ width: `${max > 0 ? (score / max) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function TeaFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});

  const done = step >= QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  /* Scored on every answer, not only at the end — the rail needs the running
     standings while the quiz is still in progress. */
  const ranked = useMemo(() => {
    const scores = new Map<string, number>(teas.map((t) => [t.slug, 0]));
    for (const opt of Object.values(answers)) {
      for (const [slug, pts] of Object.entries(opt.weights)) {
        scores.set(slug, (scores.get(slug) ?? 0) + (pts ?? 0));
      }
    }
    return teas
      .map((t) => ({ tea: t, score: scores.get(t.slug) ?? 0 }))
      .sort((a, b) => b.score - a.score);
  }, [answers]);

  const max = ranked[0]?.score ?? 0;

  const choose = (q: Question, opt: Option) => {
    setAnswers((a) => ({ ...a, [q.id]: opt }));
    // Brief delay so the selected state is visible before the step advances.
    window.setTimeout(() => setStep((s) => s + 1), 220);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  /* ------------------------------------------------------------------ RAIL */
  const rail = (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-xs border border-line bg-paper-soft/70 p-6">
        <Eyebrow className="text-brass-600" rule={false}>
          Your brief
        </Eyebrow>

        <ol className="mt-5">
          {QUESTIONS.map((question, i) => {
            const answer = answers[question.id];
            const current = i === step && !done;
            const reachable = Boolean(answer) || current;

            return (
              <li key={question.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  disabled={!answer}
                  onClick={() => setStep(i)}
                  aria-current={current ? "step" : undefined}
                  className={`flex w-full items-center gap-3.5 py-3.5 text-left transition-opacity duration-300 ${
                    answer ? "cursor-pointer hover:opacity-70" : "cursor-default"
                  } ${reachable ? "opacity-100" : "opacity-40"}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-medium tabular-nums transition-colors duration-300 ${
                      answer
                        ? "border-leaf-900 bg-leaf-900 text-paper"
                        : current
                          ? "border-brass-500 text-brass-600"
                          : "border-line-strong text-ink-mute"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="t-meta block text-ink-mute">{question.short}</span>
                    <span
                      className={`mt-0.5 block truncate text-[0.85rem] ${
                        answer ? "text-ink" : "text-ink-mute"
                      }`}
                    >
                      {answer ? answer.label : current ? "Choosing…" : "—"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Standings appear only once there is something to stand on. */}
      {answeredCount > 0 && (
        <div className="fade-swap mt-4 rounded-xs border border-line p-6">
          <div className="flex items-baseline justify-between gap-3">
            <Eyebrow className="text-ink-mute" rule={false}>
              {done ? "Final standings" : "In contention"}
            </Eyebrow>
            <span className="text-[0.7rem] tabular-nums text-ink-mute">
              {answeredCount}/{QUESTIONS.length}
            </span>
          </div>
          <div className="mt-4">
            <Standings ranked={ranked} max={max} limit={4} />
          </div>
        </div>
      )}
    </aside>
  );

  /* ---------------------------------------------------------------- RESULT */
  if (done && ranked.length) {
    const [best, second] = ranked;
    const chosenWords = Object.values(answers).map((o) => o.label.toLowerCase());

    return (
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-10">
        {rail}

        <div className="fade-swap overflow-hidden rounded-xs border border-line bg-paper">
          <div className="grid lg:grid-cols-2">
            <Figure
              image={best.tea.hero}
              ratio="fill"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="min-h-[240px] lg:min-h-[560px]"
            />

            <div className="flex flex-col justify-center p-7 sm:p-9">
              <Eyebrow className="text-brass-600">Your match</Eyebrow>

              <h3 className="t-h1 mt-4">{best.tea.name}</h3>

              <p className="t-lead mt-3 text-ink-soft">{best.tea.tagline}</p>

              <p className="t-small mt-5 text-ink-soft">
                You asked for something{" "}
                <span className="text-ink">{chosenWords.join(", ")}</span>. That
                points to {best.tea.name.toLowerCase()} — {best.tea.cup.toLowerCase()}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {best.tea.notes.map((n) => (
                  <Badge key={n} tone="outline">
                    {n}
                  </Badge>
                ))}
              </div>

              <ButtonRow className="mt-8">
                <Button href={`/teas/${best.tea.slug}`} variant="primary">
                  View this tea
                  <Arrow />
                </Button>
                <Button href={`/request?type=sample&tea=${best.tea.slug}`} variant="secondary">
                  Request a sample
                </Button>
              </ButtonRow>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                {second && (
                  <p className="t-small text-ink-mute">
                    Also worth cupping:{" "}
                    <Link href={`/teas/${second.tea.slug}`} className="link-draw text-ink">
                      {second.tea.name}
                    </Link>
                  </p>
                )}
                <button
                  type="button"
                  onClick={restart}
                  className="link-draw text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
                >
                  Start again
                </button>
              </div>
            </div>
          </div>

          {/* How the answer was reached. The claim in this file's header is that
              the scoring is transparent; this is where that is honoured. */}
          <div className="border-t border-line bg-leaf-900 p-7 text-paper sm:p-9">
            <div className="grid gap-8 sm:grid-cols-[1fr_1fr] sm:gap-12">
              <div>
                <Eyebrow className="text-brass-300" rule={false}>
                  How we got there
                </Eyebrow>
                <ul className="mt-5 space-y-3">
                  {QUESTIONS.map((question) => {
                    const answer = answers[question.id];
                    if (!answer) return null;
                    return (
                      <li key={question.id} className="flex items-center gap-3.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper/25 text-brass-300">
                          <FinderIcon name={answer.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-paper/45">
                            {question.short}
                          </span>
                          <span className="block text-[0.88rem] text-paper">{answer.label}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <Eyebrow className="text-brass-300" rule={false}>
                  Scored across the range
                </Eyebrow>
                <div className="mt-5">
                  <Standings ranked={ranked} max={max} limit={5} dark />
                </div>
                <p className="mt-5 text-[0.78rem] leading-relaxed text-paper/50">
                  Points are the sum of your four answers. Nothing is weighted in
                  secret, and a close second is a genuine second.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- QUESTION */
  const q = QUESTIONS[step];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-10">
      {rail}

      <div className="overflow-hidden rounded-xs border border-line bg-paper">
        {/* Segmented progress. The old single hairline was one pixel of brass
            across the full width — technically present, never once seen. */}
        <div className="flex gap-1 border-b border-line p-2">
          {QUESTIONS.map((question, i) => (
            <span
              key={question.id}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ease-[var(--ease-soft)] ${
                i < step ? "bg-leaf-900" : i === step ? "bg-brass-500" : "bg-line"
              }`}
            />
          ))}
        </div>

        <div className="p-7 sm:p-9 lg:p-11">
          <div className="flex items-center justify-between gap-4">
            <Eyebrow className="text-brass-600" rule={false}>
              Question {step + 1} of {QUESTIONS.length}
            </Eyebrow>
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="link-draw text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
              >
                Back
              </button>
            )}
          </div>

          {/* key= remounts per step so the fade replays */}
          <div key={q.id} className="fade-swap">
            <h3 className="t-h2 mt-5 max-w-2xl">{q.prompt}</h3>
            <p className="t-small mt-2.5 text-ink-mute">{q.helper}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {q.options.map((opt) => {
                const selected = answers[q.id]?.value === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => choose(q, opt)}
                    aria-pressed={selected}
                    className={`group flex items-center gap-4 rounded-xs border p-5 text-left transition-all duration-300 ease-[var(--ease-soft)] ${
                      selected
                        ? "border-leaf-900 bg-leaf-900 text-paper"
                        : "border-line bg-paper hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_20px_44px_-32px_rgba(34,32,28,0.55)]"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        selected
                          ? "border-paper/25 text-brass-300"
                          : "border-line text-brass-600 group-hover:border-brass-300"
                      }`}
                    >
                      <FinderIcon name={opt.icon} className="h-[1.15rem] w-[1.15rem]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="t-h4 block">{opt.label}</span>
                      <span
                        className={`mt-0.5 block text-[0.83rem] leading-snug ${
                          selected ? "text-paper/60" : "text-ink-mute"
                        }`}
                      >
                        {opt.caption}
                      </span>
                    </span>

                    <Arrow
                      className={`shrink-0 transition-all duration-300 ${
                        selected
                          ? "text-paper opacity-90"
                          : "-translate-x-1 text-ink-mute opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
