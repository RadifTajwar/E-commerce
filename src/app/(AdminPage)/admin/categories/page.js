"use client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import SearchForm from "@/components/admin/SearchForm";
import AddCategory from "@/components/ui/components/admin/categories/addCategory";
import AllCategories from "@/components/ui/components/admin/categories/allCategories";
import UpdateCategories from "@/components/ui/components/admin/categories/updateCategories";
import { PlusIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { notify } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCategoryById, fetchAllCategories, fetchCategoryById } from "@/store/slices/category.slice";
import { useRef, useState } from "react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);
  const [exportButtonForm, setExportButtonForm] = useState(false);
  const [importButtonForm, setImportButtonForm] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const { categoryData } = useAppSelector((state) => state.categoryById);
  const deleteName = categoryData && categoryData.id === deleteId ? categoryData.name : "";

  const refetch = () => dispatch(fetchAllCategories());

  const doneAddProduct = (result, message) => {
    if (result === "success") {
      notify.success("Category Added Successfully!");
      refetch();
      setIsVisibleAddProduct(false);
    } else if (result === "validationError") {
      notify.error("No input field can be empty!");
    } else {
      notify.error(message || "Internal Server Error!");
    }
  };

  const doneUpdate = () => {
    notify.success("Category Updated Successfully!");
    refetch();
  };

  const openUpdate = (id) => setUpdateId(id);
  const closeUpdate = () => setUpdateId(null);

  const openDelete = (id) => {
    setDeleteId(id);
    if (isObjectId(id)) dispatch(fetchCategoryById(id));
  };
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCategoryById(deleteId)).unwrap();
      closeDelete();
      notify.success("Category Deleted Successfully!");
      refetch();
    } catch (error) {
      notify.error(error.message);
    }
  };

  const toggleAddProductVisible = () => setIsVisibleAddProduct((open) => !open);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <div className=" max-w-2xl md:max-w-3xl lg:max-w-7xl grid px-6 mx-auto overflow-x-auto">
        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Categories</h1>

        <div className="min-w-0  border border-gray-200 rounded-lg ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 shadow-xs mb-5">
          <div className="p-4">
            <form className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex" onSubmit={(e) => e.preventDefault()}>
              <div className="flex justify-start xl:w-1/2 md:w-full">
                <div className="lg:flex md:flex flex-grow-0">
                  <div className="flex">
                    <div className="lg:flex-1 md:flex-1 mr-3 sm:flex-none">
                      <div
                        className="border flex justify-center items-center border-gray-300 hover:border-blue-400 hover:text-blue-400 dark:text-gray-300 cursor-pointer h-10 w-20 rounded-md focus:outline-none"
                        onClick={() => setExportButtonForm(!exportButtonForm)}
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                          height="1em"
                          width="1em"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span className="text-xs">Export</span>
                      </div>
                      {exportButtonForm && (
                        <ul className="origin-top-left absolute  w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                          <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                            <button type="button" className="focus:outline-none">
                              <span className="flex items-center text-sm">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 16 16"
                                  className="w-4 h-4 mr-3"
                                  aria-hidden="true"
                                  height="1em"
                                  width="1em"
                                >
                                  <path d="M7.5 5.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L6 7l-.549.317a.5.5 0 1 0 .5.866l.549-.317V8.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L8 7l.549-.317a.5.5 0 1 0-.5-.866l-.549.317V5.5zm-2 4.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"></path>
                                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>
                                </svg>
                                <span>Export to CSV</span>
                              </span>
                            </button>
                          </li>
                          <li className="justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                            <button type="button" className="focus:outline-none">
                              <span className="flex items-center text-sm">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 16 16"
                                  className="w-4 h-4 mr-3"
                                  aria-hidden="true"
                                  height="1em"
                                  width="1em"
                                >
                                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"></path>
                                  <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"></path>
                                </svg>
                                <span>Export to JSON</span>
                              </span>
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div className="lg:flex-1 md:flex-1 mr-3 sm:flex-none">
                      <div
                        className="border flex justify-center items-center h-10 w-20 hover:text-yellow-400 border-gray-300 dark:text-gray-300 cursor-pointer py-2 hover:border-yellow-400 rounded-md focus:outline-none"
                        onClick={() => setImportButtonForm(!importButtonForm)}
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                          height="1em"
                          width="1em"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span className="text-xs">Import</span>
                      </div>
                    </div>
                  </div>
                  {importButtonForm && (
                    <div className="w-full my-2 lg:my-0 md:my-0 flex">
                      <div className="h-10 border border-dashed border-blue-500 rounded-md">
                        {fileName ? (
                          <div className="w-full rounded-lg h-10 flex items-center text-xs dark:text-gray-400 leading-none cursor-pointer">
                            <span className="text-sm dark:text-gray-400">{fileName}</span>
                            <button
                              type="button"
                              className="text-red-500 focus:outline-none mx-4 text-lg"
                              aria-label="Remove file"
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
                                aria-hidden="true"
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
                              aria-hidden="true"
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
                        <button
                          className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full rounded-md h-10 ml-2  text-xs px-2"
                          type="button"
                        >
                          <span className="">
                            <PlusIcon className="h-[1em] w-[1em]" />
                          </span>
                          <span className=" text-sx w-20">ImportNow</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:flex md:flex xl:justify-end xl:w-1/2 md:w-full md:justify-start flex-grow-0">
                <div className="w-full md:w-48 lg:w-48 xl:w-48">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12"
                    type="button"
                    onClick={toggleAddProductVisible}
                  >
                    <span className="mr-2">
                      <PlusIcon className="h-[1em] w-[1em]" />
                    </span>
                    Add Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="seaarchForm">
          <SearchForm value={searchTerm} onChange={setSearchTerm} placeholder="Search Category" />
        </div>

        <AllCategories onEdit={openUpdate} onDelete={openDelete} search={debouncedSearch} />
      </div>

      <AdminDrawer isOpen={Boolean(updateId)} onClose={closeUpdate}>
        <UpdateCategories
          toggleVisibility={closeUpdate}
          id={updateId}
          resetId={closeUpdate}
          doneUpdate={doneUpdate}
        />
      </AdminDrawer>

      <AdminDrawer isOpen={isVisibleAddProduct} onClose={toggleAddProductVisible}>
        <AddCategory toggleAddProductVisible={toggleAddProductVisible} doneAddProduct={doneAddProduct} />
      </AdminDrawer>

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteId)}
        name={deleteName}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
