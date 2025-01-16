'use client'
import localStorageUtil from '@/utils/localStorageUtil';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
export default function Page() {
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();
 
  useEffect(() => {
    // Retrieve userEmail and accessToken from localStorage
    const token = localStorageUtil.getItem('accessToken');
    if(token){
      setAccessToken(token);
      const decoded= jwtDecode(token);
   
       if (decoded.email) {
         // Redirect to 'my-account' page if either is missing
         setUserEmail(decoded.email);
   
       } 
    }  
    
  }, [userEmail, accessToken]);

  // Render nothing if either userEmail or accessToken is missing
  if (!accessToken ) {
    return null;
  }
  const handleLogOut = () => {
    localStorageUtil.removeItem('userEmail');
   
    router.push('/my-account');
}
  return (
    
      
        <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
          <div className="upper_text">
            <p className="text-sm text-gray-500 mb-5">Hello <span className="font-medium text-gray-700">{userEmail}</span>  (not <span className="font-medium text-gray-700">{userEmail}</span>? <span className="text-black cursor-pointer">Log out</span>)</p>
            <p className="text-sm text-gray-500 mb-5">From your account dashboard you can view your <span className="text-black cursor-pointer">recent orders</span>, manage your <span className="text-black cursor-pointer">shipping and billing addresses</span> , and edit your  <span className="text-black cursor-pointer">password</span> and  <span className="text-black cursor-pointer">account details.</span></p>
          </div>
          <div className="lowerBoxes mt-8 grid grid-cols-1 sm:gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
            <div className="box px-2.5 mb-5 ">
              <Link href="/myAccount/orders"> <div className="inner_box  border border-gray-300 text-center rounded-md xl:px-28 xl:py-5 lg:px-16 lg:py-4 md:px-12 md:py-3 px-8 py-4 hover:bg-gray-100 cursor-pointer">
                <div className="icon_and_text flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-14"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm flex justify-center">orders</p>
              </div> </Link>
             
            </div>

            <div className="box px-2.5 mb-5 ">
            <Link href="/myAccount/editAddress">
              <div className="inner_box  border border-gray-300 text-center rounded-md xl:px-28 xl:py-5 lg:px-16 lg:py-4 md:px-12 md:py-3 px-8 py-4 hover:bg-gray-100 cursor-pointer">
                <div className="icon_and_text  w-full flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>

                <p className='text-gray-700 text-sm flex justify-center'>Addresses</p>
              </div>
              </Link>
            </div>

            <div className="box px-2.5 mb-5">
            <Link href="/myAccount/editAccount">
              <div className="inner_box  border border-gray-300 text-center rounded-md xl:px-28 xl:py-5 lg:px-16 lg:py-4 md:px-12 md:py-3 px-8 py-4 hover:bg-gray-100 cursor-pointer">
                <div className="icon_and_text  w-full flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <p className='text-gray-700 text-sm flex justify-center'>Account Details</p>
              </div>
              </Link>
            </div>

            <div className="box px-2.5 mb-5">
            <Link href="/myAccount">
              <div className="inner_box  border border-gray-300 text-center rounded-md xl:px-28 xl:py-5 lg:px-16 lg:py-4 md:px-12 md:py-3 px-8 py-4 hover:bg-gray-100 cursor-pointer">
                <div className="icon_and_text  w-full flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className=" flex justify-center" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </div>
                <p className='text-gray-700 text-sm flex  justify-center'>Wishlist</p>


              </div>
              </Link>
            </div>

            <div className="box px-2.5 mb-5">
            
              <div className="inner_box  border border-gray-300 text-center rounded-md xl:px-28 xl:py-5 lg:px-16 lg:py-4 md:px-12 md:py-3 px-8 py-4 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>
                <div className="icon_and_text  w-full flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                </div>



                <p className='text-gray-700 text-sm flex justify-center' >Logout</p>
              </div>
              
            </div>





          </div>
        </div>
    
  
  )
}
