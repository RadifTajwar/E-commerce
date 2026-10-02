import type { Metadata } from "next";
import { cookies } from "next/headers";
import OrdersTable from "@/components/storefront/account/OrdersTable";
import { getServerEnv } from "@/config/env";

import { getOrdersByUser, safely } from "@/server/queries";
import { resolveSession } from "@/server/session";

export const metadata: Metadata = { title: "My orders" };

/**
 * Server shell. Middleware already guarantees a session here, so the orders are
 * fetched during the render and arrive with the HTML — no empty frame, no
 * skeleton, no second round trip after hydration.
 */
export default async function Page() {
  const token = cookies().get(getServerEnv().AUTH_COOKIE_NAME)?.value;
  const session = await resolveSession(token);

  const orders = session
    ? await safely("ordersByUser", () => getOrdersByUser(session.email, token), [])
    : [];

  return <OrdersTable initialOrders={orders} />;
}
