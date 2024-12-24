'use client';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { fetchAllOrders } from "@/redux/order/getAllOrderSlice";
import { updateOrderStatus } from "@/redux/order/updateOrderSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { LiaSearchPlusSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
export default function RecentOrders({ doneUpdate, toggleDeleteVisible, setIsOrderFetched, isOrderFetched }) {
    const [isMeta, setIsMeta] = useState({
        page: 1,
        limit: 3,
        total: 0,
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState(""); // Initialize with the default value

    const Router = useRouter();

    const dispatch = useDispatch();

    // Access state from Redux store
    const { orders, meta, isLoading, error } = useSelector((state) => state.allOrders);

    // Correct useState syntax


    // Dispatch fetchAllOrders action on component mount
    useEffect(() => {
        console.log(isOrderFetched);
        if (!isOrderFetched) {
            setTimeout(() => {
                const page = parseInt(searchParams.get("page"), 10) || 1;
                console.log("isOrderFetched is ", isOrderFetched);
                console.log("dhukbe once");
                console.log("Page is ", page);
                dispatch(fetchAllOrders({ page: page, limit: 4 }));
                setIsOrderFetched(true);
                setIsMeta((prev) => ({ ...prev, page: page }));
            }, 500);

        }
    }, [searchParams, dispatch, isOrderFetched]);





    const handleOrderClick = (id) => {
        console.log(id);
        localStorage.setItem("orderID", id);
        Router.push(`orderNo/${id}`);
    }



    useEffect(() => {
        if (orders) {
            // console.log("Orders updated:", orders);
            console.log(meta.page, "is it is");
            setIsMeta({
                page: meta.page || 1,
                limit: meta.limit || 10,
                total: meta.total || 0,
            });
        }
    }, [orders]);

    const totalPages = Math.ceil(isMeta.total / isMeta.limit);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            // Update the query parameters in the URL
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageNumber);
            router.push(`?${params.toString()}`);
            // Update the local state
            setIsMeta((prev) => ({ ...prev, page: pageNumber }));
            setIsOrderFetched(false);

        }
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(isMeta.total / isMeta.limit);
        const currentPage = isMeta.page;

        const pageNumbers = [];
        console.log(currentPage);
        console.log(totalPages);
        if (totalPages <= 6) {
            // If total pages are less than or equal to 6, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include the first page
            pageNumbers.push(1);

            // Initial Pages: Show first 5 pages + ellipsis + last page
            if (currentPage <= 4) {
                for (let i = 2; i <= 5; i++) {
                    pageNumbers.push(i);

                }
                pageNumbers.push("...");
            }
            // Middle Pages: Show 1 + ellipsis + current - 1, current, current + 1 + ellipsis + last page
            else if (currentPage > 4 && currentPage < totalPages - 3) {
                pageNumbers.push("...");
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
                pageNumbers.push("...");
            }
            // Last Pages: Show first page + ellipsis + last 5 pages
            else {
                pageNumbers.push("...");
                for (let i = totalPages - 4; i < totalPages; i++) {
                    pageNumbers.push(i);
                }
            }

            // Always include the last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };





    const handleChange = (e, orderId) => {

        const selectedStatus = e.target.value;
        if (selectedStatus === "Cancel") {
            toggleDeleteVisible(orderId);
        }
        else {
            console.log(`Order ID: ${orderId}, Selected Status: ${selectedStatus}`);
            doneUpdate();
            dispatch(updateOrderStatus({ id: orderId, status: selectedStatus }))
            setTimeout(() => {
                setIsOrderFetched(false);
            }, 2000);
        }




    };


    return (
        <>
            {isLoading && (
                <div className="flex justify-center">
                    <div className="w-1/2">
                        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Loading...
                        </h1>
                    </div>
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

                        {
                            !isLoading && !error && orders && (
                                <>
                                    <div className="w-full overflow-x-auto">

                                        <table className="w-full whitespace-no-wrap">

                                            <thead className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                                                <tr>
                                                    <td className="px-4 py-3 whitespaace-no-wrap">INVOICE NO</td>
                                                    <td className="px-4 py-3">ORDER TIME</td>
                                                    <td className="px-4 py-3">Customer Name </td>
                                                    <td className="px-4 py-3"> METHOD </td>
                                                    <td className="px-4 py-3"> AMOUNT </td>
                                                    <td className="px-4 py-3">STATUS</td>
                                                    <td className="px-4 py-3">ACTION</td>
                                                    <td className="px-4 py-3 text-end">INVOICE</td>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">


                                                {
                                                    orders.map((order) => (
                                                        <tr key={order._id} id={order._id} className="border-b border-gray-200 text-black">
                                                            <td className="px-4 py-3">
                                                                <span className="font-semibold uppercase text-xs text-black">{order._id}</span>
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <span className="text-sm text-black">
                                                                    {new Date(order.dateOrdered).toLocaleString('en-US', {

                                                                        year: 'numeric',  // '2024'
                                                                        month: 'short',   // 'Nov'
                                                                        day: 'numeric',   // '9'
                                                                        hour: 'numeric',  // '2'
                                                                        minute: 'numeric',// '20'
                                                                        hour12: true,     // Use 12-hour format
                                                                    })}
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-3 text-xs">
                                                                <span className="text-sm text-black">{order.user}</span>
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <span className="text-sm font-semibold text-black">Cash</span>
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <span className="text-sm font-semibold text-black">$ {order.totalPrice}</span>
                                                            </td>

                                                            <td className="px-4 py-3 text-xs">
                                                                <span className="font-serif">
                                                                    <span
                                                                        className={`inline-flex px-2 text-sm font-medium leading-5 rounded-full 
                ${order.status === "Pending" ? "text-yellow-500 bg-yellow-100" : ""}
                ${order.status === "Cancel" ? "text-red-500 bg-red-100" : ""}
                ${order.status === "Processing" ? "text-blue-500 bg-blue-100" : ""}
                ${order.status === "Delivered" ? "text-green-500 bg-green-100" : ""}`}
                                                                    >
                                                                        {order.status}
                                                                    </span>
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-3 text-center">
                                                                <select
                                                                    className={`block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border border-gray-200 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-blue-500 focus:outline-none 
            ${order.status === "Cancel" ? "opacity-30 cursor-not-allowed" : ""}`}
                                                                    value={order.status} // Set the initial value to the current status
                                                                    onChange={(e) => handleChange(e, order._id)} // Pass both the event and order ID
                                                                    disabled={order.status === "Cancel"} // Disable if the status is "Cancel"
                                                                >
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Delivered">Delivered</option>
                                                                    <option value="Processing">Processing</option>
                                                                    <option value="Cancel">Cancel</option>
                                                                </select>
                                                            </td>


                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-end gap-x-2">
                                                                    <FiPrinter className="cursor-pointer" />
                                                                    <LiaSearchPlusSolid
                                                                        className="-rotate-90 cursor-pointer"
                                                                        onClick={() => {
                                                                            handleOrderClick(order._id);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }


                                            </tbody>
                                        </table>

                                    </div>
                                </>
                            )
                        }

                        <Pagination>
                            <PaginationContent>
                                {/* Previous Button */}
                                <PaginationItem>
                                    <PaginationPrevious

                                        onClick={() => handlePageChange(isMeta.page - 1)}
                                        disabled={isMeta.page === 1}
                                        className={` ${isMeta.page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        
                                    </PaginationPrevious>
                                </PaginationItem>

                                {/* Page Numbers */}
                                {getPageNumbers().map((pageNumber, index) => (
                                    <PaginationItem key={index}>
                                        {pageNumber === "..." ? (
                                            <span className="px-3 py-1 text-gray-500">...</span>
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`${isMeta.page === pageNumber
                                                    ? "bg-blue-500 text-white font-bold"
                                                    : "bg-gray-200 text-black"
                                                    } rounded px-3 py-1`}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}



                                {/* Next Button */}
                                <PaginationItem>
                                    <PaginationNext

                                        onClick={() => handlePageChange(isMeta.page + 1)}
                                        disabled="true"
                                        className={` ${isMeta.page === totalPages ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    >

                                       
                                    </PaginationNext>
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
            
        </>
    );
}
