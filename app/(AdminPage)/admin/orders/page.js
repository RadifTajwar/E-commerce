'use client';
import DeleteVisible from "@/components/ui/components/admin/orders/deleteVisible";
import RecentOrders from "@/components/ui/components/admin/orders/recentOrders";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Page() {
  const [isOrderFetched, setIsOrderFetched] = useState(false);
  const dispatch = useDispatch();
  const idRef = useRef(null);

  const [deleteVisible, setDeleteVisible] = useState(false)
  const resetId = () => {
    idRef.current = null; // Reset the ID

    setDeleteVisible(false);
  };

  const doneUpdate = () => {
    toast.success("Order Updated Successfully!", {
      position: "top-right",
      autoClose: 3000, // Auto-close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const toggleDeleteVisible = (id) => {
    setDeleteVisible(!deleteVisible);
    if (id && typeof id !== "object") {
      idRef.current = id; // Update idRef only if id is a valid value
    }
  };

  return (
    <>


      {
        deleteVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleDeleteVisible} />
        )
      }
      <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
        <ToastContainer />
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
                    placeholder="Search by Customer Name"
                  />
                </div>
                <div>
                  <select
                    className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none  bg-gray-100 border-transparent focus:bg-white border-gray-300 rounded-lg"
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
                  <select
                    className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  >
                    <option value="Order limits" hidden>
                      Order limits
                    </option>
                    <option value="5">Last 5 days orders</option>
                    <option value="7">Last 7 days orders</option>
                    <option value="15">Last 15 days orders</option>
                    <option value="30">Last 30 days orders</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2 flex items-end">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400">
                    Start Date
                  </label>
                  <input
                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                    type="date"
                    name="startDate"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-400">
                    End Date
                  </label>
                  <input
                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                    type="date"
                    name="endDate"
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

        <RecentOrders doneUpdate={doneUpdate} toggleDeleteVisible={toggleDeleteVisible} isOrderFetched={isOrderFetched} setIsOrderFetched={setIsOrderFetched} />

      </div>

      <div
        className={`fixed w-[576px] h-[306px] top-1/2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-in-out
          ${deleteVisible ? '-translate-y-1/2 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} >
        <DeleteVisible toggleDeleteVisible={toggleDeleteVisible} id={idRef.current} resetId={resetId} doneUpdate={doneUpdate} setIsOrderFetched={setIsOrderFetched} />
      </div>
    </>
  );
}
