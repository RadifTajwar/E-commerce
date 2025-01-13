'use client'
import AddParentCategory from "@/components/ui/components/admin/parentCategories/addParentCategory";
import AllParentCategories from "@/components/ui/components/admin/parentCategories/allParentCategories";
import DeleteVisible from "@/components/ui/components/admin/parentCategories/deleteVisible";
import UpdateParentCateogories from "@/components/ui/components/admin/parentCategories/updateParentCategories";
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function page() {

  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);
  const [exportButtonForm, setExportButtonForm] = useState(false)
  const [importButtonForm, setImportButtonForm] = useState(false)
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);
  const [deleteVisible, setDeleteVisible] = useState(false)

  const idRef = useRef(null);
  const resetId = () => {
    idRef.current = null; // Reset the ID
    setIsVisible(false);  // Optionally hide the drawer
    setDeleteVisible(false);
  };

  const doneAddProduct = (result) => {

    if (result == "success") {
      toast.success("Product Added Successfully!", {
        position: "top-right",
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
       // Delay the dispatch by 2 seconds
    setTimeout(() => {
      dispatch(fetchAllParentCategories());
    }, 2000); // 2000 milliseconds = 2 seconds
    setIsVisibleAddProduct(false); // Optionally hide the drawer
    }
    else if(result=="duplicate"){
      toast.error("Duplicate Product!", {
        position: "top-right",
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsVisibleAddProduct(false); // Optionally hide the drawer
    }
    else if(result=="validationError"){
      toast.error("No input field can be empty!", {
        position: "top-right",
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
    }
    else{
      toast.error("Internal Server Error!", {
        position: "top-right",
        autoClose: 3000, // Auto-close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

   
  }

  const doneUpdate = () => {
    toast.success("Category Updated Successfully!", {
      position: "top-right",
      autoClose: 3000, // Auto-close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // Delay the dispatch by 2 seconds
    setTimeout(() => {
      dispatch(fetchAllParentCategories());
    }, 2000); // 2000 milliseconds = 2 seconds
    
  };

  // This is your existing toggleVisibility function that triggers the drawer visibility
  const toggleVisibility = (id) => {
    setIsVisible(!isVisible); // Toggle the drawer visibility
    if (id && typeof id !== "object") {
      idRef.current = id; // Update idRef only if id is a valid value
    }
  };

  const toggleAddProductVisible = (id) => {

    setIsVisibleAddProduct(!isVisibleAddProduct);
  };

  const toggleDeleteVisible = (id) => {
    setDeleteVisible(!deleteVisible);
    if (id && typeof id !== "object") {
      idRef.current = id; // Update idRef only if id is a valid value
    }
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

      <div className=" max-w-2xl md:max-w-3xl lg:max-w-7xl grid px-6 mx-auto overflow-x-auto">
        <ToastContainer />

        {
          isVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={
              toggleVisibility
            } />
          )
        }

        {
          isVisibleAddProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30 " onClick={
              toggleAddProductVisible
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

        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Parent Categories</h1>

        <div className="min-w-0  border border-gray-200 rounded-lg ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 shadow-xs mb-5">
          <div className="p-4">
            <form className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex">
              
              <div className="lg:flex md:flex   md:w-full md:justify-end flex-grow-0">
                <div className="w-full md:w-48 lg:w-48 xl:w-48">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12"
                    type="button"
                    onClick={toggleAddProductVisible}
                  >
                    <span className="mr-2">
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
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </span>
                    Add Parent Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      

        <AllParentCategories toggleDeleteVisible={toggleDeleteVisible} toggleVisibility={toggleVisibility} />

      </div>

      <div
        className={`drawer-content-wrapper w-full sm:w-1/2 fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <UpdateParentCateogories toggleVisibility={toggleVisibility} id={idRef.current} resetId={resetId} 
        doneUpdate={doneUpdate} />
      </div>


      <div
        className={`drawer-content-wrapper w-full sm:w-1/2 fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isVisibleAddProduct ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <AddParentCategory toggleAddProductVisible={toggleAddProductVisible} doneAddProduct={doneAddProduct} />
      </div>

      <div
        className={`fixed w-[576px] h-[306px] top-1/2 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-in-out
    ${deleteVisible ? '-translate-y-1/2 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`} >
        <DeleteVisible toggleDeleteVisible={toggleDeleteVisible} id={idRef.current} resetId={resetId} doneUpdate={doneUpdate} />
      </div>
    </>
  )
}
