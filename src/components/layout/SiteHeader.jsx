"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DrawerOverlay from "@/components/storefront/nav/DrawerOverlay";
import LoginForm from "@/components/ui/components/loginForm";
import MyCartButton from "@/components/ui/components/navBar/myCartButton";
import NavMenu from "@/components/ui/components/navBar/navMenu";
import ShoppingCart from "@/components/ui/components/productCart/shoppingCart";
import SideBar from "@/components/ui/components/sideBar";
import { ChevronDownIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { useSession } from "@/hooks/useSession";

/**
 * Storefront header: navigation bar plus the login, sidebar and cart drawers.
 * Extracted from the old client root layout so the root layout can be a
 * Server Component. Also hosts the single storefront <ToastContainer />.
 */
export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isMyAccountPage = pathname === ROUTES.login;
  const { isLoggedIn } = useSession();
  const [isVisibleLogInForm, setIsVisibleLogInForm] = useState(false);
  const [isVisibleSideBar, setIsVisibleSideBar] = useState(false);
  const [isVisibleShoppingCart, setIsVisibleShoppingCart] = useState(false);

  const toggleLogInForm = () => setIsVisibleLogInForm((visible) => !visible);
  const toggleSideBar = () => setIsVisibleSideBar((visible) => !visible);
  const toggleShoppingCart = () => setIsVisibleShoppingCart((visible) => !visible);

  const handleShoppingCartClicked = () => {
    toggleShoppingCart();
  };

  const handleAccountClicked = () => {
    if (isMyAccountPage) {
      // Reload the page if on /my-account
      window.location.reload();
    } else if (isLoggedIn) {
      router.push(ROUTES.login);
    } else {
      toggleLogInForm();
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 antialiased sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-2">
          <DrawerOverlay open={isVisibleLogInForm} onClick={toggleLogInForm} />
          <DrawerOverlay open={isVisibleSideBar} onClick={toggleSideBar} />
          <DrawerOverlay open={isVisibleShoppingCart} onClick={toggleShoppingCart} />

          {/* Log in form  */}
          <div
            className={`loginForm fixed z-50 transition-all duration-300 ${
              isVisibleLogInForm ? "top-0 right-0 " : "top-0 -right-full"
            }`}
          >
            <LoginForm toggleLogInForm={toggleLogInForm} />
          </div>

          <div
            className={`sideBarForm fixed z-50 transition-all duration-300 ${
              isVisibleSideBar ? "top-0 left-0 bottom-0" : "top-0 -left-full"
            }`}
          >
            <SideBar
              toggleSideBar={toggleSideBar}
              isVisibleSideBar={isVisibleSideBar}
              toggleLogInForm={toggleLogInForm}
            />
          </div>

          {/* Shopping cart  */}
          <div
            className={`shoppingCart fixed z-50 transition-all duration-300 ${
              isVisibleShoppingCart ? "top-0 right-0 " : "top-0 -right-full"
            }`}
          >
            <ShoppingCart
              toggleShoppingCart={toggleShoppingCart}
              isVisibleShoppingCart={isVisibleShoppingCart}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Dropdown Hamburger menu  */}
            <div className="dropdownButton lg:hidden p-2 flex items-center justify-center">
              <button
                type="button"
                className="group inline-flex lg:hidden items-center justify-center  rounded-md   text-gray-900 dark:text-white hover:text-gray-500 transition-all duration-200"
                onClick={toggleSideBar}
              >
                <svg
                  className="w-7 h-7"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M5 7h14M5 12h14M5 17h14" />
                </svg>
                <span className="text-sm font-medium  dark:text-white">MENU</span>
              </button>
            </div>

            {/* logo and other menu  */}
            <div className="flex items-center space-x-8">
              <div className="shrink-0">
                <Link href={ROUTES.home} title="" className="">
                  <h1 className="text-4xl font-bold">Tithi</h1>
                </Link>
              </div>
              <div className="hidden divider h-[35px] md:h-[50px] bg-black" style={{ width: "1px" }}>
                {/* Divider */}
              </div>
              {/* NavMenu  */}

              <NavMenu />
            </div>
            {/* Cart and account menu  */}
            <div className="flex items-center lg:space-x-2">
              <MyCartButton handleShoppingCartClicked={handleShoppingCartClicked} />

              <button
                id="userDropdownButton1"
                type="button"
                className="items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white hidden lg:flex"
                onClick={handleAccountClicked}
              >
                <svg
                  className="w-5 h-5 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Account
                <ChevronDownIcon className="w-4 h-4 text-gray-900 dark:text-white ms-1" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer />
    </>
  );
}
