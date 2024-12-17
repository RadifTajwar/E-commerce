'use client'
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";
export default function topBar({toggleSidebar }) {
    const router = useRouter();
    const pathName = usePathname();
    const [notificationBarClicked, setNotificationBarClicked] = useState(false)
    const [profileClicked, setProfileClicked] = useState(false)
    return (
        <>
            <header className="z-30 py-4 bg-white shadow-sm dark:bg-gray-800">
                <div className="max-w-4xl lg:max-w-7xl mx-auto flex items-center justify-between h-full px-6 mx-auto text-blue-500 dark:text-blue-500">
                    <button className="radif p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none" aria-label="Menu" onClick={toggleSidebar}>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-6 h-6" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="48" d="M88 152h336M88 256h336M88 360h336">

                            </path>
                        </svg>
                    </button>
                    <span>
                    </span>
                    <ul className="flex justify-end items-center flex-shrink-0 space-x-6">

                        <li className="flex">
                            <button className="rounded-md focus:outline-none" aria-label="Toggle color mode"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M152.62 126.77c0-33 4.85-66.35 17.23-94.77C87.54 67.83 32 151.89 32 247.38 32 375.85 136.15 480 264.62 480c95.49 0 179.55-55.54 215.38-137.85-28.42 12.38-61.8 17.23-94.77 17.23-128.47 0-232.61-104.14-232.61-232.61z">
                                </path>
                            </svg>
                            </button>
                        </li>
                        <li className="relative inline-block text-left">
                            <button className="relative align-middle rounded-md focus:outline-none" onClick={() => { setNotificationBarClicked(!notificationBarClicked); setProfileClicked(false); }}>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M256 480a80.09 80.09 0 0073.3-48H182.7a80.09 80.09 0 0073.3 48zm144-192v-60.53C400 157 372.64 95.61 304 80l-8-48h-80l-8 48c-68.88 15.61-96 76.76-96 147.47V288l-48 64v48h384v-48z">

                                    </path>
                                </svg><span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">6</span>
                            </button>
                            {
                                notificationBarClicked && (
                                    <>
                                        <div className=" absolute  -right-16 sm:right-0 top-7 mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 ">
                                            <div className="notification-box ">
                                                <div className="relative overflow-hidden w-full h-full">
                                                    <div className="inset-0 overflow-scroll mr-0 mb-0 ">
                                                        <ul className="block text-sm border-t border-gray-100 dark:border-gray-700 rounded-md w-80">
                                                            <li className="flex justify-between items-center font-serif font-normal text-sm py-3 border-b border-gray-100 dark:border-gray-700 px-3 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100 cursor-pointer w-full">
                                                                <div className="flex items-center">
                                                                    <div className="relative rounded-full inline-block w-8 h-8 p-1 mr-2 md:block bg-gray-50 border border-gray-200">
                                                                        <img className="object-cover w-full h-full rounded-full" src="https://i.postimg.cc/tCsSNSxS/Yellow-Sweet-Corn-Bag-each.jpg" alt="image" loading="lazy" />
                                                                        <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true">

                                                                        </div>
                                                                    </div>
                                                                    <div className="notification-content">
                                                                        <h6 className="font-medium text-gray-500">Yellow Sweet Corn</h6>
                                                                        <p className="flex items-center text-xs text-gray-400">
                                                                            <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-red-500 bg-red-100 dark:text-red-100 dark:bg-red-800">Stock Out</span>
                                                                            <span className="ml-2">Dec 12 2021 - 12:40PM</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="px-2">
                                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z">

                                                                        </path>
                                                                    </svg>
                                                                </span>
                                                            </li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                        </li>
                        <li className="relative inline-block text-left">
                            <button className="rounded-full dark:bg-gray-500 bg-blue-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none" onClick={() => { setProfileClicked(!profileClicked); setNotificationBarClicked(false); }}>
                                <span>A</span>
                            </button>
                            {
                                profileClicked && (
                                    <>
                                        <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">


                                            <li className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                                <span className="flex items-center text-sm">
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-4 h-4 mr-3" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256">

                                                        </path>
                                                    </svg>
                                                    <span>Log Out</span>
                                                </span>
                                            </li>
                                        </ul>
                                    </>
                                )
                            }

                        </li>
                    </ul>
                </div>
            </header>
        </>
    )
}
