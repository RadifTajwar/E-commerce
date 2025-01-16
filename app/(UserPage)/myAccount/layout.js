'use client'
import localStorageUtil from '@/utils/localStorageUtil';
import { jwtDecode } from 'jwt-decode';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function  Layout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const sideBarComponentClicked = (route) => {
        console.log('SideBar Component Clicked');
        if(route === 'myAccount') router.push(`/${route}`);
        else 
        router.push(`/myAccount/${route}`);

    }
    useEffect(() => {
        // Retrieve userEmail from localStorage
        const token = localStorageUtil.getItem('accessToken');
        if(token){
            const decoded = jwtDecode(token);
            const storedEmail = decoded.email;
            if(!storedEmail){
                // Redirect to 'my-account' page if userEmail is missing
                router.push('/my-account');
            }
        }
        else{
            router.push('/my-account');
        }
       
    }
    ,[pathname]);

    const handleLogOut = () => {
        localStorageUtil.removeItem('accessToken');
       
        router.push('/my-account');
    }

    return (
        <div className="max-w-7xl my-10 mx-auto">
            <div className="myAccount_text   text-center my-10 ">
                <p className=" text-6xl font-medium text-gray-700"> My Account</p>
            </div>
            <div className="account_section w-full md:flex justify-center">
                <div className="left w-full md:w-1/3 lg:w-1/4 px-8 py-2.5 border-e border-gray-300">
                    <div className="myAccount_text">
                        <p className="mb-4 ps-4 pe-2.5 pb-2.5  border-b border-gray-300 text-md text-gray-800">My Account</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => { sideBarComponentClicked('myAccount') }}>Dashboard</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"onClick={() => { sideBarComponentClicked('orders') }}>Orders</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"onClick={() => { sideBarComponentClicked('editAddress') }}>Addresses</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"onClick={() => { sideBarComponentClicked('editAccount') }}>Account Details</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer">Wishlist</p>
                        <p className="px-4  py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleLogOut}>Logout</p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

