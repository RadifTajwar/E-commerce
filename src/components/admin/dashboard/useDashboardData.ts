"use client";

import { useEffect, useState } from "react";
import { ORDER_STATUSES } from "@/config/constants";
import { getErrorMessage } from "@/lib/api/errors";
import { orderService } from "@/services/order.service";
import { productService } from "@/services/product.service";
import type { Order } from "@/types/order";

/** How far back the revenue and volume series run. */
export const TREND_DAYS = 14;

/**
 * The list endpoint caps `limit` at 100, so the aggregates page through rather
 * than asking for one huge page. `MAX_PAGES` bounds the work: past this the
 * figures describe a window, which the UI says out loud.
 */
const PAGE = 100;
const MAX_PAGES = 5;
const ORDER_FETCH_LIMIT = PAGE * MAX_PAGES;

/** Pages the order list until it runs out or hits the ceiling. */
async function fetchOrders(): Promise<{ orders: Order[]; total: number; truncated: boolean }> {
  const first = await orderService.list({ page: 1, limit: PAGE });
  const total = first.meta?.total ?? first.items.length;
  const pages = Math.min(Math.ceil(total / PAGE) || 1, MAX_PAGES);

  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      orderService.list({ page: i + 2, limit: PAGE }),
    ),
  );

  return {
    orders: [first, ...rest].flatMap((p) => p.items ?? []),
    total,
    truncated: total > ORDER_FETCH_LIMIT,
  };
}

export interface StatusSlice {
  status: string;
  count: number;
  revenue: number;
}

export interface DayPoint {
  /** ISO yyyy-mm-dd, used as the series key. */
  day: string;
  /** "26 Sep", for the axis. */
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  units: number;
  revenue: number;
}

export interface DashboardData {
  totalOrders: number;
  /** The newest few, for the table under the charts. */
  recentOrders: Order[];
  ordersToday: number;
  revenue: number;
  averageOrderValue: number;
  statusSlices: StatusSlice[];
  trend: DayPoint[];
  topProducts: TopProduct[];
  /** True when the order set was capped, so the figures describe a window. */
  truncated: boolean;
}

const isoDay = (value: string | Date | undefined): string => {
  const d = value ? new Date(value) : new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const dayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/**
 * Everything the dashboard shows, derived from one pass over the orders.
 *
 * There is no aggregation endpoint on the backend, so the figures are computed
 * here from the most recent `ORDER_FETCH_LIMIT` orders. `truncated` says when
 * that cap was hit, so the page can describe itself honestly rather than
 * implying it has counted the whole history.
 */
export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [orderResult, productPage] = await Promise.all([
          fetchOrders(),
          productService.list({ limit: PAGE }),
        ]);
        if (cancelled) return;

        const orders = orderResult.orders;
        const nameById = new Map(
          (productPage.items ?? []).map((p) => [String(p.id ?? p._id), p.name ?? "Unnamed"]),
        );

        const today = isoDay(new Date());
        let revenue = 0;
        let ordersToday = 0;

        // Seed every status so a zero still gets a slice, and seed every day in
        // the window so a quiet day renders as a gap at zero rather than
        // disappearing and distorting the slope.
        const byStatus = new Map<string, StatusSlice>(
          ORDER_STATUSES.map((s) => [s, { status: s, count: 0, revenue: 0 }]),
        );
        const byDay = new Map<string, DayPoint>();
        for (let i = TREND_DAYS - 1; i >= 0; i -= 1) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = isoDay(d);
          byDay.set(key, { day: key, label: dayLabel(key), revenue: 0, orders: 0 });
        }

        const unitsByProduct = new Map<string, TopProduct>();

        for (const order of orders) {
          const total = Number(order.totalPrice ?? 0);
          const day = isoDay(order.dateOrdered ?? order.createdAt);

          revenue += total;
          if (day === today) ordersToday += 1;

          const slice = byStatus.get(order.status ?? "");
          if (slice) {
            slice.count += 1;
            slice.revenue += total;
          }

          const point = byDay.get(day);
          if (point) {
            point.revenue += total;
            point.orders += 1;
          }

          for (const item of order.orderItems ?? []) {
            // The list endpoint sends the product id; the detail endpoint
            // populates it. Handle both so this does not depend on which.
            const raw = item.product as unknown as { _id?: string; id?: string; name?: string } | string;
            const id = typeof raw === "string" ? raw : String(raw?._id ?? raw?.id ?? "");
            const name = typeof raw === "object" && raw?.name ? raw.name : nameById.get(id);
            if (!name) continue;

            const units = Number(item.quantity ?? 0);
            const entry = unitsByProduct.get(name) ?? { name, units: 0, revenue: 0 };
            entry.units += units;
            unitsByProduct.set(name, entry);
          }
        }

        const topProducts = [...unitsByProduct.values()]
          .sort((a, b) => b.units - a.units)
          .slice(0, 6);

        setData({
          totalOrders: orderResult.total,
          recentOrders: orders.slice(0, 8),
          ordersToday,
          revenue,
          averageOrderValue: orders.length ? revenue / orders.length : 0,
          statusSlices: [...byStatus.values()],
          trend: [...byDay.values()],
          topProducts,
          truncated: orderResult.truncated,
        });
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load the dashboard"));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}
