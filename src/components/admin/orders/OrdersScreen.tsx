"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AdminPagination, { PAGE_SIZE_OPTIONS } from "@/components/admin/AdminPagination";
import {
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  Input,
  PageHeader,
  Select,
  statusTone,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { IconButton } from "@/components/admin/ui";
import { ORDER_STATUSES, PAGE_SIZE, ROUTES } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, formatMoney } from "@/lib/utils";
import { notify } from "@/lib/toast";
import { isPending } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllOrders, updateOrderStatus } from "@/store/slices/order.slice";
import OrderStatusSelect from "./OrderStatusSelect";
import TrackCodeCell from "./TrackCodeCell";

/** Orders list: one search box, status and date filters, inline status/tracking. */
export default function OrdersScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const ordersState = useAppSelector((state) => state.allOrders);
  const { orders, meta, error } = ordersState;
  const busy = isPending(ordersState);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Typing straight into the query would fire a request per keystroke.
  const debouncedSearch = useDebounce(search, 350);
  const page = Number(searchParams.get("page")) || 1;
  // Rows per page lives in the URL beside the page number, so a shared link
  // reproduces the same view.
  const rawSize = Number(searchParams.get("limit"));
  const pageSize = (PAGE_SIZE_OPTIONS as readonly number[]).includes(rawSize)
    ? rawSize
    : PAGE_SIZE.recentOrders;

  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      ...(debouncedSearch.trim() ? { searchTerm: debouncedSearch.trim() } : {}),
      ...(status ? { status } : {}),
      ...(dates.startDate ? { startDate: dates.startDate } : {}),
      ...(dates.endDate ? { endDate: dates.endDate } : {}),
    }),
    [page, pageSize, debouncedSearch, status, dates.startDate, dates.endDate],
  );

  useEffect(() => {
    void dispatch(fetchAllOrders(query));
  }, [dispatch, query, reloadKey]);

  const goToPage = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(next));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const changePageSize = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(next));
      // A different page size renumbers everything, so go back to the start.
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Any filter change invalidates the current page number.
  const resetToFirstPage = useCallback(() => {
    if (page !== 1) goToPage(1);
  }, [page, goToPage]);

  const changeStatus = async (id: string, next: string) => {
    try {
      await dispatch(updateOrderStatus({ id, status: next })).unwrap();
      notify.success("Order updated");
      setReloadKey((k) => k + 1);
    } catch (err) {
      notify.error((err as Error)?.message ?? String(err));
    }
  };

  const saveTrackCode = async (id: string, trackCode: string) => {
    try {
      await dispatch(updateOrderStatus({ id, trackCode })).unwrap();
      notify.success("Tracking number saved");
      setReloadKey((k) => k + 1);
    } catch (err) {
      notify.error((err as Error)?.message ?? String(err));
    }
  };

  const confirmCancel = async () => {
    if (!cancelId) return;
    await changeStatus(cancelId, "Cancel");
    setCancelId(null);
  };

  const totalPages = meta?.limit ? Math.ceil((meta.total ?? 0) / meta.limit) : 0;
  const cancelNumber = (() => {
    const hit = orders?.find((o) => o._id === cancelId);
    return hit?.orderNumber ? `#${hit.orderNumber}` : "this order";
  })();
  const filtersActive = Boolean(debouncedSearch || status || dates.startDate || dates.endDate);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setDates({ startDate: "", endDate: "" });
    resetToFirstPage();
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          meta?.total
            ? `${meta.total} order${meta.total === 1 ? "" : "s"}${filtersActive ? " matching your filters" : ""}`
            : undefined
        }
      />

      <Card className="mb-5 shrink-0">
        <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              type="search"
              aria-label="Search orders"
              placeholder="Order #, email, phone, tracking…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetToFirstPage();
              }}
            />
          </div>

          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetToFirstPage();
            }}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              aria-label="From date"
              value={dates.startDate}
              onChange={(e) => {
                setDates((d) => ({ ...d, startDate: e.target.value }));
                resetToFirstPage();
              }}
            />
            <span className="text-xs text-slate-400">to</span>
            <Input
              type="date"
              aria-label="To date"
              value={dates.endDate}
              onChange={(e) => {
                setDates((d) => ({ ...d, endDate: e.target.value }));
                resetToFirstPage();
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            {filtersActive && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {error && !busy && (
        <Card className="mb-5 shrink-0 border-red-200 dark:border-red-900/50">
          <CardBody className="text-sm text-red-600 dark:text-red-400">{error}</CardBody>
        </Card>
      )}

      <TableWrap>
        <Table>
          <THead>
            <TR>
              <TH>Order</TH>
              <TH>Placed</TH>
              <TH>Customer</TH>
              <TH>Tracking</TH>
              <TH align="right">Total</TH>
              <TH>Status</TH>
              <TH>Change</TH>
              <TH align="right">View</TH>
            </TR>
          </THead>
          <TBody>
            {busy &&
              [...Array(6)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <TR key={`s${i}`}>
                  {[...Array(8)].map((__, j) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TD key={j}>
                      <div className="h-4 w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
                    </TD>
                  ))}
                </TR>
              ))}

            {!busy &&
              orders?.map((order) => (
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
                    {order.name && (
                      <span className="block text-xs text-slate-400">{order.name}</span>
                    )}
                  </TD>
                  <TD>
                    <TrackCodeCell
                      status={order.status ?? ""}
                      trackCode={order.trackCode}
                      onSave={(code) => saveTrackCode(order._id, code)}
                    />
                  </TD>
                  <TD align="right" className="whitespace-nowrap font-medium text-slate-900 dark:text-white">
                    {formatMoney(order.totalPrice ?? 0)}
                  </TD>
                  <TD>
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </TD>
                  <TD>
                    <OrderStatusSelect
                      status={order.status ?? "Pending"}
                      onChange={(next) =>
                        next === "Cancel" ? setCancelId(order._id) : changeStatus(order._id, next)
                      }
                    />
                  </TD>
                  <TD align="right">
                    <IconButton
                      title="Open order"
                      aria-label={`Open order ${order.orderNumber ?? order._id}`}
                      onClick={() => router.push(ROUTES.admin.order(order._id))}
                    >
                      <svg viewBox="0 0 24 24" fill="none" width="17" height="17" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </IconButton>
                  </TD>
                </TR>
              ))}
          </TBody>
        </Table>

        {!busy && (!orders || orders.length === 0) && (
          <EmptyState
            title={filtersActive ? "No orders match those filters" : "No orders yet"}
            description={
              filtersActive
                ? "Try a different order number, email or date range."
                : "Orders placed in the storefront will appear here."
            }
            action={
              filtersActive ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        )}
      </TableWrap>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        isBusy={busy}
        className="mt-5"
      />

      <ConfirmDeleteDialog
        isOpen={Boolean(cancelId)}
        name={cancelNumber}
        question="Cancel order"
        description="The customer keeps the record, but the order will be marked cancelled. This cannot be undone from here."
        confirmLabel="Cancel order"
        cancelLabel="Keep it"
        onCancel={() => setCancelId(null)}
        onConfirm={confirmCancel}
      />
    </>
  );
}
