"use client";
import PaginationControls from "@/components/admin/PaginationControls";
import SkeletonTable from "@/components/admin/SkeletonTable";
import { usePagination } from "@/components/admin/usePagination";
import { PAGE_SIZE } from "@/config/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllProducts } from "@/store/slices/product.slice";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const SKELETON_HEAD = [
  { skeletons: [{ width: "100px", height: "20px" }] },
  { skeletons: [{ width: "36px", height: "20px" }] },
  { skeletons: [{ width: "71px", height: "20px" }] },
  { cellClassName: "flex justify-end", skeletons: [{ width: "56px", height: "20px" }] },
];

const SKELETON_ROW = [
  {
    innerClassName: "flex items-center",
    skeletons: [
      { variant: "circular", width: 40, height: 40, className: "mr-4" },
      { width: "150px", height: "20px" },
    ],
  },
  { skeletons: [{ width: "36px", height: "20px" }] },
  { skeletons: [{ width: "71px", height: "20px" }] },
  { cellClassName: "flex justify-end", skeletons: [{ width: "56px", height: "20px" }] },
];

export default function AllProducts({ onEdit, onDelete, filters, productsFetched, setProductsFetched }) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { products, meta, isLoading, error } = useAppSelector((state) => state.allProducts);

  // Single place the product list is fetched from: page changes and filter
  // changes both flip `productsFetched` back to false.
  useEffect(() => {
    if (productsFetched) return;
    const page = Number(searchParams.get("page")) || 1;
    dispatch(fetchAllProducts({ page, limit: PAGE_SIZE.admin, ...filters }));
    setProductsFetched(true);
  }, [searchParams, dispatch, productsFetched, setProductsFetched, filters]);

  const onPageChange = useCallback(() => setProductsFetched(false), [setProductsFetched]);
  const { page, totalPages, goToPage } = usePagination(meta, PAGE_SIZE.admin, onPageChange);

  return (
    <>
      {isLoading && <SkeletonTable head={SKELETON_HEAD} row={SKELETON_ROW} />}
      {error && <p>Error: {error}</p>}
      {!isLoading && (
        <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-2 rounded-b-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                <tr>
                  <td className="px-4 py-3">PRODUCT NAME</td>
                  <td className="px-4 py-3">Price</td>
                  <td className="px-4 py-3">Sale Price</td>
                  <td className="px-4 py-3 text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {products.map((product) => (
                  <tr key={product.id} id={product.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="relative  inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={product.imageDefault}
                            alt={product.name}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
                        </div>
                        <div>
                          <h2 className="text-sm font-medium">{product.name}</h2>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold">${product.originalPrice}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold">${product.discountedPrice}</span>
                    </td>

                    <td className="px-4 py-3 ">
                      <div className="flex justify-end gap-x-2">
                        <FiEdit className="cursor-pointer" onClick={() => onEdit(product.id)} />
                        <RiDeleteBin6Line className="cursor-pointer" onClick={() => onDelete(product.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={goToPage} />
    </>
  );
}
