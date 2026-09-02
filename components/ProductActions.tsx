"use client";

import { useRouter } from "next/navigation";
import type { Tea } from "@/lib/teas";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui";

export function ProductActions({ tea }: { tea: Tea }) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () => addItem(tea, 1);
  const handleShopNow = () => {
    addItem(tea, 1);
    router.push("/cart");
  };

  return (
    <div className="flex w-full gap-2.5 sm:gap-3">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="flex-1 justify-center"
        onClick={handleAdd}
      >
        Add to Cart
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="flex-1 justify-center"
        onClick={handleShopNow}
      >
        Shop Now
      </Button>
    </div>
  );
}
