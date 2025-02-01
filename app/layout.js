'use client'
import Footer from '@/components/ui/components/footer';
import LoginForm from '@/components/ui/components/loginForm';
import MyCartButton from '@/components/ui/components/navBar/myCartButton';
import NavMenu from '@/components/ui/components/navBar/navMenu';
import ShoppingCart from '@/components/ui/components/productCart/shoppingCart';
import SideBar from '@/components/ui/components/sideBar';
import store from "@/redux/store";
import localStorageUtil from '@/utils/localStorageUtil';
import { jwtDecode } from 'jwt-decode';
import { Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Provider } from "react-redux";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export default function Rootlayout({ children }) {
  const router = useRouter();
 
  
  const pathname = usePathname()
  console.log(pathname);
  const isMyAccountPage = pathname === '/my-account';
  const [isVisibleLogInForm, setIsVisibleLogInForm] = useState(false);
  const [isVisibleSideBar, setIsVisibleSideBar] = useState(false);
  const [isVisibleShoppingCart, setIsVisibleShoppingCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const accessToken = localStorageUtil.getItem("accessToken");
    if(accessToken){
        const email = jwtDecode(accessToken);
        if (email?.email) {
            setIsLoggedIn(true);
        }
      }
  }, []);
  const handleShoppingCartClicked = () => {
    toggleShoppingCart();
  }
 
  const handleAccountClicked = () => {
    if (isMyAccountPage) {
      // Reload the page if on /my-account
      window.location.reload();
    } else {

      if(isLoggedIn){
        router.push('/my-account');
      }else{
      toggleLogInForm();
      }
    }
  };

 

  const toggleLogInForm = () => {
    
    const email= localStorageUtil.getItem('userEmail');

    
    setIsVisibleLogInForm(!isVisibleLogInForm);
    
  };

  const toggleSideBar = () => {
    console.log("clicked on account")
    setIsVisibleSideBar(!isVisibleSideBar);
  };
  const toggleShoppingCart = () => {
    console.log("clicked on shopping cart")
    setIsVisibleShoppingCart(!isVisibleShoppingCart);
  };
  
 

  return (
    <Provider store={store}>
      <html lang="en">
        <body className={inter.className}>
          <>
            {
              pathname.startsWith('/admin') ? (

                <>

                </>
              ) : (

                <>
                  <nav className="bg-white dark:bg-gray-800 antialiased sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-2">

                      {/* Overlay */}
                      {isVisibleLogInForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleLogInForm} />
                      )}

                      {/* Overlay */}
                      {isVisibleSideBar && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSideBar} />
                      )}

                      {/* Overlay */}
                      {isVisibleShoppingCart && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleShoppingCart} />
                      )}
                      {/* Log in form  */}

                      <div
                        className={`loginForm fixed z-50 transition-all duration-300 ${isVisibleLogInForm ? 'top-0 right-0 ' : 'top-0 -right-full'
                          }`}>
                        <LoginForm toggleLogInForm={toggleLogInForm} isVisibleLogInForm={isVisibleLogInForm} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                      </div>


                      <div
                        className={`sideBarForm fixed z-50 transition-all duration-300 ${isVisibleSideBar ? 'top-0 left-0 bottom-0' : 'top-0 -left-full'
                          }`}>
                        <SideBar toggleSideBar={toggleSideBar} isVisibleSideBar={isVisibleSideBar} toggleLogInForm={toggleLogInForm} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
                      </div>

                      {/* Shopping cart  */}
                      <div
                        className={`shoppingCart fixed z-50 transition-all duration-300 ${isVisibleShoppingCart ? 'top-0 right-0 ' : 'top-0 -right-full'
                          }`}>

                        <ShoppingCart toggleShoppingCart={toggleShoppingCart} isVisibleShoppingCart={isVisibleShoppingCart} />

                      </div>


                      {/* <!-- drawer component --> */}
                      <div id="drawer-navigation" className="fixed top-0 left-0 z-30 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800" tabIndex="-1" aria-labelledby="drawer-navigation-label">
                        <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
                        <button type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                          <span className="sr-only">Close menu</span>
                        </button>
                        <div className="py-4 overflow-y-auto">
                          <ul className="space-y-2 font-medium">
                            <li className="group relative flex justify-center">
                              <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '1rem' }}>
                                WALLET
                                <svg
                                  className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </a>
                              <span
                                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                              ></span>
                            </li>
                            <li className="group relative flex justify-center">
                              <div >
                                <button type='button' className="flex justify-center py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '1rem' }} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                  BAG
                                  <svg
                                    className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>

                                  <span
                                    className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                                  ></span>
                                </button>


                                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                  <li>
                                    <a className="text-slate-800 hover:bg-slate-50 flex items-center p-2" href="#" style={{ fontSize: '.9rem' }}>
                                      <span className="whitespace-nowrap">Priority Ratings</span>
                                    </a>
                                  </li>
                                  <li>
                                    <a className="text-slate-800 hover:bg-slate-50 flex items-center p-2" href="#" style={{ fontSize: '.9rem' }}>
                                      <span className="whitespace-nowrap">Priority Ratings</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </li>
                            <li className="group relative flex justify-center">
                              <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '1rem' }}>
                                CONTACT US

                              </a>
                              <span
                                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                              ></span>
                            </li>
                            <li className="group relative flex justify-center">
                              <a href="#" title="" className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500" style={{ fontSize: '1rem' }}>
                                ABOUT US

                              </a>
                              <span
                                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.67)' }}
                              ></span>
                            </li>



                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">

                        {/* Dropdown Hamburger menu  */}
                        <div className="dropdownButton lg:hidden p-2 flex items-center justify-center">
                          <button type="button" className="group inline-flex lg:hidden items-center justify-center  rounded-md   text-gray-900 dark:text-white hover:text-gray-500 transition-all duration-200" onClick={toggleSideBar}>
                            
                            <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M5 7h14M5 12h14M5 17h14" />

                            </svg>
                            <span className="text-sm font-medium  dark:text-white">
                               MENU
                            </span>

                          </button>
                        </div>

                        {/* logo and other menu  */}
                        <div className="flex items-center space-x-8">


                          <div className="shrink-0">
                            <Link href="/" title="" className="">

                              <h1 className="text-4xl font-bold">Tithi</h1>
                            </Link>
                          </div>
                          <div className="hidden divider h-[35px] md:h-[50px] bg-black" style={{ width: '1px' }}>
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
                            className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
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
                            <svg
                              className="w-4 h-4 text-gray-900 dark:text-white ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 9-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* <div id="userDropdown1" className="hidden z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700">
                          <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My Account </a></li>
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My Orders </a></li>
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Settings </a></li>
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Favourites </a></li>
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Delivery Addresses </a></li>
                            <li><a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Billing Data </a></li>
                          </ul>

                          <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                            <a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Sign Out </a>
                          </div>
                        </div> */}




                        </div>


                      </div>


                    </div>

                  </nav>
                </>
              )
            }

          </>

          {children}
          {
            pathname.startsWith('/admin') ? (
              <>
              </>
            ) : (
              <>
                <footer>
                  < Footer />
                </footer>
              </>
            )
          }



        </body>




      </html>
    </Provider>
  );
}
