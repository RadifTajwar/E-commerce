import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { orderService } from "@/services/order.service";
import type { PaginationMeta } from "@/types/api";
import type { Order, OrderInput, OrderListQuery } from "@/types/order";
import { createApiThunk, createRequestSlice } from "../create-request-slice";

const emptyMeta: PaginationMeta = { total: 0, limit: 0, page: 0 };
type Status = "idle" | "loading" | "succeeded" | "failed";

// ---- thunks ------------------------------------------------------------------
export const createOrder = createApiThunk<Order, OrderInput>("orders/create", (input) => orderService.create(input));

export const fetchAllOrders = createApiThunk<{ orders: Order[]; meta: PaginationMeta }, OrderListQuery | void>(
  "orders/fetchAll",
  async (params) => {
    const res = await orderService.list(params ?? {});
    return { orders: res.items, meta: res.meta };
  },
);
export const fetchOrderById = createApiThunk<Order, string>("orders/fetchById", (id) => orderService.getById(id));
export const fetchOrderByUser = createApiThunk<Order[], string>("orders/fetchByUser", (email) =>
  orderService.listByUser(email),
);
export const updateOrderStatus = createApiThunk<Order, { id: string; status?: string; trackCode?: string }>(
  "orders/updateStatus",
  ({ id, status, trackCode }) =>
    orderService.update(id, { ...(status ? { status } : {}), ...(trackCode ? { trackCode } : {}) }),
);

// ---- slices ------------------------------------------------------------------
const create = createRequestSlice<"order", Order | null, Order, OrderInput, { status: Status }>({
  name: "createOrder",
  thunk: createOrder,
  dataKey: "order",
  initialData: null,
  initialExtra: { status: "idle" },
  onPending: (s) => {
    s.status = "loading";
  },
  onFulfilled: (s) => {
    s.status = "succeeded";
  },
  onRejected: (s) => {
    s.status = "failed";
  },
  reducers: {
    resetOrder: (s) => {
      s.status = "idle";
      s.order = null;
      s.error = null;
    },
  },
});

const list = createRequestSlice<"orders", Order[], { orders: Order[]; meta: PaginationMeta }, OrderListQuery | void, { meta: PaginationMeta }>({
  name: "allOrders",
  thunk: fetchAllOrders,
  dataKey: "orders",
  initialData: [],
  initialExtra: { meta: emptyMeta },
  mapResult: (r) => r.orders,
  onFulfilled: (s, result) => {
    s.meta = result.meta ?? emptyMeta;
  },
});

const byId = createRequestSlice({
  name: "orderById",
  thunk: fetchOrderById,
  dataKey: "order",
  initialData: null as Order | null,
});

/** Kept under the historical key `order` even though it holds a list. */
const byUser = createRequestSlice({
  name: "orderByUser",
  thunk: fetchOrderByUser,
  dataKey: "order",
  initialData: null as Order[] | null,
});

const update = createRequestSlice({
  name: "updateOrder",
  thunk: updateOrderStatus,
  dataKey: "order",
  initialData: null,
  reducers: {
    clearState: (s) => {
      s.isLoading = false;
      s.order = null;
      s.error = null;
    },
  },
});

export const resetOrder = create.actions.resetOrder as unknown as ActionCreatorWithoutPayload;
export const createOrderReducer = create.reducer;
export const allOrdersReducer = list.reducer;
export const orderByIdReducer = byId.reducer;
export const orderByUserReducer = byUser.reducer;
export const updateOrderReducer = update.reducer;
