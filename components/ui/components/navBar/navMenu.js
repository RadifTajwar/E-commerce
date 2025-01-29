import { fetchAllCategories } from "@/redux/category/allCategoriesSlice";
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import { clearState, fetchAllProducts } from "@/redux/product/allProductsSlice";
import localStorageUtil from "@/utils/localStorageUtil";
import { Search } from "lucide-react"; // Install lucide-react for the icon
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function NavMenu() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [parentRes, setParentRes] = useState([]);
    const [categoryRes, setCategoryRes] = useState([]);
    const { isLoading: productLoading } = useSelector((state) => state.allProducts);
    const [productLoadingResult, setProductLoadingResult] = useState(false);
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length === 0) {
            dispatch(clearState());
            setSearchResults([]);
        }
    };

    useEffect(() => {
        if (!searchTerm) return; // Avoid unnecessary calls when searchTerm is empty

        const delayDebounceFn = setTimeout(async () => {
            setProductLoadingResult(true);
            try {
                const res = await dispatch(fetchAllProducts({ searchTerm })).unwrap();
                setSearchResults(res.products);
                console.log("res is ", res);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setProductLoadingResult(false);
            }
        }, 500); // Waits 500ms after user stops typing

        return () => clearTimeout(delayDebounceFn); // Cleanup timeout on every keystroke
    }, [searchTerm, dispatch]);

    // Access the parent categories from the store
    const { parentCategories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.allParentCategories
    );

    const { error } = useSelector((state) => state.categories);

    // Fetch all parent categories and categories
    useEffect(() => {
        const fetchData = async () => {
            if (parentRes.length > 0 && categoryRes.length > 0) {
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



    // Show an error message if the parent categories or categories failed to load
    if (parentError || error) {
        return <div>Error! {parentError || error}</div>;
    }
    const handleParentCategoryClicked = (parentCategoryId, parentCategoryName) => {
        // Convert to lowercase and replace spaces with hyphens
        const formattedCategoryName = parentCategoryName.toLowerCase().replace(/\s+/g, '-');

        // Store parentCategoryId in localStorage
        localStorageUtil.setItem("parentCategoryId", parentCategoryId);
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
        // Navigate to the formatted URL

        router.push(`/shop/productCategory/${formattedParentCategoryName}/${formattedCategoryName}`);

    }

    const handleProductClick = (slug, id) => {
        // Hash the product ID


        // Save the hashed ID to localStorage
        localStorageUtil.setItem("obfuscatedKey", id);

        // Redirect to the product page
        router.push(`/products/${slug}`);
        setSearchResults([]);
        dispatch(clearState());


    };

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]); // Call function to clear search results
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <>
            <ul className="hidden lg:flex items-center justify-start gap-4 sm:gap-5 md:gap-6 py-3 sm:justify-center">
                {parentRes?.map((parentCategory) => {
                    // Filter the categories for this parent category
                    const childCategories = categoryRes?.filter(
                        (category) => category.parentCategoryId === parentCategory.id
                    );

                    return (
                        <li key={parentCategory.id} className="group relative">
                            <a
                                href="#"
                                title=""
                                className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                                style={{ fontSize: ".9rem" }}
                                onClick={() => {
                                    handleParentCategoryClicked(parentCategory.id, parentCategory.name)
                                }}
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
                            {
                                childCategories.length > 0 && (
                                    <div className="absolute top-full left-0 min-w-[220px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                                        <ul>
                                            {
                                                childCategories.map((category) => (
                                                    <li key={category.id} onClick={() => {
                                                        handleCategoryClicked(parentCategory.name, category.id, category.name)
                                                    }}>
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


                <li className="group relative" ref={searchRef}>
                    <div className="flex items-center bg-white p-2 border border-gray-200">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder="Search products"
                            className="flex-1 px-2 text-sm bg-white outline-none border-r border-black"
                        />
                        {productLoadingResult ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin ms-2"></div>
                        ) : (
                            <Search className="text-black w-5 h-5 ms-2" />
                        )}
                    </div>

                    {searchResults?.length > 0 && (
                        <div className="absolute top-full left-0 bg-white w-full border border-gray-200 max-h-80 overflow-scroll">
                            {searchResults.map((product) => (
                                <div className="whole" key={product?.id}>
                                    <div
                                        className="flex w-full p-2 group hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleProductClick(product?.slug, product?.id)}
                                    >
                                        <div className="me-4">
                                            <Image src={product?.imageDefault} alt={product?.name} width={50} height={50} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 text-xs font-normal cursor-pointer group-hover:text-gray-600">
                                                {product?.name}
                                            </p>
                                            <p>
                                                <span style={{ textDecoration: "line-through", color: "#a9a9a9" }} className="text-xs">
                                                    ${product?.originalPrice}
                                                </span>
                                                <span className="text-xs text-gray-900 font-medium" style={{ marginLeft: "8px" }}>
                                                    ${product?.discountedPrice}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="line w-full h-px bg-gray-300"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </li>
            </ul>
        </>
    )
}
