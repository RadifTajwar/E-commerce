import type { Metadata } from "next";
import CartView from "@/components/storefront/checkout/CartView";

export const metadata: Metadata = {
  title: "Shopping cart",
  description: "Review the items in your cart before checking out.",
};

/** Server shell: client pages cannot export metadata, so the view lives beside it. */
export default function Page() {
  return <CartView />;
}
