
export default function deleteVisible({toggleDeleteVisible}) {
    return (
        <>
            <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg  sm:max-w-xl custom-modal" role="dialog">
                <div data-focus-guard="true" tabIndex="0" className="w-px h-0 p-0 overflow-hidden fixed top-px left-px ">
                </div>
                <div data-focus-guard="true" tabIndex="1" className="w-px h-0 p-0 overflow-hidden fixed top-px left-px">
                </div><div data-focus-lock-disabled="false">
                    <header className="flex justify-end">
                        <button className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700" aria-label="close" onClick={toggleDeleteVisible}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
                                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd">
                                </path>
                            </svg>
                        </button>
                    </header>
                    <div className="mb-6 text-sm text-gray-700 dark:text-gray-400 text-center custom-modal px-8 pt-6 pb-4">
                        <span className="flex justify-center text-3xl mb-6 text-red-500">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6">

                                </polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                </path>
                                <line x1="10" y1="11" x2="10" y2="17">
                                </line>
                                <line x1="14" y1="11" x2="14" y2="17">
                                </line>
                            </svg>
                        </span>
                        <h2 className="text-xl font-medium mb-2">Are You Sure! Want to Delete <span className="text-red-500">webdesigner</span>?</h2>
                        <p>Do you really want to delete these records? You can't view this in your list anymore if you delete!</p>
                    </div>
                    <footer className="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row bg-gray-50 dark:bg-gray-800 justify-center">
                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 w-full sm:w-auto hover:bg-white hover:border-gray-50" type="button">No, Keep It</button>
                        <div className="flex justify-end">
                            <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12 sm:w-auto" type="button">Yes, Delete It</button>
                        </div>
                    </footer>
                </div>

            </div>
        </>
    )
}
