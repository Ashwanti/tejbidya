import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BLUR, type Img } from "@/lib/images";

/* ============================================================================
   LAYOUT PRIMITIVES
   ========================================================================== */

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  /** `wide` is for full-bleed grids only; `narrow` for long-form reading. */
  size?: "narrow" | "default" | "wide";
}) {
  const widths = {
    narrow: "max-w-[760px]",
    default: "max-w-[1180px]",
    wide: "max-w-[1440px]",
  } as const;

  return (
    <div className={`mx-auto w-full px-5 sm:px-8 lg:px-10 ${widths[size]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * SECTION
 * ----------------------------------------------------------------------------
 * Owns two things and only two things: the surface a block of content sits on,
 * and its vertical rhythm. Both come from a fixed set, so the page cannot end up
 * with six subtly different section heights or a fourth background colour.
 *
 * `tone` names match what is actually rendered — the previous build had a tone
 * called "cream" that painted the section near-black, which is how dark-on-dark
 * text got shipped across nine pages.
 */
export function Section({
  children,
  className = "",
  id,
  tone = "paper",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "soft" | "deep" | "dark" | "none";
  size?: "sm" | "md" | "lg" | "none";
}) {
  const tones = {
    paper: "bg-paper text-ink",
    soft: "bg-paper-soft text-ink",
    deep: "bg-paper-deep text-ink",
    dark: "bg-leaf-900 text-paper",
    none: "",
  } as const;

  const sizes = {
    sm: "py-12 sm:py-14",
    md: "py-16 sm:py-20 lg:py-24",
    lg: "py-20 sm:py-24 lg:py-32",
    none: "",
  } as const;

  return (
    <section id={id} className={`relative ${sizes[size]} ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}

/** Hairline rule. Used instead of ad-hoc `border-t` so weight stays uniform. */
export function Rule({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <hr className={`border-0 h-px ${dark ? "bg-white/12" : "bg-line"} ${className}`} />
  );
}

/* ============================================================================
   TYPOGRAPHY
   ========================================================================== */

export function Eyebrow({
  children,
  className = "",
  rule = true,
}: {
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <span className={`t-eyebrow inline-flex items-center gap-3 ${className}`}>
      {rule && <span aria-hidden className="h-px w-7 bg-current opacity-40" />}
      {children}
    </span>
  );
}

/**
 * The single section-header component. Every section on the site uses it, so
 * eyebrow → heading → lead spacing is identical everywhere.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  dark = false,
  className = "",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <Eyebrow className={dark ? "text-brass-300" : "text-brass-600"} rule={!centered}>
          {eyebrow}
        </Eyebrow>
      )}
      <Tag className={`t-h2 ${eyebrow ? "mt-4" : ""} ${dark ? "text-paper" : "text-ink"}`}>
        {title}
      </Tag>
      {lead && (
        <p
          className={`t-lead mt-4 ${dark ? "text-paper/65" : "text-ink-soft"} ${
            centered ? "mx-auto" : ""
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/* ============================================================================
   BUTTONS
   ----------------------------------------------------------------------------
   Three variants, two sizes, and an `onDark` switch. That is the whole set. The
   previous build had four variants that only worked on a dark ground, so half
   the pages bypassed the component and hand-rolled their own button markup.
   ========================================================================== */

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "quiet";
  size?: "sm" | "md";
  onDark?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

const BTN_BASE =
  "group inline-flex items-center justify-center gap-2.5 rounded-xs font-sans font-medium " +
  "uppercase tracking-[0.14em] transition-[background-color,border-color,color,transform] " +
  "duration-300 ease-[var(--ease-soft)] disabled:opacity-40 disabled:pointer-events-none " +
  "whitespace-nowrap";

const BTN_SIZE = {
  sm: "px-5 py-2.5 text-[0.7rem]",
  md: "px-6 py-3.5 text-[0.75rem]",
} as const;

function buttonClasses(
  variant: NonNullable<ButtonProps["variant"]>,
  size: NonNullable<ButtonProps["size"]>,
  onDark: boolean
) {
  const variants = onDark
    ? {
        primary: "bg-paper text-ink hover:bg-brass-300",
        secondary: "border border-paper/30 text-paper hover:border-paper hover:bg-paper/10",
        quiet: "px-0 py-0 text-paper/70 hover:text-paper",
      }
    : {
        primary: "bg-leaf-900 text-paper hover:bg-leaf-700",
        secondary: "border border-line-strong text-ink hover:border-ink hover:bg-paper-soft",
        quiet: "px-0 py-0 text-ink-soft hover:text-ink",
      };

  return `${BTN_BASE} ${variant === "quiet" ? "text-[0.75rem]" : BTN_SIZE[size]} ${
    variants[variant]
  }`;
}

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  onDark = false,
  className = "",
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const cls = `${buttonClasses(variant, size, onDark)} ${className}`;

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    return external ? (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
      {children}
    </button>
  );
}

/**
 * Pair of calls to action. Stacked and equal-width on a phone, inline from sm up.
 * Two buttons of different intrinsic widths stacked and left-aligned is the
 * detail that makes an otherwise finished page look unfinished, and it happened
 * in five places before this existed.
 */
export function ButtonRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

/** Text link with the draw-in underline and a nudging arrow. */
export function TextLink({
  href,
  children,
  dark = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
        dark ? "text-paper/70 hover:text-paper" : "text-ink-soft hover:text-ink"
      } ${className}`}
    >
      <span className="link-draw">{children}</span>
      <Arrow />
    </Link>
  );
}

/** Small right-pointing arrow that nudges on hover. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`h-3 w-3 shrink-0 transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 8h13M9 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================================
   IMAGE SYSTEM
   ----------------------------------------------------------------------------
   One component, one radius, one fade-in, and a closed set of aspect ratios.
   Photography is the most expensive-looking thing on a page and the easiest to
   make look cheap: mixed crops read as a template, consistent crops read as art
   direction. Nothing on the site renders <Image> directly except the two heroes.
   ========================================================================== */

const RATIOS = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
  fill: "h-full",
} as const;

export function Figure({
  image,
  ratio = "landscape",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  zoom = false,
  className = "",
  overlay = false,
  children,
}: {
  image: Img;
  ratio?: keyof typeof RATIOS;
  sizes?: string;
  priority?: boolean;
  /** Slow scale on hover. Only for images inside a link. */
  zoom?: boolean;
  className?: string;
  /** Bottom-up scrim, for images carrying text. */
  overlay?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xs bg-paper-deep ${RATIOS[ratio]} ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        className={`object-cover ${
          zoom
            ? "transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
            : ""
        }`}
      />
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-leaf-900/70 via-leaf-900/10 to-transparent"
        />
      )}
      {children}
    </div>
  );
}

/* ============================================================================
   BADGE
   One shape, two tones. Category labels and nothing else — a card carries at
   most one, which is why there is no "size" or "colour" prop to reach for.
   ========================================================================== */

export function Badge({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "outline";
  className?: string;
}) {
  const tones = {
    light: "bg-paper/90 text-ink backdrop-blur-[2px]",
    dark: "bg-leaf-900/85 text-paper backdrop-blur-[2px]",
    outline: "border border-line-strong text-ink-soft",
  } as const;

  return (
    <span
      className={`t-eyebrow inline-flex items-center rounded-xs px-2.5 py-1.5 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ============================================================================
   DATA DISPLAY
   ========================================================================== */

export type Stat = { value: string; label: string };

/**
 * Export figures. Hairline-separated rather than boxed: four bordered cards in
 * a row is the single most template-looking pattern on the web.
 */
export function StatRow({
  stats,
  dark = false,
  /** `sm` for specification values, which are longer and need to stay on one line. */
  size = "md",
  className = "",
}: {
  stats: readonly Stat[];
  dark?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-x-10 lg:grid-cols-4 ${className}`}
    >
      {stats.map((s) => (
        <div key={s.label} className={`border-t pt-4 ${dark ? "border-white/15" : "border-line"}`}>
          <dt className={`t-meta ${dark ? "text-brass-300/80" : "text-ink-mute"}`}>{s.label}</dt>
          <dd
            className={`mt-2 font-display font-normal leading-tight ${
              size === "sm" ? "text-[1.25rem]" : "text-[clamp(1.5rem,2.4vw,2rem)]"
            } ${dark ? "text-paper" : "text-ink"}`}
          >
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Label / value list. Used for export terms, contact details, brewing specs. */
export function SpecList({
  items,
  dark = false,
  className = "",
}: {
  items: readonly { label: string; value: ReactNode }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <dl className={className}>
      {items.map((it) => (
        <div
          key={it.label}
          className={`grid gap-1 border-b py-4 sm:grid-cols-[minmax(0,160px)_1fr] sm:gap-6 ${
            dark ? "border-white/12" : "border-line"
          }`}
        >
          <dt className={`t-meta pt-1 ${dark ? "text-brass-300/75" : "text-ink-mute"}`}>
            {it.label}
          </dt>
          <dd className={`t-body ${dark ? "text-paper/80" : "text-ink-soft"}`}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Editorial note. Replaces the dashed "placeholder" pills the old build printed
 * into the live UI: the site still refuses to invent facts, but a buyer now
 * reads a quiet sentence rather than a warning chip on a premium brand's footer.
 */
export function Note({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`t-small border-l pl-5 ${
        dark ? "border-brass-500/50 text-paper/55" : "border-brass-500/60 text-ink-mute"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/* ============================================================================
   CTA BAND
   The one closing call to action, used at the foot of every content page so the
   next step is always in the same place and always looks the same.
   ========================================================================== */

export function CTABand({
  title,
  lead,
  primary = { href: "/request?type=sample", label: "Request samples" },
  secondary,
}: {
  title: string;
  lead?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Section tone="dark" size="md">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <h2 className="t-h2 text-paper">{title}</h2>
            {lead && <p className="t-lead mt-4 text-paper/60">{lead}</p>}
          </div>
          <ButtonRow className="shrink-0">
            <Button href={primary.href} variant="primary" onDark>
              {primary.label}
              <Arrow />
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="secondary" onDark>
                {secondary.label}
                <Arrow />
              </Button>
            )}
          </ButtonRow>
        </div>
      </Container>
    </Section>
  );
}

/* ============================================================================
   BRAND MARK
   ========================================================================== */

/** A single tea leaf: the brand mark, and the only decorative glyph on the site. */
export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Leaf body: a lens formed by two mirrored arcs. */}
      <path d="M12 2.5c5 3.2 7.5 7 7.5 11 0 4.4-3.4 8-7.5 8s-7.5-3.6-7.5-8c0-4 2.5-7.8 7.5-11Z" />
      {/* Midrib and two veins. */}
      <path d="M12 6v14" />
      <path d="M12 11.5 8.4 9" />
      <path d="M12 15 15.6 12.5" />
    </svg>
  );
}
