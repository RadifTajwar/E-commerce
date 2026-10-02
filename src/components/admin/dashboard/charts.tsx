"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, EmptyState } from "@/components/admin/ui";
import { formatMoney } from "@/lib/utils";
import type { DayPoint, StatusSlice, TopProduct } from "./useDashboardData";

/**
 * Charts for the dashboard.
 *
 * Colours come from the `.viz` tokens in globals.css — the documented
 * categorical order, validated against this app's own light and dark card
 * surfaces. Every multi-series chart carries a legend and direct values, so
 * identity is never left to hue alone.
 */

/** Categorical slots, read from CSS so the theme toggle repaints them. */
const SERIES = ["var(--viz-1)", "var(--viz-2)", "var(--viz-3)", "var(--viz-4)"];

const AXIS = { fill: "var(--viz-muted)", fontSize: 11 };

/**
 * Compact money for axis ticks. The full `formatMoney` ("$ 1,234.00") is too
 * wide for a tick and wraps onto two lines, which makes the scale unreadable;
 * the tooltip still shows the exact figure.
 */
const compactMoney = (value: number): string => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${Math.round(n)}`;
};

function ChartCard({
  title,
  subtitle,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card className="viz flex flex-col">
      <CardBody className="flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          {aside}
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

/** Tooltip shared by every chart: values in ink, a colour chip for identity. */
function VizTooltip({
  active,
  payload,
  label,
  valueFormat,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: Record<string, unknown> }[];
  label?: string;
  valueFormat: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const head = (payload[0]?.payload?.name as string) ?? label;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      {head && (
        <p className="mb-1 text-xs font-medium text-slate-900 dark:text-white">{String(head)}</p>
      )}
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-slate-600 dark:text-slate-300">
          {entry.name}: <span className="font-semibold">{valueFormat(Number(entry.value ?? 0))}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- status ---- */

export function OrderStatusChart({ slices }: { slices: StatusSlice[] }) {
  const shown = slices.filter((s) => s.count > 0);
  const total = shown.reduce((sum, s) => sum + s.count, 0);

  return (
    <ChartCard title="Orders by status" subtitle={`${total} order${total === 1 ? "" : "s"}`}>
      {total === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="var(--viz-tooltip-bg)"
                >
                  {shown.map((slice, i) => (
                    <Cell key={slice.status} fill={SERIES[i % SERIES.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<VizTooltip valueFormat={(v) => `${v} order${v === 1 ? "" : "s"}`} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend doubles as the value table, so the slices never rely on
              hue — which the light-mode contrast warning requires. */}
          <ul className="w-full space-y-2">
            {shown.map((slice, i) => (
              <li key={slice.status} className="flex items-center gap-2.5 text-sm">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: SERIES[i % SERIES.length] }}
                />
                <span className="flex-1 text-slate-600 dark:text-slate-300">{slice.status}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{slice.count}</span>
                <span className="w-12 text-right text-xs text-slate-400">
                  {Math.round((slice.count / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  );
}

/* ------------------------------------------------------------ revenue ---- */

export function RevenueTrendChart({ trend, days }: { trend: DayPoint[]; days: number }) {
  const total = trend.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <ChartCard
      title="Revenue"
      subtitle={`Last ${days} days`}
      aside={
        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {formatMoney(total)}
        </span>
      }
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* One series, so no legend: the card title names it. */}
          <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--viz-1)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--viz-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={AXIS}
              tickLine={false}
              axisLine={{ stroke: "var(--viz-grid)" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={AXIS}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={(v) => compactMoney(Number(v))}
            />
            <Tooltip
              cursor={{ stroke: "var(--viz-muted)", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<VizTooltip valueFormat={(v) => formatMoney(v)} />}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="var(--viz-1)"
              strokeWidth={2}
              fill="url(#revenueFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--viz-tooltip-bg)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------- order volume ---- */

export function OrderVolumeChart({ trend, days }: { trend: DayPoint[]; days: number }) {
  const total = trend.reduce((sum, d) => sum + d.orders, 0);

  return (
    <ChartCard
      title="Orders placed"
      // Revenue and volume are different scales, so they get their own charts
      // rather than a second y-axis.
      subtitle={`Last ${days} days`}
      aside={
        <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {total}
        </span>
      }
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }} barCategoryGap={4}>
            <XAxis
              dataKey="label"
              tick={AXIS}
              tickLine={false}
              axisLine={{ stroke: "var(--viz-grid)" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: "var(--viz-grid)", fillOpacity: 0.4 }}
              content={<VizTooltip valueFormat={(v) => `${v} order${v === 1 ? "" : "s"}`} />}
            />
            {/* Rounded data-end only; the base stays anchored to the axis. */}
            <Bar dataKey="orders" name="Orders" fill="var(--viz-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------- top products ---- */

export function TopProductsChart({ products }: { products: TopProduct[] }) {
  return (
    <ChartCard title="Best sellers" subtitle="By units sold">
      {products.length === 0 ? (
        <EmptyState title="Nothing sold yet" />
      ) : (
        <div style={{ height: Math.max(180, products.length * 42) }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={products}
              layout="vertical"
              margin={{ top: 0, right: 34, bottom: 0, left: 0 }}
              barCategoryGap={8}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={AXIS}
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "var(--viz-grid)", fillOpacity: 0.4 }}
                content={<VizTooltip valueFormat={(v) => `${v} unit${v === 1 ? "" : "s"}`} />}
              />
              <Bar
                dataKey="units"
                name="Units"
                fill="var(--viz-1)"
                radius={[0, 4, 4, 0]}
                label={{
                  position: "right",
                  fill: "var(--viz-text)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
