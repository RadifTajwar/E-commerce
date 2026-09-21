import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
export default function customerOrder() {
  return (

    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 shadow-lg">
      <div className="w-full overflow-x-auto">

        <table className="w-full whitespace-no-wrap">

          <thead className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
            <tr>
              <td className="px-4 py-3 whitespaace-no-wrap">ORDER ID</td>
              <td className="px-4 py-3">TIME</td>
              <td className="px-4 py-3">SHIPPING ADDRESS</td>
              <td className="px-4 py-3"> PHONE</td>
              <td className="px-4 py-3"> METHOD </td>
              <td className="px-4 py-3"> AMOUNT</td>
              <td className="px-4 py-3 text-center">STATUS</td>
            
              <td className="px-4 py-3 text-center">ACTIONS</td>

            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400 dark:bg-gray-900">



            <tr className="border-b border-gray-200 text-black">
              <td className="px-4 py-3">
                <span className="font-medium uppercase text-xs text-black">2C76</span>
              </td>

              <td className="px-4 py-3">
                <span className="text-sm text-black">Jul 10, 2024</span>
              </td>

              <td className="px-4 py-3 text-xs">
                <span className="text-sm font-regular text-black">Hyderbad</span>
              </td>

              <td className="px-4 py-3 ">
                <span className="text-sm font-regular text-black">123456879</span>
              </td>
              <td className="px-4 py-3 ">
                <span className="text-sm font-regular text-black">Cash</span>
              </td>



              <td className="px-4 py-3 ">
                <span className="text-sm font-semibold text-black">$ 1155</span>
              </td>
              <td className="px-4 py-3 text-xs text-center">
                <span className="font-serif">
                  <span className="inline-flex px-2 text-sm font-medium leading-5 rounded-full text-yellow-500 bg-yellow-100 dark:text-white dark:bg-yellow-600 text-black">Pending</span>
                </span>
              </td>
              <td className="px-4 py-3 text-center text-center">
                <select className="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border border-gray-200 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-blue-500 focus:outline-none ">
                  <option value="status" hidden="">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </td>

            </tr>
          </tbody>
        </table>
        <Pagination>
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
  )
}
