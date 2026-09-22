"use client";
import { DEFAULT_SHIPPING_COST } from "@/config/constants";
import { notify } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrderById } from "@/store/slices/order.slice";
import jsPDF from "jspdf";
import { useParams } from "next/navigation";
import { Fragment, useEffect } from "react";

/** Invoice header and the lines the backend does not send. */
const INVOICE = {
  shopName: "Leather For Luxury",
  shopAddress: "London, london-1230, England",
  paymentMethod: "Cash",
  shippingCost: DEFAULT_SHIPPING_COST,
  discount: 0,
  fileName: "invoice.pdf",
};

export default function AdminOrderPage() {
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const dispatch = useAppDispatch();

  const { order, isLoading, error } = useAppSelector((state) => state.orderById);

  useEffect(() => {
    if (orderId) dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  const downloadInvoice = async () => {
    const element = document.getElementById("Whole");

    if (!element) {
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Convert HTML to PDF
      await pdf.html(element, {
        x: 10,
        y: 10,
        html2canvas: {
          scale: 0.45, // Ensures good resolution
        },
        callback: (doc) => {
          doc.save(INVOICE.fileName);
        },
      });
    } catch (err) {
      notify.error(err?.message ?? "Could not generate the invoice PDF");
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && order && (
        <>
          <div id="Whole" className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
            <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">
              Invoice
            </h1>
            <div className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden">
              <div>
                <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700 dark:text-gray-300">
                  <h1 className="font-bold font-serif text-xl uppercase">
                    Invoice
                    <p className="text-xs mt-1 text-gray-500">
                      Status
                      <span className="pl-2 font-medium text-xs capitalize">
                        <span className="font-serif">
                          <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-100">
                            {order?.status}
                          </span>
                        </span>
                      </span>
                    </p>
                  </h1>
                  <div className="lg:text-right text-left">
                    <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                      {INVOICE.shopName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {INVOICE.shopAddress}
                    </p>
                  </div>
                </div>
                <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      DATE
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      {order?.dateOrdered}
                    </span>
                  </div>
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      INVOICE NO
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      #{order?._id}
                    </span>
                  </div>
                  <div className="flex flex-col lg:text-right text-left">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      INVOICE TO
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      {order?.name}
                      <br />
                      {order?.email}
                      <br />
                      {order?.city}
                      <br />
                      {order?.city}, {order?.country}, {order?.zip}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 my-8">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full whitespace-no-wrap">
                      <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                        <tr>
                          <td className="px-4 py-3">SR.</td>
                          <td className="px-4 py-3">Product Title</td>
                          <td className="px-4 py-3 text-center">QUANTITY</td>
                          <td className="px-4 py-3 text-center">ITEM PRICE</td>
                          <td className="px-4 py-3 text-right">AMOUNT</td>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-serif text-sm">
                        {(order?.orderItems ?? []).map((item, index) => (
                          <Fragment key={item?._id ?? `${item?.product?._id ?? "item"}-${index}`}>
                            <tr className="dark:border-gray-700 dark:text-gray-400">
                              <td className="px-4 py-3 px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 px-6 py-1 whitespace-nowrap font-normal text-gray-500">
                                {item?.product?.name}
                              </td>
                              <td className="px-4 py-3 px-6 py-1 whitespace-nowrap font-bold text-center">
                                {item?.quantity}
                              </td>
                              <td className="px-4 py-3 px-6 py-1 whitespace-nowrap font-bold text-center">
                                ${item?.product?.discountedPrice}
                              </td>
                              <td className="px-4 py-3 px-6 py-1 whitespace-nowrap text-right font-bold text-red-500 dark:text-blue-500">
                                $
                                {item?.product?.discountedPrice *
                                  item?.quantity}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl border-gray-100 p-8 py-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                <div className="flex lg:flex-row md:flex-row flex-col justify-between">
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                    <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      PAYMENT METHOD
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                      {INVOICE.paymentMethod}
                    </span>
                  </div>
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                    <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      SHIPPING COST
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                      {formatMoney(INVOICE.shippingCost)}
                    </span>
                  </div>
                  <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col sm:flex-wrap">
                    <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      DISCOUNT
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                      {formatMoney(INVOICE.discount)}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-wrap">
                    <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                      TOTAL AMOUNT
                    </span>
                    <span className="text-xl font-serif font-bold text-red-500 dark:text-blue-500 block">
                      {formatMoney(order?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
            <div className="mb-4 mt-3  sm:flex justify-between">
              <div>
                <button
                  className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600  w-auto cursor-pointer mb-4 sm:mb-0"
                  onClick={downloadInvoice}
                >
                  Download Invoice
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
                        d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-133.27 44.48-146.16 106.41"
                      ></path>
                      <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        d="M256 448l-80-112h160z"
                      ></path>
                      <path
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="32"
                        d="M256 448V304"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
              <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600  w-auto">
                Print Invoice
                <span className="ml-2">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
