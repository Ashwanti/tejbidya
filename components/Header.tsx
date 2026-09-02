"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { teas } from "@/lib/teas";
import { Arrow, Button, LeafMark } from "./ui";

/**
 * HEADER
 * ----------------------------------------------------------------------------
 * Navigation follows the order a buyer actually reads the site in:
 * what we sell → where it comes from → how it is made → how to buy → who we are.
 *
 * On the homepage the bar sits transparently over the hero photograph and
 * resolves to paper on scroll. Everywhere else it starts solid, so the nav is
 * never a legibility gamble against whatever image is behind it.
 */

const NAV = [
  { href: "/", label: "Home" },
  { href: "/teas", label: "Teas", children: teas },
  { href: "/origins", label: "Origins" },
  { href: "/journey", label: "Craft" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "About" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { count, openCart, closeCart, isOpen: cartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [teasOpen, setTeasOpen] = useState(false);

  const overlay = pathname === "/";
  const solid = scrolled || !overlay || open;

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setOpen(false);
    setTeasOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer or cart is open.
  useEffect(() => {
    document.body.style.overflow = open || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, cartOpen]);

  // Escape closes the mobile drawer or cart.
  useEffect(() => {
    if (!open && !cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (cartOpen) closeCart();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, cartOpen, closeCart]);

  /* Over the hero the bar is transparent and its contents are paper-coloured;
     once solid, everything flips to ink. One boolean drives both. */
  const ink = solid ? "text-ink" : "text-paper";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-soft)] ${
        solid
          ? "border-b border-line bg-paper/92 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"
        style={{ height: "var(--header-h)" }}
      >
        {/* ---- Wordmark ---- */}
        <Link
          href="/"
          className={`group flex items-baseline gap-2.5 transition-colors duration-500 ${ink}`}
          aria-label="Tejbidya — home"
        >
          <LeafMark className="h-[18px] w-[18px] -translate-y-px opacity-70 transition-transform duration-500 group-hover:rotate-[8deg]" />
          <span className="font-display text-[1.45rem] leading-none tracking-[0.01em]">
            Tejbidya
          </span>
        </Link>

        {/* ---- Desktop nav ---- */}
        <nav className={`hidden items-center gap-8 lg:flex ${ink}`} aria-label="Main">
          {NAV.map((item) => {
            /* "/" is a prefix of every route, so Home only counts as active on
               an exact match — otherwise it would light up site-wide. */
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const linkCls = `link-draw py-2 text-[0.78rem] font-medium uppercase tracking-[0.13em] transition-opacity duration-300 ${
              active ? "opacity-100" : "opacity-65 hover:opacity-100"
            }`;

            if (!("children" in item)) {
              return (
                <Link key={item.href} href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setTeasOpen(true)}
                onMouseLeave={() => setTeasOpen(false)}
              >
                <Link href={item.href} className={linkCls}>
                  {item.label}
                </Link>

                {/* Mega-menu. Rendered always, revealed with opacity so the
                    transition can run; pointer-events gate stops it stealing
                    clicks while hidden. */}
                <div
                  className={`absolute left-1/2 top-full w-[min(92vw,620px)] -translate-x-1/2 pt-3 transition-all duration-300 ease-[var(--ease-soft)] ${
                    teasOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-xs border border-line bg-paper shadow-[0_24px_60px_-32px_rgba(34,32,28,0.35)]">
                    <div className="grid grid-cols-2 gap-px bg-line">
                      {item.children.map((tea) => (
                        <Link
                          key={tea.slug}
                          href={`/teas/${tea.slug}`}
                          className="group/i bg-paper px-5 py-4 transition-colors duration-300 hover:bg-paper-soft"
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="t-h4 text-ink">{tea.name}</span>
                            <Arrow className="text-ink-mute opacity-0 transition-opacity duration-300 group-hover/i:opacity-100" />
                          </span>
                          <span className="mt-1 block text-[0.8rem] leading-snug text-ink-mute">
                            {tea.strengthLabel} · MOQ{" "}
                            {tea.moqKg ? `${tea.moqKg} kg` : "on request"}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/tea-finder"
                      className="group/f flex items-center justify-between gap-4 bg-paper-soft px-5 py-3.5 text-ink"
                    >
                      <span className="t-eyebrow text-ink-mute">Not sure where to start?</span>
                      <span className="flex items-center gap-2 text-[0.78rem] font-medium">
                        Tea finder
                        <Arrow />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ---- Actions ---- */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className={`relative flex h-11 w-11 items-center justify-center rounded-xs border transition-colors duration-500 ${
              cartOpen ? "border-ink bg-paper-soft" : solid ? "border-line hover:border-ink" : "border-paper/25 hover:border-paper"
            } ${ink}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.7]">
              <path d="M3 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
              <circle cx="17" cy="17.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf-900 px-1 text-[0.62rem] font-medium text-paper">
                {count}
              </span>
            )}
          </button>

          {/*
            Wrapped rather than given `hidden sm:inline-flex` directly: Button's
            base already sets `inline-flex`, and two display utilities of equal
            specificity resolve by stylesheet order, not class order — so
            `hidden` lost and the CTA collided with the wordmark on phones.
          */}
          <span className="hidden sm:block">
            <Button
              href="/request?type=sample"
              size="sm"
              variant={solid ? "primary" : "secondary"}
              onDark={!solid}
            >
              Request samples
            </Button>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`-mr-2 flex h-11 w-11 items-center justify-center transition-colors duration-500 lg:hidden ${ink}`}
          >
            <span className="relative block h-3 w-[22px]">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[var(--ease-soft)] ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-400 ease-[var(--ease-soft)] ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ---- Mobile drawer ---- */}
      <div
        className={`overflow-hidden border-t border-line bg-paper transition-[max-height] duration-500 ease-[var(--ease-soft)] lg:hidden ${
          open ? "max-h-[80vh] overflow-y-auto" : "max-h-0 border-transparent"
        }`}
      >
        <nav className="px-5 pb-8 pt-2 sm:px-8" aria-label="Mobile">
          {NAV.map((item) => (
            <div key={item.href} className="border-b border-line">
              <Link href={item.href} className="block py-3.5 font-display text-[1.4rem] text-ink">
                {item.label}
              </Link>
              {"children" in item && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pb-3">
                  {item.children.map((tea) => (
                    <Link
                      key={tea.slug}
                      href={`/teas/${tea.slug}`}
                      className="py-1.5 text-[0.85rem] text-ink-mute"
                    >
                      {tea.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 flex flex-col gap-2.5">
            <Button href="/request?type=sample" variant="primary" className="w-full">
              Request samples
              <Arrow />
            </Button>
            <Button href="/contact" variant="secondary" className="w-full">
              Contact us
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
