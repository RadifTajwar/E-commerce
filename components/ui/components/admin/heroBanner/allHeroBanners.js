import { fetchAllHeroBanners } from "@/redux/heroBanner/allHeroBannerSlice";
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
export default function allHeroBanners({ toggleVisibility, toggleDeleteVisible }) {
    const dispatch = useDispatch();

    // Access categories, loading, and error states from the store
    const { heroBanners, isLoading, error } = useSelector((state) => state.allHeroBanner);

    // State to check if categories are already fetched
    const [categoriesFetched, setCategoriesFetched] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        if (!categoriesFetched) {
            dispatch(fetchAllHeroBanners());
            setCategoriesFetched(true); // Mark categories as fetched
        }
    }, [categoriesFetched, dispatch]);

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
                                    <td className="px-4 py-3">ID</td>
                                    <td className="px-4 py-3">ICON</td>
                                    <td className="px-4 py-3">HEADER</td>
                                    <td className="px-4 py-3 text-right">ACTIONS</td>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400'>
                                {
                                    heroBanners.map((heroBannerData) => {
                                        <tr key={heroBannerData.id} id={heroBannerData.id}>
                                            <td className="px-4 py-3">
                                                <input id={heroBannerData.id} name={heroBannerData.name} type="checkbox" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm">{heroBannerData.id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="relative inline-block w-10 h-10 hidden p-1 mr-2 md:block  shadow-none">
                                                    <img
                                                        className="object-cover w-full h-full "
                                                        src={heroBannerData.image}
                                                        alt={heroBannerData.header}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm">{heroBannerData.header}</span>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <Switch
                                                    checked={checked}
                                                    onChange={handleChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-x-2">
                                                    <FiEdit
                                                        className="cursor-pointer"
                                                        onClick={() => toggleVisibility(heroBannerData.id)} // No re-fetch
                                                    />
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                })
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
