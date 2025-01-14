'use client'
import OrderDetails from "@/components/ui/components/viewOrder/orderDetails"
import { fetchOrderById } from "@/redux/order/getOrderByIdSlice"
import localStorageUtil from "@/utils/localStorageUtil"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
export default function page() {
  const router = useRouter();
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
    useEffect(() => {
        // Retrieve userEmail and accessToken from localStorage
        const storedEmail = localStorageUtil.getItem('userEmail');
       
    
        if (!storedEmail) {
          // Redirect to 'my-account' page if either is missing
          router.push('/my-account');
        } 
      }, [router]);

    return (
        <>
        
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!isLoading && order && <OrderDetails order={order} />}
        </>
       
    )
}
