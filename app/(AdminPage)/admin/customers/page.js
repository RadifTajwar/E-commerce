'use client'
import AllCustomers from "@/components/ui/components/admin/customers/allCustomers"
import DeleteVisible from "@/components/ui/components/admin/customers/deleteVisible"
import UpdateCustomer from "@/components/ui/components/admin/customers/updateCustomer"
import Image from "next/image"
import { useRef, useState } from "react"

export default function page() {
  const [exportButtonForm, setExportButtonForm] = useState(false)
  const [importButtonForm, setImportButtonForm] = useState(false)
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false)
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    console.log('toggle  visibl');
  };

  const toggleDeleteVisible = () => {
    setDeleteVisible(!deleteVisible);
    console.log('toggle delete visibl');
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset the file input
    }
  };
  return (
    <>


      <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
        {
          isVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={
              toggleVisibility
            } />
          )
        }

        {
          deleteVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={
              toggleDeleteVisible
            } />
          )
        }
        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Customers</h1>
        <div className="min-w-0 rounded-lg border border-gray-200 overflow-hidden bg-white dark:bg-gray-800 min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <div className="p-4">
            <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="items-center">
                <div className=" lg:flex md:flex flex-grow-0">
                  <div className="flex">
                    <div className="lg:flex-1 md:flex-1 mr-3 sm:flex-none">
                      <div className="border flex justify-center items-center border-gray-300 hover:border-blue-400 hover:text-blue-400  dark:text-gray-300 cursor-pointer h-10 w-20 rounded-md focus:outline-none" onClick={() => { setExportButtonForm(!exportButtonForm) }}>
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4">

                          </path>
                          <polyline points="17 8 12 3 7 8">

                          </polyline>
                          <line x1="12" y1="3" x2="12" y2="15">

                          </line>
                        </svg>
                        <span className="text-xs">Export</span>
                      </div>
                      {
                        exportButtonForm && (
                          <>
                            <ul className="origin-top-left absolute  w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                              <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                <button type="button" className="focus:outline-none">
                                  <span className="flex items-center text-sm">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="w-4 h-4 mr-3" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317V5.5zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z">

                                      </path>
                                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z">

                                      </path>
                                    </svg>
                                    <span>Export to CSV</span>
                                  </span>
                                </button>
                              </li>
                              <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                <button type="button" className="focus:outline-none">
                                  <span className="flex items-center text-sm">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="w-4 h-4 mr-3" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z">

                                      </path>
                                      <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z">

                                      </path>
                                    </svg>
                                    <span>Export to JSON</span>
                                  </span>
                                </button>
                              </li>
                            </ul>
                          </>
                        )
                      }

                    </div>
                    <div className="lg:flex-1 md:flex-1 mr-3  sm:flex-none">
                      <div className="border flex justify-center items-center h-10 w-20 hover:text-yellow-400  border-gray-300 dark:text-gray-300 cursor-pointer  py-2 hover:border-yellow-400 rounded-md focus:outline-none" onClick={() => { setImportButtonForm(!importButtonForm) }}>
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4">

                          </path>
                          <polyline points="7 10 12 15 17 10">

                          </polyline>
                          <line x1="12" y1="15" x2="12" y2="3">

                          </line>
                        </svg>
                        <span className="text-xs">Import</span>
                      </div>
                    </div>
                  </div>
                  {
                    importButtonForm && (
                      <>
                        <div className="w-full my-2 lg:my-0 md:my-0 flex">
                          <div className="h-10 border border-dashed border-blue-500 rounded-md">
                            {fileName ? (
                              <div className="w-full rounded-lg h-10 flex items-center text-xs dark:text-gray-400 leading-none cursor-pointer">
                                <span className="text-sm dark:text-gray-400">{fileName}</span>
                                <button
                                  type="button"
                                  className="text-red-500 focus:outline-none mx-4 text-lg"
                                  onClick={handleRemoveFile}
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <label
                                htmlFor="file-upload"
                                className="w-full rounded-lg h-10 flex justify-center items-center text-xs dark:text-gray-400 leading-none cursor-pointer"
                              >
                                <input
                                  id="file-upload"
                                  ref={inputRef}
                                  className="hidden"
                                  type="file"
                                  accept=".csv,.xls,.json"
                                  onChange={handleFileChange}
                                />
                                <svg
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mx-2 text-blue-500 text-lg dark:text-gray-400"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <polyline points="16 16 12 12 8 16" />
                                  <line x1="12" y1="12" x2="12" y2="21" />
                                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                  <polyline points="16 16 12 12 8 16" />
                                </svg>
                                Select Your JSON Customers File
                              </label>
                            )}


                          </div>

                          <div className="flex">
                            <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full rounded-md h-10 ml-2  text-xs px-2" type="button">
                              <span className="">
                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <line x1="12" y1="5" x2="12" y2="19">

                                  </line>
                                  <line x1="5" y1="12" x2="19" y2="12">
                                  </line>
                                </svg>
                              </span>
                              <span className=" text-sx w-20">ImportNow</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  }



                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-gray-200 overflow-hidden bg-white dark:bg-gray-800 min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <div className="p-4">
            <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <input className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full  border-transparent focus:bg-white" type="search" name="search" placeholder="Search by name/email/phone" />
                <button type="submit" className="absolute right-0 top-0 mt-5 mr-1">

                </button>
              </div>
            </form>
          </div>
        </div>

        <AllCustomers toggleVisibility={toggleVisibility} toggleDeleteVisible={toggleDeleteVisible} />
        <div className="text-center align-middle mx-auto p-5 my-5">
          <div className="image w-full flex justify-center">
            <Image className="my-4" src="/no-result.svg" alt="no-result" width={400} height={400} />
          </div>



          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium font-serif text-gray-600">Sorry, we can not find this Sorry, There are no customers right now.<span role="img" aria-labelledby="img">😞</span>
          </h2>
        </div>


      </div>

      <div
        className={`drawer-content-wrapper w-full sm:w-1/2 fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <UpdateCustomer toggleVisibility={toggleVisibility} />
      </div>

      <div
        className={`fixed w-[576px] h-[306px] top-1/2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-in-out
    ${deleteVisible ? '-translate-y-1/2 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <DeleteVisible toggleDeleteVisible={toggleDeleteVisible} />
      </div>


    </>
  )
}
