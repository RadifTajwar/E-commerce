'use client';
import { Suspense } from "react";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import RecentOrders from "@/components/ui/components/admin/orders/recentOrders";
import { isObjectId, ORDER_STATUS } from "@/config/constants";
import { notify } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrderById, updateOrderStatus } from "@/store/slices/order.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
function PageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const [isInput, setIsInput] = useState("");
  const dispatch = useAppDispatch();
  const [cancelId, setCancelId] = useState(null);
  const [status, setStatus] = useState("Status"); // Initialize with default value

  const { order } = useAppSelector((state) => state.orderById);
  const cancelName = order && order._id === cancelId ? order._id : "";

  const handleChange = (e) => {
    setStatus(e.target.value);
    if (e.target.value === "Status") {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", 1);
    router.push(`?${params.toString()}`, { shallow: true, scroll: false });
    setIsOrderFetched(false);
  };
  
  const doneUpdate = () => notify.success("Order Updated Successfully!");

  /** Cancelling an order is a status change, so it goes through the same dialog. */
  const openCancel = (id) => {
    if (!id || typeof id === "object") return;
    setCancelId(id);
    if (isObjectId(id)) dispatch(fetchOrderById(id));
  };
  const closeCancel = () => setCancelId(null);

  const confirmCancel = async () => {
    if (!cancelId) return;
    try {
      await dispatch(updateOrderStatus({ id: cancelId, status: ORDER_STATUS.cancelled })).unwrap();
      closeCancel();
      doneUpdate();
      setIsOrderFetched(false);
    } catch (err) {
      notify.error(err?.message ?? String(err));
    }
  };
  const handleInputChange = (event) => {
    const { value } = event.target;
    setIsInput(value);

    setIsOrderFetched(false);
  };
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const handleChangeDate = (e) => {
    const { name, value } = e.target;

    // Update the dates in the state
    setDates((prev) => ({
      ...prev,
      [name]: value, // This keeps the value in yyyy-mm-dd format
    }));

    // Check if startDate or endDate is being updated
    setIsOrderFetched(false);
  };


  return (
    <>


      <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">
          Orders
        </h1>
        <div className="min-w-0 rounded-lg border border-gray-200 overflow-hidden bg-white dark:bg-gray-800 min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <div className="p-4">
            <form>
              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                <div>
                  <input
                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border border-gray-300 rounded-lg dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                    type="search"
                    name="search"
                    value={isInput}
                    placeholder="Search by Customer Email"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <select
                    value={status} // Controlled value
                    onChange={handleChange} // Event handler for changes
                    className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none bg-gray-100 border-transparent focus:bg-white border-gray-300 rounded-lg"
                  >
                    <option value="Status" hidden>
                      Status
                    </option>
                    <option value="Delivered">Delivered</option>

                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
                <div>

                </div>
              </div>
              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2 flex items-end">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400">
                    Start Date
                  </label>
                  <input
                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none bg-gray-100 border-transparent focus:bg-white"
                    type="date"
                    name="startDate"
                    value={dates.startDate} // Controlled value
                    onChange={handleChangeDate} // Update state
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400">
                    End Date
                  </label>
                  <input
                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none bg-gray-100 border-transparent focus:bg-white"
                    type="date"
                    name="endDate"
                    value={dates.endDate} // Controlled value
                    onChange={handleChangeDate} // Update state
                  />
                </div>
                <div>
                  <label
                    className="block text-sm text-gray-700 dark:text-gray-400 hidden"
                  >
                    Download
                  </label>
                  <button
                    type="button"
                    className="false flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium focus:outline-none px-6 py-2 rounded-md text-white bg-[#0e9f6e] border border-transparent active:bg-green-600 hover:bg-green-700"
                  >
                    Download All Orders
                    <span className="ml-2 text-base">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="32"
                          d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56m0 64.1l64 63.9 64-63.9M256 224v224.03"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <RecentOrders doneUpdate={doneUpdate} toggleDeleteVisible={openCancel} isOrderFetched={isOrderFetched} setIsOrderFetched={setIsOrderFetched} startDate={dates.startDate} endDate={dates.endDate} stat={status} email={isInput} />

      </div>

      <ConfirmDeleteDialog
        isOpen={Boolean(cancelId)}
        name={cancelName}
        onCancel={closeCancel}
        onConfirm={confirmCancel}
        question="Are You Sure! Want to Cancel"
        confirmLabel="Yes, Cancel It"
      />
    </>
  );
}

/** useSearchParams() requires a Suspense boundary for static prerendering. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
