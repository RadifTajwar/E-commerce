"use client";
import OrderDetails from "@/components/storefront/account/OrderDetails";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { isPending } from "@/store/create-request-slice";
import { fetchOrderById } from "@/store/slices/order.slice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ViewOrderPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.orderById);
  const { order, error } = orderState;
  const busy = isPending(orderState);

  useEffect(() => {
    if (productId) {
      dispatch(fetchOrderById(productId));
    }
  }, [dispatch, productId]);

  return (
    <>
      {busy && <TableSkeleton rows={4} />}
      {error && !busy && <div className="px-8 py-2.5 text-sm text-red-600">{error}</div>}
      {!busy && order && <OrderDetails order={order} variant="account" />}
    </>
  );
}
