"use client";
import OrderDetails from "@/components/storefront/account/OrderDetails";
import { fetchOrderById } from "@/store/slices/order.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ViewOrderPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { order, isLoading, error } = useSelector((state) => state.orderById);

  useEffect(() => {
    if (productId) {
      dispatch(fetchOrderById(productId));
    }
  }, [dispatch, productId]);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!isLoading && order && <OrderDetails order={order} variant="account" />}
    </>
  );
}
