"use client";
import OrderDetailsOnOrderUserPage from "@/components/ui/components/viewOrder/orderDetailsOnOrderUserPage";
import { fetchOrderById } from "@/store/slices/order.slice";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function page() {
  const pathname = usePathname();
  const productId = pathname.split("/").pop();
  const dispatch = useDispatch();

  const { order, isLoading, error } = useSelector((state) => state.orderById);
  useEffect(() => {
    if (productId) {
      dispatch(fetchOrderById(productId));
    }
  }, [dispatch, productId]);

  return (
    <>{!isLoading && order && <OrderDetailsOnOrderUserPage order={order} />}</>
  );
}
