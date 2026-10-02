"use client";
import OrderDetails from "@/components/storefront/account/OrderDetails";
import { ROUTES } from "@/config/constants";
import { fetchOrderById } from "@/store/slices/order.slice";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function OrderReceivedPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, isLoading, error } = useSelector((state) => state.orderById);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (order) return <OrderDetails order={order} variant="received" />;

  // Reaching this page means the server already confirmed the order, so say so
  // straight away. Gating the confirmation on this second fetch used to render
  // a blank page whenever it was slow or failed, and customers re-ordered.
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border-2 border-dashed border-green-600 p-4 mb-8 text-center">
        <h1 className="text-green-600 text-xl">Thank you. Your order has been received.</h1>
        {orderId && <p className="mt-2 text-sm text-gray-700">Order number: {orderId}</p>}
      </div>
      <p className="text-center text-sm text-gray-600">
        {isLoading
          ? "Loading your order details…"
          : "Your order is placed. We could not load the full details just now — you can find it under My Account."}
      </p>
      {!isLoading && error && (
        <p className="mt-4 text-center">
          <Link href={ROUTES.accountOrders} className="text-sm underline text-gray-800">
            Go to my orders
          </Link>
        </p>
      )}
    </div>
  );
}
