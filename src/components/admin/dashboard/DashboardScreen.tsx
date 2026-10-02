"use client";

import { useRouter } from "next/navigation";
import RowActions from "@/components/admin/RowActions";
import TableSkeletonRows from "@/components/admin/TableSkeletonRows";
import {
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  PageHeader,
  statusTone,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { ROUTES } from "@/config/constants";
import { formatDate, formatMoney } from "@/lib/utils";
import {
  OrderStatusChart,
  OrderVolumeChart,
  RevenueTrendChart,
  TopProductsChart,
} from "./charts";
import { TREND_DAYS, useDashboardData } from "./useDashboardData";

/** A single headline figure. Not a chart: one number has no shape to show. */
function StatTile({ label, value, hint }: { label: string; value?: string; hint?: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {value === undefined ? (
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
        ) : (
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        )}
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </CardBody>
    </Card>
  );
}

/**
 * Dashboard.
 *
 * Every figure comes from a real query over the orders. The screen this
 * replaced showed four hardcoded "₹0.00" tiles and a pie chart of invented
 * sections, which is worse than showing nothing — it looks like data.
 */
export default function DashboardScreen() {
  const router = useRouter();
  const { data, error } = useDashboardData();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="How the store is doing right now."
        actions={
          <Button variant="secondary" onClick={() => router.push(ROUTES.admin.orders)}>
            View all orders
          </Button>
        }
      />

      {/* The dashboard scrolls as a whole rather than each panel separately. */}
      <div className="min-h-0 flex-1 overflow-auto pb-2">
        {error && (
          <Card className="mb-5 border-red-200 dark:border-red-900/50">
            <CardBody className="text-sm text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        )}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            label="Revenue"
            value={data ? formatMoney(data.revenue) : undefined}
            hint={data?.truncated ? "Most recent 500 orders" : "All time"}
          />
          <StatTile label="Orders" value={data ? String(data.totalOrders) : undefined} />
          <StatTile label="Orders today" value={data ? String(data.ordersToday) : undefined} />
          <StatTile
            label="Average order"
            value={data ? formatMoney(data.averageOrderValue) : undefined}
          />
        </div>

        {data ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <RevenueTrendChart trend={data.trend} days={TREND_DAYS} />
            <OrderVolumeChart trend={data.trend} days={TREND_DAYS} />
            <OrderStatusChart slices={data.statusSlices} />
            <TopProductsChart products={data.topProducts} />
          </div>
        ) : (
          !error && (
            <div className="grid gap-4 xl:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Card key={i}>
                  <CardBody>
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
                    <div className="mt-4 h-[220px] animate-pulse rounded bg-slate-200/50 dark:bg-slate-800/60" />
                  </CardBody>
                </Card>
              ))}
            </div>
          )
        )}

        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-900 dark:text-white">
          Recent orders
        </h3>

        <TableWrap scrollable={false}>
          <Table>
            <THead>
              <TR>
                <TH>Order</TH>
                <TH>Placed</TH>
                <TH>Customer</TH>
                <TH align="right">Total</TH>
                <TH>Status</TH>
                <TH align="right">Open</TH>
              </TR>
            </THead>
            <TBody>
              {!data && !error && <TableSkeletonRows columns={6} rows={5} />}
              {data?.recentOrders.map((order) => (
                <TR key={order._id}>
                  <TD>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {order.orderNumber ? `#${order.orderNumber}` : "—"}
                    </span>
                  </TD>
                  <TD className="whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDate(order.dateOrdered ?? order.createdAt)}
                  </TD>
                  <TD>
                    <span className="block max-w-[220px] truncate" title={order.email}>
                      {order.email}
                    </span>
                  </TD>
                  <TD
                    align="right"
                    className="whitespace-nowrap font-medium text-slate-900 dark:text-white"
                  >
                    {formatMoney(order.totalPrice ?? 0)}
                  </TD>
                  <TD>
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </TD>
                  <TD align="right">
                    <RowActions
                      label={`order ${order.orderNumber ?? ""}`}
                      onEdit={() => router.push(ROUTES.admin.order(order._id))}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          {data?.recentOrders.length === 0 && (
            <EmptyState
              title="No orders yet"
              description="Orders placed in the storefront will appear here."
            />
          )}
        </TableWrap>
      </div>
    </>
  );
}
