'use client'
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
export default function SideBar({ isOpen, setIsOpen }) {
    const [catalogButtonForm, setCatalogButtonForm] = useState(false)

    const router = useRouter();
    const pathName = usePathname();
    const sideBarComponentClicked = (route) => {
        console.log('SideBar Component Clicked');
        router.push(`/admin/${route}`);
        setTimeout(() => {
            setIsOpen(false);
        }, 500);

    }

    return (
        <>
            {/* Sidebar Component */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
            >
                <div className="py-4 text-gray-500 dark:text-gray-400 h-full">
                    {/* Close Button for Smaller Screens */}
                    <button
                        className="lg:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-300"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                    <div className=" text-gray-900 dark:text-gray-200" onClick={() => { sideBarComponentClicked('dashboard') }}>
                        <div className="ml-5 flex font-bold">
                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <line x1="22" y1="2" x2="11" y2="13">

                                </line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2">
                                </polygon>
                            </svg>
                            <h6 className="ml-2">Tithi Admin</h6>
                        </div>
                    </div>
                    <ul className="mt-6">
                        <li className="relative">
                            <div aria-current="page" className={`cursor-pointer px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200 hover:text-blue-600 ${pathName == '/admin/dashboard' ? 'bg-blue-500 text-white' : 'text'} dark:text-gray-100`} target="_self" onClick={() => { sideBarComponentClicked('dashboard') }}>
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="3" width="7" height="7">
                                    </rect>
                                    <rect x="14" y="3" width="7" height="7">
                                    </rect>
                                    <rect x="14" y="14" width="7" height="7">
                                    </rect>
                                    <rect x="3" y="14" width="7" height="7">
                                    </rect>
                                </svg>
                                <span className="ml-4">Dashboard</span>
                            </div>
                        </li>
                        <li className="relative px-6 py-3">
                            <button
                                className="inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-colors duration-150 hover:text-blue-600 dark:hover:text-gray-200"
                                aria-haspopup="true"
                                onClick={() => setCatalogButtonForm(!catalogButtonForm)}
                            >
                                <span className="inline-flex items-center">
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                                        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                                        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
                                        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
                                        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
                                        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                                        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
                                        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
                                    </svg>
                                    <span className="ml-4 mt-1">Catalog</span>
                                    <span className="pl-4 mt-1">
                                        {catalogButtonForm ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 512 512"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="48"
                                                    d="M112 184l144 144 144-144"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 512 512"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="48"
                                                    d="M184 112l144 144-144 144"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${catalogButtonForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <ul
                                    className="p-2 text-sm font-medium text-gray-500 rounded-md dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu"
                                >
                                    <li>
                                        <div
                                            className="flex items-center font-serif py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                            onClick={() => sideBarComponentClicked("products")}
                                        >
                                            <span
                                                className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="text-xs text-gray-500 pr-1">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 512 512"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fill="none"
                                                        strokeLinecap="square"
                                                        strokeLinejoin="round"
                                                        strokeWidth="32"
                                                        d="M400 256H112"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="text-gray-500 hover:text-blue-600 dark:hover:text-gray-200">
                                                Products
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            className="flex items-center font-serif py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                            onClick={() => sideBarComponentClicked("categories")}
                                        >
                                            <span
                                                className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="text-xs text-gray-500 pr-1">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 512 512"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fill="none"
                                                        strokeLinecap="square"
                                                        strokeLinejoin="round"
                                                        strokeWidth="32"
                                                        d="M400 256H112"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="text-gray-500 hover:text-blue-600 dark:hover:text-gray-200">
                                            Categories
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            className="flex items-center font-serif py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                            onClick={() => sideBarComponentClicked("parentCategories")}
                                        >
                                            <span
                                                className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="text-xs text-gray-500 pr-1">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 512 512"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fill="none"
                                                        strokeLinecap="square"
                                                        strokeLinejoin="round"
                                                        strokeWidth="32"
                                                        d="M400 256H112"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="text-gray-500 hover:text-blue-600 dark:hover:text-gray-200">
                                            Parent Categories
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            className="flex items-center font-serif py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                                            
                                        >
                                            <span
                                                className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="text-xs text-gray-500 pr-1">
                                                <svg
                                                    stroke="currentColor"
                                                    fill="currentColor"
                                                    strokeWidth="0"
                                                    viewBox="0 0 512 512"
                                                    height="1em"
                                                    width="1em"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fill="none"
                                                        strokeLinecap="square"
                                                        strokeLinejoin="round"
                                                        strokeWidth="32"
                                                        d="M400 256H112"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="text-gray-500 hover:text-blue-600 dark:hover:text-gray-200">
                                                Coupon
                                            </span>
                                        </div>
                                    </li>
                                    {/* Add other menu items here */}
                                </ul>
                            </div>
                        </li>
                        <li className="relative">
                            <div className={`px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors  ${pathName == '/admin/customers' ? 'bg-blue-500 text-white' : ''} hover:text-blue-600 cursor-pointer duration-150 dark:hover:text-gray-200`}
                                target="_self" onClick={() => { sideBarComponentClicked('customers') }}
                            >
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2">

                                    </path>
                                    <circle cx="9" cy="7" r="4">

                                    </circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87">

                                    </path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75">

                                    </path>
                                </svg>
                                <span className="ml-4">Customers</span>
                            </div>
                        </li>
                        <li className="relative">
                            <div className={`px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors hover:text-blue-600 cursor-pointer ${pathName == '/admin/orders' ? 'bg-blue-500 text-white' : ''} duration-150 dark:hover:text-gray-200`} target="_self" onClick={() => { sideBarComponentClicked('orders') }}
                            >
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10">

                                    </circle>
                                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76">
                                    </polygon>
                                </svg>
                                <span className="ml-4">Orders</span>
                            </div>
                        </li>

                        <li className="relative">
                            <div className={`px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors hover:text-blue-600  cursor-pointer duration-150 dark:hover:text-gray-200 ${pathName == '/admin/settings' ? 'bg-blue-500 text-white' : ''}`} target="_self" onClick={() => { sideBarComponentClicked('settings') }}
                            >
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="3">
                                    </circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">

                                    </path>
                                </svg>
                                <span className="ml-4">Settings</span>
                            </div>
                        </li>


                        <li className="relative px-6 py-3">
                            <button className="inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-colors duration-150 hover:text-blue-600 dark:hover:text-gray-200" aria-haspopup="true">
                                <span className="inline-flex items-center">
                                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-5 h-5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z">
                                        </path>
                                        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z">
                                        </path>
                                        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z">

                                        </path>
                                        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z">
                                        </path>
                                        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"></path>
                                        <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z">
                                        </path>
                                        <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z">
                                        </path>
                                        <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z">
                                        </path>
                                    </svg>
                                    <span className="ml-4 mt-1">Pages</span>
                                    <span className="pl-4 mt-1">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144">
                                            </path>
                                        </svg>
                                    </span>
                                </span>
                            </button>
                        </li>
                    </ul>
                    <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-3 rounded-lg text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full bg-blue-500 hover:bg-blue-700" type="button">
                            <span className="flex items-center">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="mr-3 text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256">
                                    </path>
                                </svg>
                                <span className="text-sm">Log Out</span>
                            </span>
                        </button>
                    </span>
                </div>
            </div>
        </>
    )
}
