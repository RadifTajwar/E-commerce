import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import Switch from '@mui/material/Switch';
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from 'react';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useEffect } from 'react';


import { fetchAllProducts } from "@/redux/product/allProductsSlice";
import { useDispatch, useSelector } from "react-redux";

export default function allProducts({ toggleVisibility, toggleDeleteVisible }) {
    const dispatch = useDispatch();
    const [isMeta, setIsMeta] = useState({
        page: 1,
        limit: 5,
        total: 0,
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    // Access products, loading, and error states from the Redux store
    const { products, meta, isLoading, error } = useSelector((state) => state.allProducts);

    // State to track if products have been fetched
    const [productsFetched, setProductsFetched] = useState(false);

  

    // Dispatch fetchAllOrders action on component mount
    useEffect(() => {
        console.log(productsFetched);
        if (!productsFetched) {
            setTimeout(() => {
                const page = parseInt(searchParams.get("page"), 10) || 1;
                dispatch(fetchAllProducts({ page: page, limit: 2 }));
                setIsMeta((prev) => ({ ...prev, page: page }));
                setProductsFetched(true);
            }, 500);

        }
    }, [searchParams, dispatch, productsFetched]);





    const [checked, setChecked] = useState(true);


    useEffect(() => {
        if (products) {
            // console.log("Orders updated:", orders);
            console.log(meta.page, "is it is");
            setIsMeta({
                page: meta.page || 1,
                limit: meta.limit || 10,
                total: meta.total || 0,
            });
        }
    }, [products]);

    const totalPages = Math.ceil(isMeta.total / isMeta.limit);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            // Update the query parameters in the URL
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", pageNumber);
            router.push(`?${params.toString()}`);
            // Update the local state
            setIsMeta((prev) => ({ ...prev, page: pageNumber }));
            setProductsFetched(false);

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





    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    return (
        <>
            {isLoading && <p>Loading categories...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && (

                <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
                    <div className="w-full overflow-x-auto">
                        <table className='w-full whitespace-no-wrap'>

                            <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                                <tr>
                                    <td className="px-4 py-3">
                                        <input id="selectAll" name="selectAll" type="checkbox" />
                                    </td>
                                    <td className="px-4 py-3">PRODUCT NAME</td>
                                    <td className="px-4 py-3">CATEGORY</td>
                                    <td className="px-4 py-3">Price</td>
                                    <td className="px-4 py-3">Sale Price</td>
                                    <td className="px-4 py-3">STOCK</td>
                                    <td className="px-4 py-3">STATUS</td>
                                    <td className="px-4 py-3 text-center">View</td>
                                    <td className="px-4 py-3 text-center">PUBLISHED</td>
                                    <td className="px-4 py-3 text-right">ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400'>
                                {
                                    products.map((product) => (
                                        <>
                                            <tr key={product.id} id={product.id}>
                                                <td className="px-4 py-3">
                                                    <input id={product.id} name={product.name} type="checkbox" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="relative  inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                                                            <img
                                                                className="object-cover w-full h-full rounded-full"
                                                                src={product.imageDefault}
                                                                alt={product.name}
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                                        </div>
                                                        <div>
                                                            <h2 className="text-sm font-medium">{
                                                                product.name}</h2>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm">Baby Food</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-semibold">${product.originalPrice}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm font-semibold">${product.discountedPrice}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm">597</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-100">
                                                        Selling
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <a className="flex justify-center text-gray-400 hover:text-blue-600" href="/product/65ff4de7710e101be043e439">
                                                        <p data-tip="true" data-for="view" currentitem="false">
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
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                                                <line x1="8" y1="11" x2="14" y2="11"></line>
                                                            </svg>
                                                        </p>
                                                    </a>
                                                </td>


                                                <td className="px-4 py-3 text-center">
                                                    <Switch
                                                        checked={checked}
                                                        onChange={handleChange}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 ">
                                                    <div className="flex justify-end gap-x-2">

                                                        <FiEdit
                                                            className="cursor-pointer"
                                                            onClick={() => toggleVisibility(product.id)} // No re-fetch
                                                        />
                                                        <RiDeleteBin6Line
                                                            className="cursor-pointer"
                                                            onClick={() => toggleDeleteVisible(product.id)} // No re-fetch
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    ))}

                            </tbody>
                        </table>
                        <div className="">
                            <Pagination>
                                <PaginationContent>
                                    {/* Previous Button */}
                                    <PaginationItem>
                                        <PaginationPrevious

                                            onClick={() => handlePageChange(isMeta.page - 1)}
                                            disabled={isMeta.page === 1}
                                            className={` ${isMeta.page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            Previous
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

                                            Next

                                        </PaginationNext>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>

                        </div>

                    </div>
                </div>

            )}

        </>
    )
}
