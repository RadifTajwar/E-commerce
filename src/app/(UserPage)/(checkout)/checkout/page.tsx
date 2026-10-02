import type { Metadata } from "next";
import CheckoutView from "@/components/storefront/checkout/CheckoutView";
import { getSavedAddress } from "@/server/account";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your billing details and place your order.",
};

/**
 * Server shell: client pages cannot export metadata, so the view lives beside it.
 * The signed-in customer's saved address is read here and pre-fills the billing
 * form, so a returning customer does not retype it on every order.
 */
export default async function Page() {
  return <CheckoutView initialAddress={await getSavedAddress()} />;
}
