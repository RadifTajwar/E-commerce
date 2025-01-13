'use client'
import OrderDetails from "@/components/ui/components/viewOrder/orderDetails"
import { fetchOrderById } from "@/redux/order/getOrderByIdSlice"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
export default function page() {
    const pathname = usePathname()
    const productId = pathname.split('/').pop();
    const dispatch = useDispatch()
    const productName = pathname.split('/').pop();
    const {order,isLoading,error} = useSelector(state=>state.orderById)
    useEffect(()=>{
        if(productId){
        dispatch(fetchOrderById(productId))
        }
    },[])

    return (
        <>
        
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!isLoading && order && <OrderDetails order={order} />}
        </>
       
    )
}
