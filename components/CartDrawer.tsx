"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Button, Container } from "@/components/ui";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CartPageContent() {
  const { items, subtotal, total, updateQuantity, removeItem, closeCart } = useCart();

  if (!items.length) {
    return (
      <Container className="py-20 sm:py-24">
        <div className="mx-auto max-w-xl rounded-xs border border-line bg-paper p-8 text-center sm:p-12">
          <p className="t-eyebrow text-brass-600">Your cart</p>
          <h1 className="t-h1 mt-4">The cart is empty.</h1>
          <p className="t-body mt-4 text-ink-soft">
            Add a tea to start a sample or wholesale order.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/teas" variant="primary" size="sm">
              Continue shopping
            </Button>
            <Button href="/request?type=quote" variant="secondary" size="sm">
              Request a quote
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-20 sm:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="t-eyebrow text-brass-600">Cart</p>
          <h1 className="t-h1 mt-3">Your order</h1>
        </div>
        <Link href="/teas" className="link-draw text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute hover:text-ink" onClick={closeCart}>
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.slug} className="flex gap-4 rounded-xs border border-line bg-paper p-4 sm:p-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xs border border-line bg-paper-soft">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <p className="t-meta text-ink-mute">{item.category}</p>
                  <Link href={`/teas/${item.slug}`} className="mt-1 block text-ink hover:text-ink-soft">
                    <span className="t-h4">{item.name}</span>
                  </Link>
                  <p className="mt-1 text-[0.8rem] text-ink-mute">{formatCurrency(item.price)} / kg</p>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center gap-2 rounded-xs border border-line bg-paper-soft px-2 py-1.5">
                    <button
                      type="button"
                      aria-label={`Decrease quantity for ${item.name}`}
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center text-lg text-ink-mute transition-colors hover:text-ink"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-[0.82rem] font-medium text-ink">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity for ${item.name}`}
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center text-lg text-ink-mute transition-colors hover:text-ink"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right">
                    <p className="t-h4 text-ink">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="self-start text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="rounded-xs border border-line bg-paper-soft p-5 sm:p-6">
          <p className="t-meta text-ink-mute">Order summary</p>
          <dl className="mt-6 space-y-4 text-[0.96rem] text-ink-soft">
            <div className="flex items-center justify-between gap-4">
              <dt>Subtotal</dt>
              <dd className="text-ink">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Shipping</dt>
              <dd>Quote by sales</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
              <dt className="t-h4 text-ink">Total</dt>
              <dd className="t-h4 text-ink">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <div className="mt-8 space-y-3">
            <Button href="/request?type=quote" variant="primary" className="w-full justify-center">
              Proceed to Checkout
            </Button>
            <Button href="/teas" variant="secondary" className="w-full justify-center">
              Continue Shopping
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, total, updateQuantity, removeItem, toast } = useCart();

  return (
    <>
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex justify-center px-5">
          <div className="rounded-xs border border-line bg-paper px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink shadow-[0_18px_35px_-20px_rgba(34,32,28,0.45)] animate-[fadeSwap_0.25s_ease-out]">
            {toast}
          </div>
        </div>
      )}

      {!isOpen ? null : (
        <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-line bg-paper shadow-[0_30px_80px_-40px_rgba(34,32,28,0.45)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <div>
            <p className="t-eyebrow text-brass-600">Cart</p>
            <h2 className="t-h4 mt-1 text-ink">{items.length} item{items.length === 1 ? "" : "s"}</h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-mute transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {!items.length ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xs border border-dashed border-line bg-paper-soft px-5 py-10 text-center">
              <p className="t-h4 text-ink">Your cart is empty.</p>
              <p className="mt-2 text-[0.92rem] text-ink-soft">Add a tea to build a sample order.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.slug} className="flex gap-3 rounded-xs border border-line bg-paper-soft p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xs border border-line bg-paper">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="t-meta text-ink-mute">{item.category}</p>
                      <p className="mt-1 text-[0.96rem] text-ink">{item.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-mute hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 rounded-xs border border-line bg-paper px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center text-base text-ink-mute hover:text-ink"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-[0.8rem] font-medium text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center text-base text-ink-mute hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-medium text-ink">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-line bg-paper-soft p-5 sm:p-6">
          <div className="flex items-center justify-between text-[0.96rem] text-ink-soft">
            <span>Subtotal</span>
            <span className="text-ink">{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[0.96rem] text-ink-soft">
            <span>Total</span>
            <span className="text-ink">{formatCurrency(total)}</span>
          </div>

          <div className="mt-5 flex gap-2.5">
            <Button type="button" variant="secondary" className="flex-1 justify-center" onClick={closeCart}>
              Continue
            </Button>
            <Button href="/request?type=quote" variant="primary" className="flex-1 justify-center">
              Checkout
            </Button>
          </div>
        </div>
        </aside>
      </div>
      )}
    </>
  );
}
