import Link from "next/link";
import type { Tea } from "@/lib/teas";
import { ProductActions } from "@/components/ProductActions";
import { Arrow, Badge, Figure } from "./ui";

/**
 * PRODUCT CARD
 * ----------------------------------------------------------------------------
 * The single card used for a tea, everywhere it appears — homepage grid, the
 * collection page, related teas. The previous build drew three different cards
 * for the same six products, one of which printed an invented "$12.99".
 *
 * Restraint is deliberate: one image, one category badge, name, one line of
 * positioning, the two facts a buyer actually filters on (strength, origin), and
 * a single quiet call to action. No shadow, no second badge, no price — this is
 * a catalogue for buyers who order by the 50 kg lot, not a shop.
 */
export default function ProductCard({
  tea,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  tea: Tea;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="group flex h-full flex-col rounded-xs border border-line bg-paper transition-colors duration-300 hover:border-line-strong">
      <Link href={`/teas/${tea.slug}`} className="block">
        <Figure image={tea.hero} ratio="portrait" sizes={sizes} priority={priority} zoom>
          <Badge tone="light" className="absolute left-3 top-3">
            {tea.category}
          </Badge>
        </Figure>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/teas/${tea.slug}`} className="block">
          <h3 className="t-h3 text-ink">{tea.name}</h3>
        </Link>

        <p className="t-small mt-2 text-ink-soft">{tea.tagline}</p>

        <div className="mb-4 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-ink-mute">
          <span>{tea.strengthLabel} strength</span>
          <span aria-hidden className="h-2.5 w-px bg-line-strong" />
          <span>{tea.typicalOrigin.join(", ")}</span>
        </div>

        <div className="mt-auto border-t border-line pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute">
              From {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(tea.price)} / kg
            </span>
            <Link href={`/teas/${tea.slug}`} className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-soft transition-colors duration-300 group-hover:text-ink">
              View tea
              <Arrow />
            </Link>
          </div>
          <ProductActions tea={tea} />
        </div>
      </div>
    </div>
  );
}
