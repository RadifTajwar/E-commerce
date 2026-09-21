'use client'
import AllMainBanner from "@/components/ui/components/admin/mainBanner/allMainBanner";
import UpdateMainBanner from "@/components/ui/components/admin/mainBanner/updateMainBanner";
import { fetchAllHeroBanners } from "@/redux/heroBanner/allHeroBannerSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function page() {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false)

  const idRef = useRef(null);
  const resetId = () => {
    idRef.current = null; // Reset the ID
    setIsVisible(false);  // Optionally hide the drawer
    setDeleteVisible(false);
  };

  const doneUpdate = () => {
    toast.success("Main Banner Updated Successfully!", {
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
      dispatch(fetchAllHeroBanners());
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
  

  return (
    <>

      <div className=" max-w-2xl md:max-w-3xl lg:max-w-7xl grid px-6 mx-auto overflow-x-auto">
        <ToastContainer />

        {
          isVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={
              resetId
            } />
          )
        }

        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Hero Banner</h1>

        <AllMainBanner toggleDeleteVisible={toggleDeleteVisible} toggleVisibility={toggleVisibility} />

      </div>

      <div
        className={`drawer-content-wrapper w-full sm:w-1/2 fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <UpdateMainBanner toggleVisibility={toggleVisibility} id={idRef.current} resetId={resetId} 
        doneUpdate={doneUpdate} />
      </div>

    </>
  )
}
