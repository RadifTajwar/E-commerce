import "server-only";
import { cookies } from "next/headers";
import { getServerEnv } from "@/config/env";
import { getProfileByEmail, safely } from "@/server/queries";
import { resolveSession } from "@/server/session";

/** The shape the billing form works in, derived from the stored profile. */
export interface SavedAddress {
  name: string;
  address: string;
  district: string;
  zip: string;
  phone: string;
  email: string;
}

/**
 * The upstream stores one address per user on the account itself, with district
 * and zip packed into `location` as "district|zip". Both the account pages and
 * checkout read it through here so they agree on that encoding.
 */
export function unpackAddress(profile: {
  name?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  location?: string;
}): SavedAddress {
  const [district = "", zip = ""] = (profile.location || "").split("|");
  return {
    name: profile.name ?? "",
    address: profile.shippingAddress ?? "",
    district,
    zip,
    phone: profile.phone ?? "",
    email: profile.email ?? "",
  };
}

/** True once the customer has entered enough to be worth pre-filling. */
export function hasAddress(a: SavedAddress): boolean {
  return Boolean(a.address.trim() || a.phone.trim() || a.district.trim());
}

/**
 * The signed-in customer's saved address, read during a server render.
 * Returns null when nobody is signed in; a failed upstream read is absorbed so
 * one optional lookup cannot take down checkout.
 */
export async function getSavedAddress(): Promise<SavedAddress | null> {
  const token = cookies().get(getServerEnv().AUTH_COOKIE_NAME)?.value;
  const session = await resolveSession(token);
  if (!session) return null;

  const profile = await safely("savedAddress", () => getProfileByEmail(session.email, token), null);
  return profile ? unpackAddress(profile as never) : null;
}
