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
  status: OrderStatus | string;
  totalPrice: number;
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
