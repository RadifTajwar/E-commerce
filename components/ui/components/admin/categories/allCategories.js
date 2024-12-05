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

export default function allProducts({ toggleVisibility, toggleDeleteVisible }) {
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };
    return (


        <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
            <div className="w-full overflow-x-auto">
                <table className='w-full whitespace-no-wrap'>

                    <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                        <tr>
                            <td className="px-4 py-3">
                                <input id="selectAll" name="selectAll" type="checkbox" />
                            </td>
                            <td className="px-4 py-3">ID</td>
                            <td className="px-4 py-3">ICON</td>
                            <td className="px-4 py-3">NAME</td>
                            <td className="px-4 py-3">DESCRIPTION</td>
                          
                            <td className="px-4 py-3 text-center">PUBLISHED</td>
                            <td className="px-4 py-3 text-right">ACTIONS</td>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400'>

                        <tr>
                            <td className="px-4 py-3">
                                <input id="65ff4de7710e101be043e439" name="Cerelac Cornflakes" type="checkbox" />
                            </td>
                            <td className="px-4 py-3">
                            <span className="text-sm">0C24</span>
                                <div className="items-center">
                                    
                                    
                                </div>
                            </td>
                            <td className="px-4 py-3">
                            <div className="relative rounded-full inline-block w-8 h-8 hidden p-1 mr-2 md:block bg-gray-50 shadow-none">
                                        <img
                                            className="object-cover w-full h-full rounded-full"
                                            src="https://i.ibb.co/yYsskBN/Cerelac-Wheat-apple-Cornflakes-400-Gm-BIB.jpg"
                                            alt="product"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                    </div>
                            </td>
                            <td className="px-4 py-3">
                            <span className="text-sm">Baby Food</span>
                            </td>
                            
                            <td className="px-4 py-3">
                                <span className="text-sm">Fish & Meat</span>
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

                                    <FiEdit className="cursor-pointer" onClick={toggleVisibility} />
                                    <RiDeleteBin6Line className="cursor-pointer" onClick={toggleDeleteVisible} />
                                </div>
                            </td>
                        </tr>
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
    )
}
