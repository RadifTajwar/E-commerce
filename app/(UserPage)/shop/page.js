'use client'
import ColorBar from "@/components/ui/components/shop/colorBar";
import InfiniteScroll from "@/components/ui/components/shop/infiniteScroll";
import RangeBar from "@/components/ui/components/shop/rangeBar";
import SortingSection from "@/components/ui/components/shop/sortingSection";
import StockStatus from "@/components/ui/components/shop/stockStatus";
import TopRatedProducts from "@/components/ui/components/shop/topRatedProducts";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

const products = {
    product1: {
        id: 1,
        name: "Annabelle Business Bag - Blue",
        color: "Blue",
        hex: "#0000FF",
        originalPrice: 4000,
        discountedPrice: 3500,
        inStock: true,
        onSale: false,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product2: {
        id: 2,
        name: "Shoulder Bag",
        color: "Black",
        hex: "#000000",
        originalPrice: 4500,
        discountedPrice: 3900,
        inStock: false,
        onSale: true,
        image: { default: "/bag-default.jpg", hover: "/bag-hover.jpg" }
    },
    product3: {
        id: 3,
        name: "Annabelle Business Bag - Green",
        color: "Green",
        hex: "#008000",
        originalPrice: 4200,
        discountedPrice: 3700,
        inStock: true,
        onSale: true,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product4: {
        id: 4,
        name: "Annabelle Business Bag - Black",
        color: "Black",
        hex: "#000000",
        originalPrice: 4800,
        discountedPrice: 4300,
        inStock: false,
        onSale: false,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product5: {
        id: 5,
        name: "Annabelle Business Bag - Grey",
        color: "Grey",
        hex: "#808080",
        originalPrice: 4000,
        discountedPrice: 3500,
        inStock: true,
        onSale: true,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product6: {
        id: 6,
        name: "Annabelle Business Bag - Yellow",
        color: "Yellow",
        hex: "#FFFF00",
        originalPrice: 4600,
        discountedPrice: 4100,
        inStock: false,
        onSale: true,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product7: {
        id: 7,
        name: "Annabelle Business Bag - Pink",
        color: "Pink",
        hex: "#FFC0CB",
        originalPrice: 4400,
        discountedPrice: 3900,
        inStock: true,
        onSale: false,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product8: {
        id: 8,
        name: "Annabelle Business Bag - White",
        color: "White",
        hex: "#FFFFFF",
        originalPrice: 5000,
        discountedPrice: 4500,
        inStock: false,
        onSale: true,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product9: {
        id: 9,
        name: "Annabelle Business Bag - Orange",
        color: "Orange",
        hex: "#FFA500",
        originalPrice: 4200,
        discountedPrice: 3700,
        inStock: true,
        onSale: false,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    },
    product10: {
        id: 10,
        name: "Annabelle Business Bag - Brown",
        color: "Brown",
        hex: "#A52A2A",
        originalPrice: 4800,
        discountedPrice: 4300,
        inStock: false,
        onSale: true,
        image: { default: "/Annabelle-Business-Bag-Brown-1.jpg", hover: "/Annabelle-Business-Bag-Brown-3.jpg" }
    }
};


export default function page() {

    const [isSortBarVisible, setSortBarVisible] = useState(false);



    const toggleSortBar = () => {
        setSortBarVisible(!isSortBarVisible)
        console.log('sort bar ' + isSortBarVisible);
    }

    const [isVisible, setIsVisible] = useState(false);
    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };







    return (
        <>
            {/* Overlay */}
            {isSortBarVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleSortBar} />
            )}
            <div className="full_upper_container z-50">
                <div className="upper_text max-w-8xl flex justify-center mt-8 ">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold ">
                            <span style={{ color: '#E8A811' }}>SHOP</span> NOW
                        </h1>
                        <div className="category_section large-screen ">
                            <ul className="hidden lg:flex items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 sm:justify-center">

                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        WALLETS
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        CORPORATE
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        COMBO OFFER
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        BAGS
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        FASHIONS
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50" >
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        TRAVELS
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                                <li className="group relative">
                                    <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }}>
                                        ACCESSORIES
                                    </a>
                                    <span
                                        className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                    ></span>

                                    {/* 2nd level menu */}
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50">
                                        <div className="items w-full">
                                            <ul className="w-full p-2">
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Bifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>

                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Long Wallet
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>
                                                <li className="group/nested relative w-full mb-4">
                                                    {/* Nested group for submenu */}
                                                    <a className="group/nested w-full" href="#" style={{ fontSize: '.9rem' }}>
                                                        <p className="text-gray-900 group-hover/nested:text-gray-600 text-start font-semibold text-md">
                                                            Trifold
                                                        </p>
                                                        <p className="text-gray-400  text-start text-sm">
                                                            8 Products
                                                        </p>
                                                    </a>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>

                                </li>
                            </ul>

                        </div>
                        <div className="category_section small-screen">
                            <div className="lg:hidden flex items-center  gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 justify-center">
                                <div className="group relative ">
                                    <button className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '.9rem' }} onClick={toggleDropdown}>
                                        CATEGORIES
                                        <svg
                                            className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg" >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
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
                </div>
                <div className={`dropDown_category w-full  text-white transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                    style={{ transitionProperty: "max-height, opacity" }}>
                    <div className="inner  p-3 w-full">
                        <div className="dropdown_inner px-2 bg-white w-full">
                            <ul className="w-full  lg:hidden items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 ">
                                <li className="group relative w-full  py-3 cursor-pointer">
                                    <a href="#" title="" className="py-3  text-gray-900 group-hover:text-gray-600 text-start font-semibold text-kg" style={{ fontSize: '.9rem' }}>
                                        WALLETS
                                        <p className="text-gray-400  text-start text-sm group-hover:text-gray-400">8 Products</p>
                                        <span
                                            className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"
                                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                        ></span>
                                    </a>
                                </li>
                                <li className="group relative w-full  py-3 cursor-pointer">
                                    <a href="#" title="" className="py-3  text-gray-900 group-hover:text-gray-600 text-start font-semibold text-lg" style={{ fontSize: '.9rem' }}>
                                        WALLETS
                                        <p className="text-gray-400  text-start text-sm group-hover:text-gray-400">8 Products</p>
                                        <span
                                            className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"
                                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                        ></span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </div>
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
                    <div className="flex py-3 justify-between  lg:px-3 gap-x-6">

                        <div className="left w-1/5   transition-all duration-300 lg:static hidden lg:block">

                            <RangeBar />
                            <div className="line w-full h-px bg-gray-300 my-6">
                            </div>
                            <ColorBar products={products} />
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
                                <RangeBar />
                                <div className="line w-full h-px bg-gray-300 my-6">
                                </div>
                                <ColorBar products={products} />
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
                                    <SortingSection/>
                                </div>
                            </div>

                            <div className="infiniteScroll ">
                                <InfiniteScroll products={products} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}
