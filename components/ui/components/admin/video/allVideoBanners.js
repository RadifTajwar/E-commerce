import { fetchAllVideoBanners } from '@/redux/video/allVideoBannerSlice';
import { Skeleton } from "@mui/material";
import { useEffect, useState } from 'react';
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function allHeroBanners({ toggleVisibility, toggleDeleteVisible }) {
    const dispatch = useDispatch();

    // Access categories, loading, and error states from the store
    const { videoBanners, isLoading, error } = useSelector((state) => state.allVideoBanners);

    // State to check if categories are already fetched
    const [categoriesFetched, setCategoriesFetched] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        if (!categoriesFetched) {
            dispatch(fetchAllVideoBanners());
            setCategoriesFetched(true); // Mark categories as fetched
        }
    }, [categoriesFetched, dispatch]);

    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    useEffect(() => {
        if (videoBanners) {
            console.log(videoBanners);
        }
    }, [videoBanners]);

    return (
        <>
            {isLoading && (
                 <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
                 <div className="w-full overflow-x-auto">
                   <table className="w-full whitespace-no-wrap">
                     <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                       <tr>
                         <td className="px-4 py-3">
                           <Skeleton variant="text" width="80px" height="20px" />
                         </td>
                         <td className="px-4 py-3 flex justify-end">
                           <Skeleton variant="text" width="60px" height="20px" />
                         </td>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                       {[...Array(10)].map((_, index) => (
                         <tr key={index}>
                           <td className="px-4 py-3">
                             <Skeleton variant="text" width="80px" height="20px" />
                           </td>
                           <td className="px-4 py-3">
                             <div className="flex justify-end gap-x-2">
                               <Skeleton variant="text" width="30px" height="20px" />
                             
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            )}
            {error && <p>Error: {error}</p>}
            {!isLoading && videoBanners && (
                <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
                    <div className="w-full overflow-x-auto">
                        <table className='w-full whitespace-no-wrap'>
                            <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden">
                                <tr>
                                   
                                    <td className="px-4 py-3">ID</td>
                                    <td className="px-4 py-3 text-right">ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400'>
                               
                                {
                                    videoBanners && videoBanners.map(videoBanners => (
                                        <tr key={videoBanners._id} id={videoBanners._id}>
                                          
                                            <td className="px-4 py-3">
                                                <span className="text-sm">{videoBanners._id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-x-2">
                                                    <FiEdit
                                                        className="cursor-pointer"
                                                        onClick={() => toggleVisibility(videoBanners._id)} // No re-fetch
                                                    />

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                      

                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
