"use client";
import OrderDetails from "@/components/storefront/account/OrderDetails";
import { fetchOrderById } from "@/store/slices/order.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function OrderReceivedPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, isLoading } = useSelector((state) => state.orderById);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  return <>{!isLoading && order && <OrderDetails order={order} variant="received" />}</>;
}
