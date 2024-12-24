
export default function searchForm({isInput, handleInputChnage }) {
    return (
        <>
            <div className="min-w-0 rounded-lg border border-gray-200 ring-opacity-4 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
                <div className="p-4">
                    <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
                        {/* Search Input */}
                        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow relative">
                            <input
                                type="search"
                                name="search"
                                placeholder="Search Product"
                                className="block w-full px-3 py-1 text-sm leading-5 rounded-md focus:outline-none dark:text-gray-300 focus:border-gray-200 border border-gray-200 dark:border-gray-600  dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 h-12 bg-gray-100 border-transparent focus:bg-white"
                                value={isInput}
                                onChange={handleInputChnage}
                            />
                            <button type="submit" className="absolute right-0 top-0 mt-5 mr-1">
                                {/* Add your submit icon inside this button if needed */}
                            </button>
                        </div>

                      
                       
                    </form>
                </div>
            </div>


        </>
    )
}
