"use client";
import SkeletonTable from "@/components/admin/SkeletonTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllHeroBanners } from "@/store/slices/banner.slice";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

const SKELETON_HEAD = [
  { skeletons: [{ width: "50px", height: "20px" }] },
  { skeletons: [{ width: "80px", height: "20px" }] },
  { skeletons: [{ width: "80px", height: "20px" }] },
  { skeletons: [{ width: "100px", height: "20px" }] },
  { cellClassName: "text-right", skeletons: [{ width: "60px", height: "20px" }] },
];

const SKELETON_ROW = [
  { skeletons: [{ width: "50px", height: "20px" }] },
  { skeletons: [{ variant: "rectangular", width: 40, height: 40 }] },
  { skeletons: [{ variant: "rectangular", width: 40, height: 40 }] },
  { skeletons: [{ width: "100px", height: "20px" }] },
  { innerClassName: "flex justify-end gap-x-2", skeletons: [{ width: "30px", height: "20px" }] },
];

export default function AllHeroBanners({ toggleVisibility }) {
  const dispatch = useAppDispatch();
  const { heroBanners, isLoading, error } = useAppSelector((state) => state.allHeroBanner);

  const [bannersFetched, setBannersFetched] = useState(false);

  useEffect(() => {
    if (!bannersFetched) {
      dispatch(fetchAllHeroBanners());
      setBannersFetched(true);
    }
  }, [bannersFetched, dispatch]);

  return (
    <>
      {isLoading && <SkeletonTable head={SKELETON_HEAD} row={SKELETON_ROW} />}
      {error && <p>Error: {error}</p>}
      {!isLoading && heroBanners && (
        <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                <tr>
                  <td className="px-4 py-3">ID</td>
                  <td className="px-4 py-3">Banner 1</td>
                  <td className="px-4 py-3">Banner 2</td>
                  <td className="px-4 py-3">HEADER</td>
                  <td className="px-4 py-3 text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {heroBanners.map((banner) => (
                  <tr key={banner._id} id={banner._id}>
                    <td className="px-4 py-3">
                      <span className="text-sm">{banner._id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="object-cover w-full h-full "
                          src={banner.image?.[0]}
                          alt={banner.header}
                          loading="lazy"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="relative inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="object-cover w-full h-full "
                          src={banner.image?.[1]}
                          alt={banner.header}
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{banner.header}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-x-2">
                        <FiEdit className="cursor-pointer" onClick={() => toggleVisibility(banner._id)} />
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
