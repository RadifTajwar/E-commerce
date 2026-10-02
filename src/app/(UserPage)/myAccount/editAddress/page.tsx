import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { getSavedAddress, hasAddress } from "@/server/account";

export const metadata: Metadata = { title: "Addresses" };

/**
 * Saved addresses. Read on the server so the address is in the first paint —
 * this page used to be a static "you have not set up this type of address yet"
 * regardless of what was actually stored.
 */
export default async function EditAddressPage() {
  const saved = await getSavedAddress();
  const isSet = saved ? hasAddress(saved) : false;

  return (
    <div className="w-full px-4 py-2.5 sm:px-8 md:w-2/3 lg:w-3/4">
      <p className="mb-5 text-sm text-gray-500">
        The following addresses will be used on the checkout page by default.
      </p>

      <div className="max-w-md rounded-lg border border-gray-200 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl text-gray-900">BILLING ADDRESS</h2>
          <Link
            href={ROUTES.accountEditAddressBilling}
            className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:opacity-70"
          >
            {isSet ? "Edit" : "Add"}
          </Link>
        </div>

        {isSet && saved ? (
          <address className="space-y-1 text-sm not-italic leading-relaxed text-gray-700">
            {saved.name && <p className="font-medium text-gray-900">{saved.name}</p>}
            {saved.address && <p>{saved.address}</p>}
            {(saved.district || saved.zip) && (
              <p>{[saved.district, saved.zip].filter(Boolean).join(" - ")}</p>
            )}
            {saved.phone && <p>{saved.phone}</p>}
            {saved.email && <p className="text-gray-500">{saved.email}</p>}
          </address>
        ) : (
          <p className="text-sm text-gray-500">You have not set up this type of address yet.</p>
        )}
      </div>
    </div>
  );
}
