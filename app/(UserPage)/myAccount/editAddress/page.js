'use client'
import localStorageUtil from "@/utils/localStorageUtil";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
    const router = useRouter();
    useEffect(() => {
        // Retrieve userEmail and accessToken from localStorage
        const storedEmail = localStorageUtil.getItem('userEmail');
       
    
        if (!storedEmail) {
          // Redirect to 'my-account' page if either is missing
          router.push('/my-account');
        } 
      }, [router]);
    return (
        <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
            <div className="upper_text">
                <p className='text-gray-500 text-sm mb-5'>The following addresses will be used on the checkout page by default.</p>
            </div>
            <div className="text mb-5 ">
               <Link href="/myAccount/editAddress/billing"> <p className="text-2xl txt-black">BILLING ADDRESS <span className="text-xs cursor-pointer font-medium">Edit</span></p> </Link> 

            </div>
            <div className="details mb-5 text-sm space-y-2">
                <p className="text-gray-700">Radif</p>
                <p className="text-gray-700">40, Rasulpur, Dania, Dhaka-1236</p>
                <p className="text-gray-700">Chattogram </p>
                <p className="text-gray-700">+8801521750111</p>
                <p className="text-gray-700">radiftajwarmahi420@gmail.com</p>

            </div>
        </div>
    )
}
