import { loginUser } from "@/redux/user/userLoginSlice";
import localStorageUtil from "@/utils/localStorageUtil";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
export default function LoginForm({
  toggleLogInForm,
  isVisibleLogInForm,
  isLoggedIn,
  setIsLoggedIn,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logMail, setLogMail] = useState("");
  const [logPass, setLogPass] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);
  const { status } = useSelector((state) => state.loginUser);
  const onLogMailChange = (e) => {
    setErrorLogin(null);
    setLogMail(e.target.value);
  };
  const onLogPassChange = (e) => {
    setErrorLogin(null);
    setLogPass(e.target.value);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Dispatch the loginUser thunk and wait for its result
      const result = await dispatch(
        loginUser({ email: logMail, password: logPass })
      ).unwrap();

      // Store email and accessToken in localStorage

      localStorageUtil.setItem("userEmail", logMail);
      localStorageUtil.setItem("accessToken", result.accessToken);

      // Handle successful login if needed

      toggleLogInForm();
      setIsLoggedIn(true);
      setTimeout(() => {
        router.push("/myAccount");
      }, 500);
    } catch (error) {
      // Handle errors (e.g., invalid credentials)

      // Optionally, set an error state to display an error message in the UI
      setErrorLogin("Invalid credentials or user does not exist.");
    }
  };
  return (
    <>
      <section className="bg-white dark:bg-gray-900 min-h-screen max-h-screen flex items-center justify-center overflow-y-auto z-50 transition-transform duration-300 min-w-[300px] lg:min-w-[340px]">
        <div className="flex flex-col items-center h-screen justify-center px-4 py-4 mx-auto w-full sm:max-w-md lg:py-0">
          <div className="w-full bg-white h-screen rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
            <div className="p-4 space-y-4 md:space-y-6 sm:p-4">
              <div className="flex justify-between">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in
                </h1>

                <button
                  className="text-sm flex items-center leading-tight tracking-tight text-gray-900 md:text-sm dark:text-white cursor-pointer hover:text-gray-600 group"
                  onClick={toggleLogInForm}
                >
                  <span className="mr-1">
                    <svg
                      className="h-3 w-3 group-hover:fill-gray-600"
                      viewBox="0 0 24 24"
                    >
                      <path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"></path>
                    </svg>
                  </span>
                  Close
                </button>
              </div>

              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleLogSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="email"
                    name="logMail"
                    className={`bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600
                                                            ${
                                                              errorLogin
                                                                ? "border-red-500"
                                                                : "border-gray-200"
                                                            }`}
                    placeholder="Enter your email"
                    required
                    onChange={onLogMailChange}
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
                    name="logPass"
                    id="password"
                    placeholder=""
                    className={`bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 
                                                            ${
                                                              errorLogin
                                                                ? "border-red-500"
                                                                : "border-gray-200"
                                                            }`}
                    required
                    onChange={onLogPassChange}
                  />
                </div>
                {errorLogin && (
                  <p className="text-red-500 text-sm text-center">
                    {errorLogin}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-regular text-gray-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="bg-black  text-white w-full  focus:ring-none focus:outline-none focus:ring-none font-medium  text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {status === "loading" ? "Loading..." : "Sign in"}
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account yet?{" "}
                  <Link href="/my-account">
                    <button
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      onClick={toggleLogInForm}
                    >
                      Sign up
                    </button>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
