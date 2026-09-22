import type { Metadata } from "next";
import CheckoutView from "@/components/storefront/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your billing details and place your order.",
};

/** Server shell: client pages cannot export metadata, so the view lives beside it. */
export default function Page() {
  return <CheckoutView />;
}
