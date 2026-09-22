"use client";
import PaginationControls from "@/components/admin/PaginationControls";
import { PAGE_SIZE, ROUTES } from "@/config/constants";
import { notify } from "@/lib/toast";
import { fetchAllOrders, updateOrderStatus } from "@/store/slices/order.slice";
import { Skeleton } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderRow from "./orderRow";
export default function RecentOrders({
  doneUpdate,
  toggleDeleteVisible,
  setIsOrderFetched,
  isOrderFetched,
  startDate,
  endDate,
  email,
  stat,
}) {
  const [isMeta, setIsMeta] = useState({
    page: 1,
    limit: PAGE_SIZE.recentOrders,
    total: 0,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Access state from Redux store
  const { orders, meta, isLoading, error } = useSelector(
    (state) => state.allOrders
  );

  // Correct useState syntax

  // Dispatch fetchAllOrders action on component mount
  useEffect(() => {
    if (isOrderFetched) return;

    const page = parseInt(searchParams.get("page"), 10) || 1;
    const params = { page };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (stat && stat !== "Status") params.status = stat;
    if (email) params.email = email;

    dispatch(fetchAllOrders(params));
    setIsOrderFetched(true);
    setIsMeta((prev) => ({ ...prev, page }));
  }, [searchParams, dispatch, isOrderFetched, startDate, endDate, email, stat, setIsOrderFetched]);

  const handleOrderClick = (id) => {
    router.push(ROUTES.admin.order(id));
  };

  useEffect(() => {
    if (!orders || !meta) return;
    setIsMeta({
      page: meta.page || 1,
      limit: meta.limit || PAGE_SIZE.recentOrders,
      total: meta.total || 0,
    });
  }, [orders, meta]);

  const totalPages = Math.ceil(isMeta.total / isMeta.limit);

  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      // Update the query parameters in the URL

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber);
      router.push(`?${params.toString()}`, { shallow: true, scroll: false });
      // Update the local state
      setIsMeta((prev) => ({ ...prev, page: pageNumber }));
      setIsOrderFetched(false);
    }
  }, [router, searchParams, setIsOrderFetched, totalPages]);

  const handleUpdate = async (e, orderId) => {
    const selectedStatus = e.target.value;
    if (selectedStatus === "Cancel") {
      toggleDeleteVisible(orderId);
      return;
    }
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: selectedStatus })).unwrap();
      doneUpdate();
      setIsOrderFetched(false);
    } catch (err) {
      notify.error(err?.message ?? String(err));
    }
  };

  const handleTrackCode = async (id, track) => {
    if (!track) return;
    try {
      await dispatch(updateOrderStatus({ id, trackCode: track })).unwrap();
      doneUpdate();
      setIsOrderFetched(false);
    } catch (err) {
      notify.error(err?.message ?? String(err));
    }
  };

  return (
    <>
      {isLoading && (
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
              <tr>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="120px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="100px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="180px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="140px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="100px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="100px" height="20px" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton variant="text" width="80px" height="20px" />
                </td>
                <td className="px-4 py-3 flex justify-end">
                  <Skeleton variant="text" width="80px" height="20px" />
                </td>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="120px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="100px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="180px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="140px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="100px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="100px" height="20px" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton variant="text" width="80px" height="20px" />
                  </td>
                  <td className="px-4 py-3 text-end flex justify-end items-center space-x-2">
                    <Skeleton variant="text" width="40px" height="20px" />
                    <Skeleton variant="text" width="40px" height="20px" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <div className="flex justify-center">
          <div className="w-1/2">
            <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {error}
            </h1>
          </div>
        </div>
      )}

      <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 shadow-lg">
        {!isLoading && !error && orders && (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full whitespace-no-wrap">
                <thead className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                  <tr>
                    <td className="px-4 py-3 whitespaace-no-wrap">
                      INVOICE NO
                    </td>
                    <td className="px-4 py-3">ORDER TIME</td>
                    <td className="px-4 py-3">EMAIL </td>
                    <td className="px-4 py-3"> TRACKING NUMBER </td>
                    <td className="px-4 py-3"> AMOUNT </td>
                    <td className="px-4 py-3">STATUS</td>
                    <td className="px-4 py-3">ACTION</td>
                    <td className="px-4 py-3 text-end">INVOICE</td>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">
                  {orders.map((order) => (
                    <OrderRow
                      key={order._id}
                      order={order}
                      handleTrackCode={handleTrackCode}
                      handleUpdate={handleUpdate}
                      handleOrderClick={handleOrderClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <PaginationControls page={isMeta.page} totalPages={totalPages} onPageChange={handlePageChange} className="" />
      </div>
    </>
  );
}
