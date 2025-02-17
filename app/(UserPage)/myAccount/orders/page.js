'use client'
import { fetchOrderByUser } from "@/redux/order/getOrderByUserSlice"
import localStorageUtil from "@/utils/localStorageUtil"
import { jwtDecode } from "jwt-decode"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function page() {
    const router = useRouter();
    const pathName = usePathname();
    const dispatch = useDispatch();
    const [orderFetched, setOrderFetched] = useState(false);
    const { order, isLoading, error } = useSelector(state => state.getOrderByUser)
    useEffect(() => {
       const token= localStorageUtil.getItem('accessToken');
       const decoded= jwtDecode(token);
       if(!orderFetched){
        dispatch(fetchOrderByUser(decoded.email))
        setOrderFetched(true);   
       }
       
    }, [dispatch,pathName])

    console.log(order);

    const handleView = (id) => {
        router.push(`/myAccount/viewOrder/${id}`)
    }

    return (
        <>

            {isLoading &&  <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
                    <div className="border border-gray-700 py-2  text-black text-sm">
                    <span className="flex justify-center items-center ">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin me-2"></div>
                        Loading...
                    </span>
                        </div>
                   
                </div>
            }
            {error && <p>{error}</p>}
            {!isLoading && order && order.length>0 ? (
                <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">

                    <div className="table_container_lg_screen hidden lg:block">
                        <table className="table-auto w-full border-collapse ">
                            {/* Table Header */}
                            <thead className="border-b border-gray-300">
                                <tr className="table_header ">
                                    {/* Order & Date */}
                                    <td className="px-2.5 py-4 text-left text-gray-900 ">
                                        Order
                                    </td>
                                    <td className="px-2.5 py-4 text-left ">
                                        Date
                                    </td>

                                    {/* Status & Total */}
                                    <td className="px-2.5 py-4 text-left ">
                                        Status
                                    </td>
                                    <td className="px-2.5 py-4 text-left ">
                                        Total
                                    </td>

                                    {/* Actions */}
                                    <td className="px-2.5 py-4 text-right ">
                                        Actions
                                    </td>
                                </tr>
                            </thead>

                            {/* Table Body */}

                            <tbody>
                                {
                                   order &&  order?.map((orders) => (
                                        <tr key={orders?._id} className="table_header border-b border-gray-300">
                                           
                                            <td className="px-2.5 py-4 text-left text-gray-900 text-sm cursor-pointer">
                                                #{orders?._id}
                                            </td>
                                            <td className="px-2.5 py-4 text-left text-sm text-gray-500">
                                                {new Date(orders?.dateOrdered).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </td>

                                     
                                            <td className="px-2.5 py-4 text-left text-sm text-gray-500">
                                                {orders.status}
                                            </td>
                                            <td className="px-2.5 py-4 text-left text-sm text-gray-500">
                                                <span className="text-black">৳ {orders?.totalPrice}</span>
                                            </td>

                                     
                                            <td className="px-2.5 py-4 text-right text-sm">
                                                <button className="w-full bg-black text-white px-4 py-2" onClick={()=>{handleView(orders?._id)}}>VIEW</button>
                                            </td>
                                        </tr>
                                    ))

                                }


                            </tbody>

   
                        </table>
                    </div>


                    <div className="table_container_small_screen lg:hidden">
                        <div className="items pb-4 mb-2.5 border-b border-gray-300">
                            <div className="flex justify-between w-full pb-2 mb-2">
                                <div className="header_text ">
                                    <p className=" text-left text-gray-900 text-sm font-regular">Order</p>

                                </div>
                                <div className="item_value">
                                    <p className=" text-left text-gray-900 text-sm font-regular">#15185</p>
                                </div>
                            </div>

                            <div className="flex justify-between w-full pb-2 mb-2">
                                <div className="header_text">
                                    <p className="  text-left text-gray-900 text-sm font-regular">Date</p>

                                </div>
                                <div className="item_value">
                                    <p className="  text-left  text-sm font-regular text-gray-500">July 13, 2024</p>
                                </div>
                            </div>

                            <div className="flex justify-between w-full pb-2 mb-2">
                                <div className="header_text">
                                    <p className="  text-left text-gray-900 text-sm font-regular">Status</p>

                                </div>
                                <div className="item_value">
                                    <p className="  text-left  text-sm font-regular text-gray-500">Processing</p>
                                </div>
                            </div>

                            <div className="flex justify-between w-full pb-2 mb-2">
                                <div className="header_text">
                                    <p className="  text-left text-gray-900 text-sm font-regular">Total</p>

                                </div>
                                <div className="item_value">
                                    <p className="  text-left  text-sm font-regular text-gray-500"> <span className="text-black">৳ 4,000.00</span>  for 1 item</p>
                                </div>
                            </div>

                            <div className="button mb-2.5">
                                <button className="w-full bg-black text-white py-2">VIEW</button>
                            </div>

                        </div>

                    </div>
                </div>
               
            ):(
                isLoading? null :
                <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
                <div className="flex justify-center items-center h-96">
                    <p className="text-lg text-gray-500">No Orders Found</p>
                </div>
            </div>

            )
            }
        </>
    )
}
