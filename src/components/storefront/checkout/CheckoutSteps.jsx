"use client";

import EastIcon from "@mui/icons-material/East";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/constants";

const active = "block border-b-2 border-gray-900 text-lg text-gray-900 font-semibold";
const inactive = "hidden md:block text-lg text-gray-500 font-semibold";
const base = "cursor-pointer hover:text-gray-900 transition-colors duration-300";

/**
 * The cart → checkout → order complete stepper. This is the only part of the
 * checkout layout that needs the current path, so it is the layout's one
 * client island.
 */
export default function CheckoutSteps() {
  const pathname = usePathname();
  const isOrderComplete = pathname.startsWith("/checkout/orderReceived/");

  return (
    <div className="header mb-10 mt-5">
      <div className="flex space-x-5 justify-center">
        <div className={`${base} shopping_cart ${pathname === ROUTES.cart ? active : inactive}`}>
          <Link href={ROUTES.cart}>
            <p className="">SHOPPING CART</p>
          </Link>
        </div>
        <div className="arrow hidden md:block">
          <EastIcon />
        </div>
        <div className={`${base} checkout ${pathname === ROUTES.checkout ? active : inactive}`}>
          <Link href={ROUTES.checkout}>
            <p className="">CHECKOUT</p>
          </Link>
        </div>
        <div className="arrow hidden md:block">
          <EastIcon />
        </div>
        <div className={`${base} order_complete ${isOrderComplete ? active : inactive}`}>
          <p className="">ORDER COMPLETE</p>
        </div>
      </div>
    </div>
  );
}
