'use client'
import DashboardStats from "@/components/ui/components/admin/dashboard/dashboardStats";
import HighestSellingProducts from '@/components/ui/components/admin/dashboard/highestSellingProducts';
import OrderStats from "@/components/ui/components/admin/dashboard/orderStats";
// import WeeklySales from "@/components/ui/components/admin/dashboard/weeklySales";

import RecentOrders from "@/components/ui/components/admin/orders/recentOrders";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function page() {

    const [isOrderFetched, setIsOrderFetched] = useState(false);
  const dispatch = useDispatch();
  const idRef = useRef(null);

  const [deleteVisible, setDeleteVisible] = useState(false)
  const resetId = () => {
    idRef.current = null; // Reset the ID

    setDeleteVisible(false);
  };

  const doneUpdate = () => {
    toast.success("Order Updated Successfully!", {
      position: "top-right",
      autoClose: 3000, // Auto-close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const toggleDeleteVisible = (id) => {
    setDeleteVisible(!deleteVisible);
    if (id && typeof id !== "object") {
      idRef.current = id; // Update idRef only if id is a valid value
    }
  };

    const pathName = usePathname();
    return (

        <>
        {
        deleteVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleDeleteVisible} />
        )
      }

                    
                        <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
                        <ToastContainer />
                            {
                                pathName == '/admin/dashboard'?(
                                    <>
                                     <div className="dashBoard">
                                <h1 className="my-6 text-lg font-bold text-gray-800 ">
                                    Dashboard Overview
                                </h1>
                                <div className="orderStats">
                                    <OrderStats />

                                </div>

                                <div className="dashboardStats">
                                    <DashboardStats />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 my-8 mx-auto">
                                    {/* <div className="weeklySales flex justify-center w-full">
                                        <WeeklySales />
                                    </div> */}
                                    <div className="higestSellingProducts  flex justify-center w-full">
                                        <HighestSellingProducts />
                                    </div>

                                </div>

                                <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Recent Order</h1>

                                
                            </div>
                               <RecentOrders doneUpdate={doneUpdate} toggleDeleteVisible={toggleDeleteVisible} isOrderFetched={isOrderFetched} setIsOrderFetched={setIsOrderFetched} />
                                    </>
                                ):(
                                    <>
                                    <div className="abd">
                                        asdf
                                    </div>
                                    </>
                                )
                            }
                           

                        </div>


                   


               





        </>

    )
}
