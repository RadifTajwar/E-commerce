'use client'
import ColorBar from "@/components/ui/components/shop/colorBar";
import RangeBar from "@/components/ui/components/shop/rangeBar";
import StockStatus from "@/components/ui/components/shop/stockStatus";
import TopRatedProducts from "@/components/ui/components/shop/topRatedProducts";
import { useState } from "react";
export default function page() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };
const [value, setValue] = useState(5); // Initialize value state
    return (
        <>
            <div className="full_upper_container">
                <div className="upper_text max-w-8xl flex justify-center mt-8 ">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold ">
                            <span style={{ color: '#E8A811' }}>SHOP</span> NOW
                        </h1>
                        <div className="category_section large-screen">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                                    <div className="absolute flex top-full left-0 min-w-[250px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
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
                            <div className="lg:hidden flex items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 sm:justify-center">
                                <div className="group relative">
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

            <div className="full_lower_container_small_screen my-14 px-3 ">
                <div className="text_section  max-w-7xl mx-auto  my-6 px-3">
                    <div className="flex py-3 justify-between  px-3 gap-x-6">

                        <div className="left w-1/5  ">
                            <RangeBar/>
                            <div className="line w-full h-px bg-gray-300 my-6">
                            </div>
                            <ColorBar/>
                            <div className="line w-full h-px bg-gray-300 my-6">
                            </div>
                            <StockStatus/>
                            <div className="line w-full h-px bg-gray-300 my-6">
                            </div>
                            <TopRatedProducts/>
                        </div>
                        <div className="right w-4/5 ">
                            ass
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
