
export default function orderStats() {
    return (
        <>
            <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
                {/* Card 1 - Today Orders */}
                <div className="min-w-0 rounded-lg  ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 flex h-full shadow-lg">
                    <div className="p-4 flex items-center border border-gray-200 dark:border-gray-800 w-full rounded-lg">
                        <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500">
                            {/* Icon */}
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-sm mb-1 font-normal text-gray-600 dark:text-gray-400">Today Orders</h6>
                            <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">8</p>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Orders Pending */}
                <div className="min-w-0 rounded-lg  ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 flex h-full shadow-lg">
                    <div className="p-4 flex items-center border border-gray-200 dark:border-gray-800 w-full rounded-lg">
                        <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500">
                            {/* Icon */}
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <polyline points="1 20 1 14 7 14"></polyline>
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-sm mb-1 font-normal text-gray-600 dark:text-gray-400">
                                Orders Pending <span className="text-red-500 text-sm font-semibold">(1181.07)</span>
                            </h6>
                            <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">1</p>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Orders Processing */}
                <div className="min-w-0 rounded-lg ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 flex h-full shadow-lg">
                    <div className="p-4 flex items-center border border-gray-200 dark:border-gray-800 w-full rounded-lg">
                        <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500">
                            {/* Icon */}
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="3" width="15" height="13"></rect>
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-sm mb-1 font-normal text-gray-600 dark:text-gray-400">Orders Processing</h6>
                            <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">0</p>
                        </div>
                    </div>
                </div>

                {/* Card 4 - Orders Delivered */}
                <div className="min-w-0 rounded-lg ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 flex h-full shadow-lg">
                    <div className="p-4 flex items-center border border-gray-200 dark:border-gray-800 w-full rounded-lg">
                        <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500">
                            {/* Icon */}
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-sm mb-1 font-normal text-gray-600 dark:text-gray-400">Orders Delivered</h6>
                            <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">6</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
