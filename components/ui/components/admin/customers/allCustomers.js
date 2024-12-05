import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { LiaSearchPlusSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
export default function allCustomers({ toggleVisibility, toggleDeleteVisible }) {
    return (


        <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 shadow-lg">
            <div className="w-full overflow-x-auto">

                <table className="w-full whitespace-no-wrap">

                    <thead className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                        <tr>
                            <td className="px-4 py-3 whitespaace-no-wrap">ID</td>
                            <td className="px-4 py-3">JOINING DATE</td>
                            <td className="px-4 py-3">NAME</td>
                            <td className="px-4 py-3"> EMAIL</td>
                            <td className="px-4 py-3"> PHONE </td>

                            <td className="px-4 py-3 text-end">ACTIONS</td>

                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">



                        <tr className="border-b border-gray-200 text-black">
                            <td className="px-4 py-3">
                                <span className="font-medium uppercase text-xs text-black">96E9</span>
                            </td>

                            <td className="px-4 py-3">
                                <span className="text-sm text-black">Jul 10, 2024</span>
                            </td>

                            <td className="px-4 py-3 text-xs">
                                <span className="text-sm font-regular text-black">webdesigner</span>
                            </td>

                            <td className="px-4 py-3 ">
                                <span className="text-sm font-regular text-black">webdesigner278@gmail.com</span>
                            </td>

                            <td className="px-4 py-3 ">
                                <span className="text-sm font-semibold text-black"></span>
                            </td>

                            <td className="px-4 py-3 ">
                                <div className="flex justify-end gap-x-2">

                                    <Link href="/admin/customer-order/1"><LiaSearchPlusSolid className="-rotate-90 cursor-pointer" /></Link>
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
