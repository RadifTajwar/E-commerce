import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchAllCategories } from '@/redux/category/allCategoriesSlice';
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import { clearState, fetchAllProducts } from "@/redux/product/allProductsSlice";
import localStorageUtil from '@/utils/localStorageUtil';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from "../icon/searchIcon";
export default function SideBar({ toggleSideBar, isVisibleSideBar, toggleLogInForm }) {

    const router = useRouter();
    const dispatch = useDispatch();

    // Access the parent categories from the store
    const { parentCategories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.allParentCategories
    );

    const { categories, isLoading, error } = useSelector((state) => state.categories);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [productLoadingResult, setProductLoadingResult] = useState(false);





    const changeSearchBarText = (e) => {
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


    // Fetch all parent categories and categories
    useEffect(() => {
        dispatch(fetchAllParentCategories());
        dispatch(fetchAllCategories());
    }, [dispatch]);
    const [searchBar, setSearchBar] = useState("");
    const [isSelected, setIsSelected] = useState(true);
    const [expandedStates, setExpandedStates] = useState({});
    const toggleExpand = (id) => {
        setExpandedStates((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle the expand state for the given parentCategory id
        }));
    };

    const handleToggleSideBar = () => {
        setTimeout(() => {
            toggleSideBar();
        }, 300);
    }

    const handleLoginClicked = () => {
        toggleSideBar();
        toggleLogInForm();

    }

    const handleParentCategoryClicked = (parentCategoryId, parentCategoryName) => {
        // Convert to lowercase and replace spaces with hyphens
        const formattedCategoryName = parentCategoryName.toLowerCase().replace(/\s+/g, '-');

        // Store parentCategoryId in localStorage
        localStorageUtil.setItem("parentCategoryId", parentCategoryId);
        dispatch(clearState());
        // Navigate to the formatted URL
        router.push(`/shop/productCategory/${formattedCategoryName}`);
        handleToggleSideBar();
    };
    const handleCategoryClicked = (parentCategoryName, categoryId, categoryName) => {
        // Convert to lowercase and replace spaces with hyphens
        const formattedCategoryName = categoryName.toLowerCase().replace(/\s+/g, '-');
        const formattedParentCategoryName = parentCategoryName.toLowerCase().replace(/\s+/g, '-');
        localStorageUtil.setItem("categoryId", categoryId);
        dispatch(clearState());
        // Navigate to the formatted URL

        router.push(`/shop/productCategory/${formattedParentCategoryName}/${formattedCategoryName}`);
        handleToggleSideBar();

    }
    const handleProductClick = (slug, id) => {
        // Hash the product ID


        // Save the hashed ID to localStorage
        localStorageUtil.setItem("obfuscatedKey", id);

        // Redirect to the product page
        router.push(`/products/${slug}`);
        setSearchResults([]);
        dispatch(clearState());
        handleToggleSideBar();
    };

    return (
        <>


            <section
                className={`bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center overflow-y-auto z-50  transition-transform duration-300 ${isVisibleSideBar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col items-center h-screen justify-center  mx-auto w-full sm:max-w-xs ">
                    <div className="w-full bg-white h-screen rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
                        <div className="relative">
                            <div className="ps-5 pe-12 py-2 relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={changeSearchBarText}
                                    placeholder="Search for products"
                                    className="border-none px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm"
                                />
                                {
                                    productLoadingResult ? (
                                        <div className="absolute top-3 right-2 mt-1 mr-1">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin "></div>
                                        </div>
                                    ) : (
                                        <div className="absolute top-3 right-2 mt-1 mr-1">
                                            <SearchIcon />
                                        </div>
                                    )
                                }

                            </div>
                            {
                                searchResults?.length > 0 && (



                                    <div className=" bg-white w-full border border-gray-200 max-h-64 overflow-scroll z-50 shadow-lg">
                                        {
                                            searchResults?.map((product) => (
                                                <div className="whole " key={product?.id}>
                                                    <div className="flex w-full p-2 group hover:bg-gray-100 transition-all duration-300 cursor-pointer" onClick={() => handleProductClick(product?.slug, product?.id)}>
                                                        <div className=" me-4">
                                                            <Image src={product?.imageDefault} alt={product?.name} width={50} height={50}></Image>
                                                        </div>
                                                        <div className=" " >
                                                            <p className="text-gray-900 text-xs font-normal cursor-pointer group-hover:text-gray-600">{product?.name}</p>
                                                            <p>
                                                                <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-xs'>${product?.originalPrice}</span>
                                                                <span className="text-xs text-gray-900 font-medium" style={{ marginLeft: '8px' }}>${product?.discountedPrice}</span>
                                                            </p>
                                                        </div>

                                                    </div>
                                                    <div className="line w-full h-px bg-gray-300 ">
                                                    </div>
                                                </div>


                                            ))
                                        }

                                    </div>
                                )
                            }
                        </div>



                        <div className="menu flex text-sm font-medium text-gray-500 dark:text-gray-400 bg-[#F5F5F5] cursor-pointer border-b border-gray-300">
                            {/* MENU Tab */}
                            <div
                                className={`menu w-1/2 text-center px-4 py-5 relative group transition-colors duration-300 hover:text-black ${isSelected ? 'bg-[#E8E8E8] text-black' : 'bg-[#F5F5F5]'
                                    }`}
                                onClick={() => setIsSelected(true)}
                            >
                                MENU
                                <span className={`absolute bottom-0 right-0 w-0 h-0.5 bg-black transition-all duration-300  ${isSelected ? `w-full ` : `group-hover:w-full group-hover:right-0 `}`}></span>
                            </div>

                            {/* CATEGORIES Tab */}
                            <div
                                className={`categories w-1/2 text-center px-4 py-5 relative group transition-colors duration-300 hover:text-black ${!isSelected ? 'bg-[#E8E8E8] text-black' : 'bg-[#F5F5F5]'
                                    }`}
                                onClick={() => setIsSelected(false)}
                            >
                                CATEGORIES
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300  ${!isSelected ? `w-full` : `group-hover:w-full group-hover:left-0`}`}></span>
                            </div>
                        </div>
                        <div>
                            {/* Main Category Item */}
                            {
                                isSelected ? (
                                    parentCategories?.map((parentCategory) => {
                                        const childCategories = categories?.filter(
                                            (category) => category.parentCategoryId === parentCategory.id
                                        );

                                        const isExpanded = expandedStates[parentCategory.id] || false;

                                        return (

                                            <div key={parentCategory.id}>
                                                <div
                                                    className="categoryItem flex justify-between text-gray-800 dark:text-gray-400 border-b border-gray-300 cursor-pointer text-[13px] font-semibold"
                                                >
                                                    <div
                                                        className={`transition-all duration-200 category w-10/12 py-3 ps-5 border-e border-gray-300 ${isExpanded ? 'bg-[#F7F7F7]' : ''}`}
                                                        onClick={() => handleParentCategoryClicked(parentCategory.id, parentCategory.name)}
                                                    >
                                                        {parentCategory.name}
                                                    </div>
                                                    <div
                                                        className={`icon w-2/12 py-3 flex justify-center items-center space-x-2 transition-all duration-200 ${isExpanded ? 'bg-[#4C4C4C]' : 'bg-[#F5F5F5]'}`}
                                                        onClick={() => toggleExpand(parentCategory.id)}
                                                    >
                                                        <ChevronRightIcon
                                                            fontSize="medium"
                                                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white' : 'text-gray-500'}`}
                                                            style={{ strokeWidth: 1 }}
                                                        />
                                                    </div>
                                                </div>
                                                {isExpanded && childCategories?.length > 0 && (
                                                    <div
                                                        className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-40' : 'max-h-0'}`}
                                                    >
                                                        {childCategories.map((category) => (
                                                            <div
                                                                key={category.id}
                                                                className="py-4 px-5 text-gray-400 dark:text-gray-300 border-b border-gray-300 cursor-pointer text-[13px] font-regular transition-all duration-300 hover:text-gray-800"
                                                                onClick={() => handleCategoryClicked(parentCategory.name, category.id, category.name)}
                                                            >
                                                                {category.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <Link href="/shop">
                                                    <div className="transition-all duration-200 category w-full py-3 ps-5  border-b border-gray-300 cursor-pointer text-[13px] font-semibold" onClick={handleToggleSideBar} >
                                                        SHOP
                                                    </div >
                                                </Link>

                                                <div className="transition-all duration-200 category w-full py-3 ps-5  border-b border-gray-300 cursor-pointer text-[13px] font-semibold" >
                                                    ABOUT US
                                                </div>

                                                <div className="transition-all duration-200 category w-full py-3 ps-5 border-b border-gray-300 cursor-pointer text-[13px] font-semibold flex items-center space-x-2" onClick={handleLoginClicked}>
                                                    <User className="w-5 h-5" />
                                                    <span>LOGIN / REGISTER</span>
                                                </div>
                                            </div>


                                        );
                                    })
                                ) : (
                                    // Only show parent category names when not selected
                                    parentCategories?.map((parentCategory) => (
                                        <div key={parentCategory.id} className="categoryItem flex justify-between text-gray-800 dark:text-gray-400 border-b border-gray-300 cursor-pointer text-[13px] font-semibold" onClick={() => handleParentCategoryClicked(parentCategory.id, parentCategory.name)}>
                                            <div className="w-10/12 py-3 ps-5">{parentCategory.name}</div>
                                        </div>
                                    ))
                                )
                            }







                        </div>



                    </div>
                </div>
            </section>
        </>
    );
}
