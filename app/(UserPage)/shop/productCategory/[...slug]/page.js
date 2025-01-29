'use client';

// import ColorBar from "@/components/ui/components/shop/colorBar";
// import ColorBar from "@/components/ui/components/shop/colorBar";
import InfiniteScroll from "@/components/ui/components/shop/infiniteScroll";
import SortingSection from "@/components/ui/components/shop/sortingSection";
import StockStatus from "@/components/ui/components/shop/stockStatus";
import TopRatedProducts from "@/components/ui/components/shop/topRatedProducts";
import { fetchAllCategories } from "@/redux/category/allCategoriesSlice";
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import { clearState, fetchAllProducts } from "@/redux/product/allProductsSlice";
import localStorageUtil from "@/utils/localStorageUtil";
import MenuIcon from '@mui/icons-material/Menu';
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react'; // Import Suspense from React
import { useDispatch, useSelector } from "react-redux";
// import RangeBar from "@/components/ui/components/shop/rangeBar";

export default function Page() {
    const params = useParams();

    const router = useRouter();
    const slug = params.slug;


    const dispatch = useDispatch();

    // Access the parent categories from the store
    const { parentCategories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.allParentCategories
    );
    const [parentRes, setParentRes] = useState([]);
    const [categoryRes, setCategoryRes] = useState([]);
    const searchParams = useSearchParams();
    const { parentCategory, childCategory } = searchParams;

    const { categories, isLoading: categoryLoading, error: categoryError } = useSelector(
        (state) => state.categories
    );

    // Fetch all parent categories and categories
    useEffect(() => {
        const fetchData = async () => {
            if (parentRes.length>0 && categoryRes.length>0) {
               return;
            }
            try {

                const res = await dispatch(fetchAllParentCategories()).unwrap();
                setParentRes(res);
                console.log(res);
                const res2 = await dispatch(fetchAllCategories()).unwrap();
                setCategoryRes(res2);
                console.log(res2);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, [dispatch]);


    const [isSortBarVisible, setSortBarVisible] = useState(false);

    // Access products, loading, and error states from the Redux store
    const { products, isLoading, error } = useSelector((state) => state.allProducts);

    // State to track if products have been fetched
    const [productsFetched, setProductsFetched] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            // If products have not been fetched yet
            if (!productsFetched) {
                console.log("dhukteseasfdasd fsadf asdfasdf ", slug,productsFetched);
                dispatch(clearState()); // Clear the previous products
                if (slug && slug.length === 2) {
                    console.log("first dhukse", slug[1]);
                    const categoryId = await localStorageUtil.getItem('categoryId');
                    dispatch(fetchAllProducts({ categoryId }));
                } else if (slug && slug.length === 1) {
                    console.log("second dhukse in slug", slug[0]);
                    const parentId = await localStorageUtil.getItem('parentCategoryId');
                    console.log("parentId", parentId);
                    dispatch(fetchAllProducts({ parentCategoryId: parentId }));
                }

                setProductsFetched(true); // Mark products as fetched
            }
        };

        fetchProducts(); // Call the async function
    }, [productsFetched, dispatch, slug,params]);

    const toggleSortBar = () => {
        setSortBarVisible(!isSortBarVisible)
        // console.log('sort bar ' + isSortBarVisible);
    }

    const [isVisible, setIsVisible] = useState(false);
    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };



    // Function to handle category click and update the query parameter

    const handleChildCategoryClick = (categoryName, parentCategoryName) => {
        const params = new URLSearchParams(window.location.search);
        const existingChildCategory = params.get("childCategory");

        if (existingChildCategory != categoryName) {
            // If the same child category is clicked, clear it
            params.set("childCategory", categoryName);
            params.set("parentCategory", parentCategoryName);
            router.push(`${window.location.pathname}?${params.toString()}`);
        }
    };

    const handleParentCategoryClicked = (parentCategoryId, parentCategoryName) => {
        // Convert to lowercase and replace spaces with hyphens
        const formattedCategoryName = parentCategoryName.toLowerCase().replace(/\s+/g, '-');

        // Store parentCategoryId in localStorage
        localStorageUtil.setItem("parentCategoryId ", parentCategoryId);
        dispatch(clearState());
        // Navigate to the formatted URL
        router.push(`/shop/productCategory/${formattedCategoryName}`);
    };
    const handleCategoryClicked = (parentCategoryName, categoryId, categoryName) => {
        // Convert to lowercase and replace spaces with hyphens
        const formattedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-');
        const formattedParentCategoryName = parentCategoryName.toLowerCase().replace(/\s+/g, '-');
        localStorageUtil.setItem("categoryId", categoryId);
        dispatch(clearState());
        router.push(`/shop/productCategory/${formattedParentCategoryName}/${formattedCategoryName}`);

    }

    return (

        <>
            {/* Overlay */}
            {isSortBarVisible && (


                <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSortBar} />
            )}



            <div className="full_upper_container z-50">
                <div className="upper_text max-w-8xl flex justify-center mt-8 ">
                   
                    {error && <p>Error: {error}</p>}
                    {parentRes && (
                        <>
                            <div className="text-center">
                                <h1 className="text-4xl font-bold ">
                                    <span style={{ color: '#E8A811' }}>SHOP</span> NOW
                                </h1>
                                <div className="category_section large-screen ">
                                    <ul className="hidden lg:flex items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 sm:justify-center">
                                        {parentRes?.map((parentCategory) => {
                                            // Filter the categories for this parent category
                                            const childCategories = categoryRes?.filter(
                                                (category) => category?.parentCategoryId === parentCategory?.id
                                            );
                                            return (
                                                <li className="group relative" key={parentCategory?.id}>
                                                    <a
                                                        href="#"

                                                        title=""
                                                        className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                                                        style={{ fontSize: '.9rem' }}
                                                        onClick={() => {
                                                            handleParentCategoryClicked(parentCategory?.id, parentCategory?.name)
                                                        }}
                                                    >
                                                        {parentCategory?.name}
                                                    </a>
                                                    <span
                                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                                    ></span>

                                                    {/* Render dropdown only if childCategories exist */}
                                                    {childCategories?.length > 0 && (
                                                        <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                                            <div className="items w-full">
                                                                <ul className="w-full p-2">
                                                                    {childCategories?.map((category) => (
                                                                        <li
                                                                            className="group/nested relative w-full mb-4"
                                                                            key={category?.id}
                                                                            onClick={() => {
                                                                                handleCategoryClicked(parentCategory?.name, category?.id, category?.name)
                                                                            }}
                                                                        >
                                                                            <a
                                                                                href="#"
                                                                                onClick={() => handleChildCategoryClick(category?.name, parentCategory?.name)}
                                                                                className="group/nested w-full"
                                                                                style={{ fontSize: '.9rem' }}
                                                                            >
                                                                                <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                                                    {category?.name}
                                                                                </p>
                                                                                <p className="text-gray-400 text-start text-sm">
                                                                                    {parentRes?.length} Products
                                                                                </p>
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="category_section small-screen">
                                    <div className="lg:hidden flex items-center gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 justify-center">
                                        <div className="group relative ">
                                            <button
                                                className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                                                style={{ fontSize: '.9rem' }}
                                                onClick={toggleDropdown}
                                            >
                                                CATEGORIES
                                                <svg
                                                    className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <span
                                                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div
                    className={`dropDown_category w-full text-white transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ transitionProperty: 'max-height, opacity' }}
                >
                   
                    {error && <p>Error: {error}</p>}
                    {!parentRes && (
                        <>



                            {
                                parentRes.length > 0 && (
                                    <div className="inner p-3 w-full">
                                        <div className="dropdown_inner px-2 bg-white w-full">
                                            <ul className="w-full lg:hidden items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 ">

                                                {parentRes?.map((parentCategory) => (
                                                    <li key={parentCategory?.id} className="group relative w-full py-3 cursor-pointer">
                                                        <a
                                                            href="#"

                                                            className="py-3 text-gray-900 group-hover:text-gray-600 transition-all duration-300 text-start font-semibold text-kg"
                                                            style={{ fontSize: '.9rem' }}
                                                            onClick={() => {
                                                                handleParentCategoryClicked(parentCategory?.id, parentCategory?.name)
                                                            }}
                                                        >
                                                            {parentCategory?.name}

                                                            <span
                                                                className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"
                                                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                                            ></span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>


                                )
                            }

                        </>
                    )}
                </div>
            </div>


            <div className="full_lower_container_small_screen my-6 lg:hidden">
                <div className="text_section w-full  my-6 px-3">
                    <div className="flex py-3 justify-between border-b border-gray-300">
                        <p className="text-gray-500 cursor-pointer font-light text-sm">Home / <span className="text-black font-medium">Shop</span></p>
                        <p className="font-light text-gray-500 text-sm">Showing Result</p>
                    </div>
                </div>
            </div>



            <div className="full_lower_container_small_screen my-14 lg:px-3 z-20">
                <div className="text_section  max-w-7xl mx-auto  my-6 lg:px-3">
                    
                    {error && <p>Error: {error}</p>}
                    {productsFetched && products && (
                        <>

                            <div className="flex py-3 justify-between  lg:px-3 gap-x-6">

                                <div className="left w-1/5   transition-all duration-300 lg:static hidden lg:block">

                                    {/* <RangeBar />    */}
                                    <div className="line w-full h-px bg-gray-300 my-6">
                                    </div>
                                    {/* <ColorBar products={products} /> */}
                                    <div className="line w-full h-px bg-gray-300 my-6">
                                    </div>
                                    <StockStatus />
                                    <div className="line w-full h-px bg-gray-300 my-6">
                                    </div>
                                    <TopRatedProducts />


                                </div>

                                <div className={`left w-80 bg-white p-4 overflow-scroll fixed z-20  transition-all duration-300 lg:static  lg:hidden ${isSortBarVisible ? ' top-0 left-0 bottom-0 ' : ' top-0 -left-full'
                                    } `}>
                                    <div className={`${isSortBarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                                        {/* <RangeBar /> */}
                                        <div className="line w-full h-px bg-gray-300 my-6">
                                        </div>
                                        {/* <ColorBar products={products} /> */}
                                        <div className="line w-full h-px bg-gray-300 my-6">
                                        </div>
                                        <StockStatus />
                                        <div className="line w-full h-px bg-gray-300 my-6">
                                        </div>
                                        <TopRatedProducts />
                                    </div>

                                </div>
                                <div className="right  w-full lg:w-4/5 px-4 ">
                                    <div className="flex justify-between items-center pb-5">
                                        <div className="tex hidden lg:block">
                                            <p className=" text-sm  decoration-gray-800 font-semibold  my-3">
                                                <span className="hover:text-gray-900 transition-colors duration-300 text-gray-500 font-light cursor-pointer">Home </span>
                                                / Shop
                                            </p>
                                        </div>
                                        <div className="tex  lg:hidden cursor-pointer">
                                            <button className=" text-sm  decoration-gray-800 font-semibold  my-3" onClick={toggleSortBar}>
                                                <MenuIcon />
                                            </button>
                                        </div>
                                        <div className="sorting_section ">
                                            <SortingSection />
                                        </div>
                                    </div>

                                    <div className="infiniteScroll ">
                                        <InfiniteScroll products={products} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>


        </>




    )
}
