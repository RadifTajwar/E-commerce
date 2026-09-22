"use client";
import SkeletonTable from "@/components/admin/SkeletonTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const SKELETON_HEAD = [
  { skeletons: [{ width: "50px", height: "20px" }] },
  { skeletons: [{ width: "50px", height: "20px" }] },
  { skeletons: [{ width: "100px", height: "20px" }] },
  { cellClassName: "text-right", skeletons: [{ width: "60px", height: "20px" }] },
];

const SKELETON_ROW = [
  { skeletons: [{ width: "50px", height: "20px" }] },
  { skeletons: [{ variant: "rectangular", width: 40, height: 40 }] },
  { skeletons: [{ width: "100px", height: "20px" }] },
  { cellClassName: "text-right", skeletons: [{ variant: "rectangular", width: "60px", height: "20px" }] },
];

export default function AllParentCategories({ onEdit, onDelete }) {
  const dispatch = useAppDispatch();
  const { parentCategories, isLoading, error } = useAppSelector((state) => state.allParentCategories);

  const [categoriesFetched, setCategoriesFetched] = useState(false);

  useEffect(() => {
    if (!categoriesFetched) {
      dispatch(fetchAllParentCategories());
      setCategoriesFetched(true);
    }
  }, [categoriesFetched, dispatch]);

  return (
    <>
      {isLoading && <SkeletonTable head={SKELETON_HEAD} row={SKELETON_ROW} />}
      {error && <p>Error: {error}</p>}
      {!isLoading && (
        <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                <tr>
                  <td className="px-4 py-3">ID</td>
                  <td className="px-4 py-3">ICON</td>
                  <td className="px-4 py-3">NAME</td>
                  <td className="px-4 py-3 text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {parentCategories.map((category) => (
                  <tr key={category.id} id={category.id}>
                    <td className="px-4 py-3">
                      <span className="text-sm">{category.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="object-cover w-full h-full "
                          src={category.image}
                          alt={category.name}
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{category.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-x-2">
                        <FiEdit className="cursor-pointer" onClick={() => onEdit(category.id)} />
                        <RiDeleteBin6Line className="cursor-pointer" onClick={() => onDelete(category.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
