import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Switch from '@mui/material/Switch';
import { useState } from 'react';
import { FiEdit } from "react-icons/fi";

import { RiDeleteBin6Line } from "react-icons/ri";

import { useEffect } from 'react';


import { fetchAllProducts } from "@/redux/product/allProductsSlice";
import { useDispatch, useSelector } from "react-redux";

export default function allProducts({ toggleVisibility, toggleDeleteVisible }) {
    const dispatch = useDispatch();

    // Access products, loading, and error states from the Redux store
    const { products, isLoading, error } = useSelector((state) => state.allProducts);

    // State to track if products have been fetched
    const [productsFetched, setProductsFetched] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        if (!productsFetched) {
            dispatch(fetchAllProducts());
            setProductsFetched(true); // Mark products as fetched
        }
    }, [productsFetched, dispatch]);

    // Log products after they are updated
    useEffect(() => {
        console.log("Updated products:", products); // Logs updated products
    }, [products]);

    const [checked, setChecked] = useState(true);

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
                                         <tr>
                                    <td className="px-4 py-3">
                                        <input  id={product.id} name={product.name}  type="checkbox" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="relative rounded-full inline-block w-8 h-8 hidden p-1 mr-2 md:block bg-gray-50 shadow-none">
                                                <img
                                                    className="object-cover w-full h-full rounded-full"
                                                    src="https://i.ibb.co/yYsskBN/Cerelac-Wheat-apple-Cornflakes-400-Gm-BIB.jpg"
                                                    alt="product"
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
                            <Pagination className="flex justify-start md:justify-center">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext href="#" />
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
