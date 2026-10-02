import type { Metadata } from "next";
import BillingAddressForm from "@/components/storefront/account/BillingAddressForm";
import { getSavedAddress } from "@/server/account";

export const metadata: Metadata = { title: "Billing address" };

/** Server shell: the saved address is loaded here so the form opens filled in. */
export default async function Page() {
  return <BillingAddressForm initialAddress={await getSavedAddress()} />;
}
