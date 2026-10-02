"use client";
import OrdersScreen from "@/components/admin/orders/OrdersScreen";
import { Suspense } from "react";

/** OrdersScreen reads the page number from the query string. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrdersScreen />
    </Suspense>
  );
}
