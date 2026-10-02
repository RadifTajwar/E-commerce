import type { ListQuery } from "./api";
import type { OrderStatus } from "@/config/constants";
import type { Product } from "./product";

export interface OrderItem {
  quantity: number;
  /** Product id on input; may be populated with the product on output. */
  product: string | Product;
  color?: string;
  _id?: string;
}

export interface Order {
  /** Short human-facing number, e.g. 1042. Absent on very old records. */
  orderNumber?: number;
  _id: string;
  id?: string;
  orderItems: OrderItem[];
  shippingAddress: string;
  name: string;
  email: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: OrderStatus | string;
  totalPrice: number;
  additionalDetails?: string;
  trackCode?: string;
  dateOrdered?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderInput {
  orderItems: Array<{ quantity: number; product: string; color?: string }>;
  shippingAddress: string;
  name: string;
  email: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  /** Chosen shipping rate. The server prices the order and sets the status. */
  shippingCost: number;
  additionalDetails?: string;
}

export interface OrderUpdateInput {
  status?: OrderStatus | string;
  trackCode?: string;
}

export interface OrderListQuery extends ListQuery {
  status?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}
