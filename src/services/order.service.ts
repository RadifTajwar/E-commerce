import { API } from "@/config/constants";
import type { ApiEnvelope, Paginated } from "@/types/api";
import type { Order, OrderInput, OrderListQuery, OrderUpdateInput } from "@/types/order";
import { http, unwrap, unwrapPaginated } from "./_shared";

export const orderService = {
  list: (params: OrderListQuery = {}): Promise<Paginated<Order>> =>
    http.get<ApiEnvelope<Order[]>>(API.orders, { query: { ...params } }).then(unwrapPaginated),

  getById: (id: string) => http.get<ApiEnvelope<Order>>(API.order(id)).then(unwrap),

  listByUser: (email: string) => http.get<ApiEnvelope<Order[]>>(API.ordersByUser(email)).then(unwrap),

  create: (input: OrderInput) => http.post<ApiEnvelope<Order>>(API.orders, input).then(unwrap),

  update: (id: string, input: OrderUpdateInput) =>
    http.patch<ApiEnvelope<Order>>(API.order(id), input).then(unwrap),
};
