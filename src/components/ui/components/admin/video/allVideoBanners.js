"use client";
import SkeletonTable from "@/components/admin/SkeletonTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllVideoBanners } from "@/store/slices/banner.slice";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

const SKELETON_HEAD = [
  { skeletons: [{ width: "80px", height: "20px" }] },
  { cellClassName: "flex justify-end", skeletons: [{ width: "60px", height: "20px" }] },
];

const SKELETON_ROW = [
  { skeletons: [{ width: "80px", height: "20px" }] },
  { innerClassName: "flex justify-end gap-x-2", skeletons: [{ width: "30px", height: "20px" }] },
];

export default function AllVideoBanners({ toggleVisibility }) {
  const dispatch = useAppDispatch();
  const { videoBanners, isLoading, error } = useAppSelector((state) => state.allVideoBanners);

  const [bannersFetched, setBannersFetched] = useState(false);

  useEffect(() => {
    if (!bannersFetched) {
      dispatch(fetchAllVideoBanners());
      setBannersFetched(true);
    }
  }, [bannersFetched, dispatch]);

  return (
    <>
      {isLoading && <SkeletonTable head={SKELETON_HEAD} row={SKELETON_ROW} />}
      {error && <p>Error: {error}</p>}
      {!isLoading && videoBanners && (
        <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                <tr>
                  <td className="px-4 py-3">ID</td>
                  <td className="px-4 py-3 text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {videoBanners.map((videoBanner) => (
                  <tr key={videoBanner._id} id={videoBanner._id}>
                    <td className="px-4 py-3">
                      <span className="text-sm">{videoBanner._id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-x-2">
                        <FiEdit className="cursor-pointer" onClick={() => toggleVisibility(videoBanner._id)} />
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
