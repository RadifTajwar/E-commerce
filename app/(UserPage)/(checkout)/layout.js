'use client'
import EastIcon from '@mui/icons-material/East';
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Layout({ children }) {
    const pathname = usePathname();

    return (
        <div>
            <header>
                <div className="header mb-10 mt-5">
                    <div className="flex space-x-5 justify-center">
                        <div className={`  cursor-pointer hover:text-gray-900 transition-colors duration-300 shopping_cart ${pathname === '/cart' ? 'block border-b-2 border-gray-900 text-lg text-gray-900 font-semibold' : 'hidden md:block text-lg text-gray-500 font-semibold'}`}>
                            <Link href="/cart">
                                <p className="">SHOPPING CART</p>
                            </Link>
                        </div>
                        <div className="arrow hidden md:block">
                            <EastIcon className=' ' />
                        </div>
                        <div className={`cursor-pointer hover:text-gray-900 transition-colors duration-300 checkout ${pathname === '/checkout' ? 'block border-b-2 border-gray-900 text-lg text-gray-900 font-semibold' : 'hidden md:block  text-lg text-gray-500 font-semibold'}`}>
                            <Link href="/checkout">
                                <p className="">CHECKOUT</p>
                            </Link>
                        </div>
                        <div className="arrow hidden md:block">
                            <EastIcon className=' ' />
                        </div>

                        <div className={`cursor-pointer hover:text-gray-900 transition-colors duration-300  order_complete ${pathname === '/order-complete' ? ' block border-b-2 border-gray-900 text-lg text-gray-900 font-semibold' : 'hidden md:block text-lg text-gray-500 font-semibold'}`}>
                            <Link href="/order-complete">
                                <p className="">ORDER COMPLETE</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}
