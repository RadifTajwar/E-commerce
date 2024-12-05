'use client'

import Footer from "@/components/ui/components/footer";
import { useState } from "react";
export default function page() {
    const [isChecked, setIsChecked] = useState(false)
    const [registerToLoginToggleState, setRegisterToLoginToggleState] = useState(false)
    const toggleChecked = () => {
        setIsChecked(!isChecked);
    }
    const RegisterToLoginToggle = () => {
        setRegisterToLoginToggleState(!registerToLoginToggleState);
    }
    return (
        <>
            <div className="my_account entire_section bg-gray-50 dark:bg-gray-900">
                <div className=" pb-10 max-w-6xl mx-auto">

                    <div className="upper_div flex mx-auto flex justify-center  mx-auto bg-gray-50 dark:bg-gray-900">
                        <div className="text text-center my-8">
                            <h1 className="text-4xl font-bold ">
                                <span style={{ color: '#E8A811' }}>My </span> Account
                            </h1>
                            <p className=" text-sm  decoration-gray-800  my-3">
                                <span className="hover:opacity-60 transition-opacity duration-300 cursor-pointer">Home</span>  / My Account
                            </p>
                        </div>
                    </div>
                    <div className="lower_div md:flex md:justify-between max gap-0 ">

                        {
                            registerToLoginToggleState ? (
                                <>
                                    <div className="lower_left md:w-1/2 flex flex-col items-center justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
                                        <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                            <div className=" space-y-4 md:space-y-6 ">
                                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                                    Login
                                                </h1>
                                                <form className="space-y-4 md:space-y-6" action="#">
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Username or email address <span className="text-red-700">*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                                                            placeholder=""
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="password"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Password <span className="text-red-700">*</span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            placeholder=""
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                                                            required
                                                        />


                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input
                                                                    id="remember"
                                                                    aria-describedby="remember"
                                                                    type="checkbox"
                                                                    className="w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                                                                    required
                                                                    checked={isChecked}
                                                                    onChange={toggleChecked}
                                                                />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label
                                                                    htmlFor="remember"
                                                                    className="text-gray-900 dark:text-gray-300 cursor-pointer"
                                                                    onClick={toggleChecked}
                                                                >
                                                                    Remember me

                                                                </label>
                                                            </div>

                                                        </div>
                                                        <a
                                                            href="#"
                                                            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                                        >
                                                            Forgot password?
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                    >
                                                        Sign in
                                                    </button>

                                                </form>
                                            </div>
                                        </div>


                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="lower_left md:w-1/2 flex flex-col items-center justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
                                        <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                            <div className=" space-y-4 md:space-y-6 ">
                                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                                    Register
                                                </h1>
                                                <form className="space-y-4 md:space-y-6" action="#">
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Email address <span className="text-red-700">*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
                                                            placeholder=""
                                                            required
                                                        />
                                                    </div>

                                                    <p className="text-[13px] text-gray-500 my-[20px]">A link to set a new password will be sent to your email address.</p>
                                                    <p className="text-[13px]  text-gray-500 my-[20px]">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="text-black">privacy policy.</span></p>

                                                    <button
                                                        type="submit"
                                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                    >
                                                        Register
                                                    </button>

                                                </form>
                                            </div>
                                        </div>


                                    </div>
                                </>
                            )
                        }

                        <div className="lower_middle_line_split hidden md:block w-px bg-gray-200 mx-4"></div>

                        <div className="flex items-center justify-center w-full px-5 my-10 md:hidden">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="px-4 text-gray-900">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>
                        <div className="lower_right md:w-1/2 flex justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
                            <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className=" space-y-4 md:space-y-6 ">
                                    <div className="lower_right_text">
                                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            Login
                                        </h1>
                                        <p className="text-[13px] text-center text-gray-500 my-[20px]">Registering for this site allows you to access your order status and history. Just fill in the fields below, and we'll get a new account set up for you in no time. We will only ask you for information necessary to make the purchase process faster and easier.</p>
                                    </div>
                                    <div className="lower_right_button text-center">
                                        <button className="inline-flex items-center rounded-full justify-center py-3 px-5 hover:bg-gray-100 dark:hover:bg-gray-700 text-md font-medium leading-none text-gray-900 dark:text-white" onClick={RegisterToLoginToggle}>
                                            <span>Register</span>
                                        </button>
                                    </div>

                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>

            <Footer />

        </>
    )
}
