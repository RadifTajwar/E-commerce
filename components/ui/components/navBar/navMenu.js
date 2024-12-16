import { fetchAllCategories } from "@/redux/category/allCategoriesSlice";
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NavMenu() {
    const dispatch = useDispatch();

    // Access the parent categories from the store
    const { parentCategories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.allParentCategories
    );

    const { categories, isLoading, error } = useSelector((state) => state.categories);

    // Fetch all parent categories and categories
    useEffect(() => {
        dispatch(fetchAllParentCategories());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    // Show a loading indicator if the parent categories are still loading
    if (parentLoading || isLoading) {
        return <div>Loading...</div>;
    }

    // Show an error message if the parent categories or categories failed to load
    if (parentError || error) {
        return <div>Error! {parentError || error}</div>;
    }

    return (
        <>
            <ul className="hidden lg:flex items-center justify-start gap-4 sm:gap-5 md:gap-6 py-3 sm:justify-center">
                {parentCategories.map((parentCategory) => {
                    // Filter the categories for this parent category
                    const childCategories = categories.filter(
                        (category) => category.parentCategoryId === parentCategory.id
                    );

                    return (
                        <li key={parentCategory.id} className="group relative">
                            <a
                                href="#"
                                title=""
                                className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                                style={{ fontSize: ".9rem" }}
                            >
                                {parentCategory.name}
                                <svg
                                    className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </a>
                            <span
                                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
                            ></span>

                            {/* Render dropdown only if childCategories exist */}
                            {childCategories.length > 0 && (
                                <div className="absolute top-full left-0 min-w-[220px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                                    <ul>
                                        {childCategories.map((category) => (
                                            <li key={category.id}>
                                                <a
                                                    className="text-gray-500 flex items-center p-2 hover:text-gray-900"
                                                    href="#"
                                                    style={{ fontSize: ".9rem" }}
                                                >
                                                    <span className="whitespace-nowrap">{category.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    );
                })}




                <li className="group relative">
                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                        ABOUT US

                    </a>
                    <span
                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                    ></span>
                </li>
                <li className="group relative">
                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                        CONTACT US

                    </a>
                    <span
                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                    ></span>
                </li>

                <li className="group relative">
                    <Link href="/shop" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                        SHOP NOW

                    </Link>
                    <span
                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                    ></span>
                </li>
            </ul>
        </>
    )
}
