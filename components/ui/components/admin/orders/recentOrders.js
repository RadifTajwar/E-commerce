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
import OrderRow from "./orderRow";

import { useDispatch, useSelector } from "react-redux";
export default function RecentOrders({ doneUpdate, toggleDeleteVisible, setIsOrderFetched, isOrderFetched, startDate, endDate, email, stat }) {
    const [isMeta, setIsMeta] = useState({
        page: 1,
        limit: 3,
        total: 0,
    });
    const [trackingNumber, setTrackingNumber] = useState('');

    const handleInputChange = (e) => {
        setTrackingNumber(e.target.value); // Update the state with the input value
    };
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
        if (!isOrderFetched) {
            setTimeout(() => {
                const page = parseInt(searchParams.get("page"), 10) || 1;

                // Prepare the request parameters with the page
                const params = { page };

                // Add startDate, endDate, status, and email to params if they are not empty strings
                if (startDate && startDate !== "") {
                    params.startDate = startDate;
                }
                if (endDate && endDate !== "") {
                    params.endDate = endDate;
                }
                if (stat && stat !== "Status") {
                    params.status = stat;
                }
                if (email && email !== "") {
                    params.email = email;
                }

                // Log the parameters to see what is being sent
                

                // Dispatch the fetch request with the prepared parameters
                dispatch(fetchAllOrders(params));

                // Set the fetched state to true
                setIsOrderFetched(true);

                // Update meta state (if needed)
                setIsMeta((prev) => ({ ...prev, page: page }));

            }, 500);
        }
    }, [searchParams, dispatch, isOrderFetched, startDate, endDate, email, status, setIsOrderFetched]);






    const handleOrderClick = (id) => {
     
        localStorage.setItem("orderID", id);
        Router.push(`orderNo/${id}`);
    }



    useEffect(() => {
        if (orders) {
            // console.log("Orders updated:", orders);
            
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





    const handleUpdate = (e, orderId) => {

        const selectedStatus = e.target.value;
        if (selectedStatus === "Cancel") {
            toggleDeleteVisible(orderId);
        }
        else {
            
            doneUpdate();
            dispatch(updateOrderStatus({ id: orderId, status: selectedStatus }))
            setTimeout(() => {
                setIsOrderFetched(false);
            }, 2000);
        }
    };

    const handleTrackCode = (id, track) => {
        // Check if track is empty or null
        if (!track) {
            return;  // Do nothing if track is empty
        }

        // If track is not empty, proceed with the update
        doneUpdate(); // Assuming this is a function to mark the update as done

        // Dispatch the updateOrderStatus action to update the order
        dispatch(updateOrderStatus({ id, trackCode: track }));

        // Reset the isOrderFetched state after a short delay (2 seconds)
        setTimeout(() => {
            setIsOrderFetched(false);
        }, 2000);
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
                                            <td className="px-4 py-3">EMAIL </td>
                                            <td className="px-4 py-3"> TRACKING NUMBER </td>
                                            <td className="px-4 py-3"> AMOUNT </td>
                                            <td className="px-4 py-3">STATUS</td>
                                            <td className="px-4 py-3">ACTION</td>
                                            <td className="px-4 py-3 text-end">INVOICE</td>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">


                                        {
                                            orders.map((order) => (
                                                <OrderRow
                                                    key={order._id}
                                                    order={order}
                                                    handleTrackCode={handleTrackCode}
                                                    handleUpdate={handleUpdate}
                                                    handleOrderClick={handleOrderClick}
                                                />
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
                                disabled={isMeta.page === totalPages }
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
