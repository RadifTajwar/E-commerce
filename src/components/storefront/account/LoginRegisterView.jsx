"use client";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { useSession } from "@/hooks/useSession";
import { createUser, loginUser } from "@/store/slices/auth.slice";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LoginRegisterView() {
  const { isLoggedIn } = useSession();
  const { status } = useSelector((state) => state.createUser);
  const { status: loginStatus } = useSelector((state) => state.loginUser);
  const [errorLogin, setErrorLogin] = useState(null);
  const [errorSignUp, seterrorSignUp] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logMail, setLogMail] = useState("");
  const [logPass, setLogPass] = useState("");
  const onLogMailChange = (e) => {
    setErrorLogin(null);
    setLogMail(e.target.value);
  };
  const onLogPassChange = (e) => {
    setErrorLogin(null);
    setLogPass(e.target.value);
  };

  // /my-account is the sign-in screen, so open on the login form. Visitors who
  // want an account take the "Create an account" panel beside it.
  const [registerToLoginToggleState, setRegisterToLoginToggleState] =
    useState(true);
  const RegisterToLoginToggle = () => {
    setRegisterToLoginToggleState(!registerToLoginToggleState);
  };

  const handleChange = (e) => {
    seterrorSignUp(null);
    setEmail(e.target.value);
  };
  useEffect(() => {
    // Already signed in: go to the account dashboard.
    if (isLoggedIn) router.replace(ROUTES.account);
  }, [router, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword.length < 6) {
      seterrorSignUp("Password must be at least 6 characters.");
      return;
    }
    if (registerPassword !== confirmPassword) {
      seterrorSignUp("The two passwords do not match.");
      return;
    }
    try {
      const name = email.split("@")[0]; // Get the part before '@'
      await dispatch(createUser({ name, email, password: registerPassword })).unwrap();
      // Sign in straight away: the account works before it is verified, the
      // verification prompt just follows the user around until they confirm.
      await dispatch(loginUser({ email, password: registerPassword })).unwrap();
      router.push(ROUTES.verifyEmail);
    } catch (error) {
      seterrorSignUp(error?.message || "User already exists.");
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Dispatch the loginUser thunk and wait for its result
      const result = await dispatch(
        loginUser({ email: logMail, password: logPass })
      ).unwrap();

      if (result.session) router.push("/myAccount");
    } catch (error) {
      // Handle errors (e.g., invalid credentials)

      // Optionally, set an error state to display an error message in the UI
      setErrorLogin("Invalid credentials or user does not exist.");
    }
  };

  return (
    <>
      <div className="my_account entire_section bg-gray-50 dark:bg-gray-900">
        <div className=" pb-10 max-w-6xl mx-auto">
          <div className="upper_div flex mx-auto flex justify-center  mx-auto bg-gray-50 dark:bg-gray-900">
            <div className="text text-center my-8">
              <h1 className="text-4xl font-bold ">
                <span style={{ color: "#E8A811" }}>My </span> Account
              </h1>
              <p className=" text-sm  decoration-gray-800  my-3">
                <span className="hover:opacity-60 transition-opacity duration-300 cursor-pointer">
                  Home
                </span>{" "}
                / My Account
              </p>
            </div>
          </div>
          <div className="lower_div md:flex md:justify-between max gap-0 ">
            {registerToLoginToggleState ? (
              <>
                <div className="lower_left md:w-1/2 flex flex-col items-center justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
                  {errorLogin && (
                    <div className="coupon_section px-4 w-auto">
                      <div className="flex items-center justify-start bg-red-500 p-2 rounded">
                        <div className="icon mr-2">
                          <ErrorOutlineIcon className="text-white" />
                        </div>
                        <div className="texts">
                          <div className="text-white text-sm">{errorLogin}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className=" space-y-4 md:space-y-6 ">
                      <h1 className="text-xl  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        LOGIN
                      </h1>
                      <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleLogSubmit}
                      >
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Username or email address{" "}
                            <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="email"
                            name="logMail"
                            id="email"
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="remember"
                                aria-describedby="remember"
                                type="checkbox"
                                className="w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-0 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="remember"
                                className="text-gray-900 dark:text-gray-300 cursor-pointer"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <Link href={ROUTES.forgotPassword}
                            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Forgot password?
                  </Link>
                        </div>
                        <button
                          type="submit"
                          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          {loginStatus === "loading" ? "LOADING..." : "SIGN IN"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="lower_left md:w-1/2 flex flex-col items-center justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
                  {errorSignUp && (
                    <div className="coupon_section px-4 w-auto">
                      <div className="flex items-center justify-start bg-red-500 p-2 rounded">
                        <div className="icon mr-2">
                          <ErrorOutlineIcon className="text-white" />
                        </div>
                        <div className="texts">
                          <div className="text-white text-sm">
                            {errorSignUp}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className=" space-y-4 md:space-y-6 ">
                      <h1 className="text-xl  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        REGISTER
                      </h1>
                      <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit}
                      >
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Email address{" "}
                            <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className={`bg-gray-50 border border-gray-300 text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600
                                                            ${
                                                              errorSignUp
                                                                ? "border-red-500"
                                                                : "border-gray-200"
                                                            }`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="register-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Password <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="register-password"
                            autoComplete="new-password"
                            minLength={6}
                            className={`bg-gray-50 border text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 ${
                              errorSignUp ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Choose a password (min. 6 characters)"
                            value={registerPassword}
                            onChange={(e) => {
                              seterrorSignUp(null);
                              setRegisterPassword(e.target.value);
                            }}
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="register-confirm-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Confirm password <span className="text-red-700">*</span>
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="register-confirm-password"
                            autoComplete="new-password"
                            minLength={6}
                            className={`bg-gray-50 border text-gray-900 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600 ${
                              confirmPassword && confirmPassword !== registerPassword
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Type the password again"
                            value={confirmPassword}
                            onChange={(e) => {
                              seterrorSignUp(null);
                              setConfirmPassword(e.target.value);
                            }}
                            required
                          />
                          {confirmPassword && confirmPassword !== registerPassword && (
                            <p className="mt-1 text-[13px] text-red-600">
                              The two passwords do not match.
                            </p>
                          )}
                        </div>

                        <p className="text-[13px] text-gray-500">
                          We&apos;ll email a 6-digit code to confirm your address.
                          Your password is never sent by email.
                        </p>
                        <p className="text-[13px]  text-gray-500 my-[20px]">
                          Your personal data will be used to support your
                          experience throughout this website, to manage access
                          to your account, and for other purposes described in
                          our{" "}
                          <span className="text-black">privacy policy.</span>
                        </p>

                        <button
                          type="submit"
                          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          {status === "loading" ? "LOADING..." : "REGISTER"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="lower_middle_line_split hidden md:block w-px bg-gray-200 mx-4"></div>

            <div className="flex items-center justify-center w-full px-5 my-10 md:hidden">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-gray-900">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="lower_right md:w-1/2 flex justify-center px-5  mx-auto overflow-y-auto lg:py-0 bg-gray-50 dark:bg-gray-900">
              <div className=" w-full dark:border md:mt-0 md:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className=" space-y-4 md:space-y-6 ">
                  {/* Always the opposite of whatever the left column shows.
                      This panel used to be hardcoded to REGISTER, so in
                      register mode the page said REGISTER twice. */}
                  <div className="lower_right_text">
                    <h1 className="text-xl text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      {registerToLoginToggleState ? "NEW HERE?" : "ALREADY HAVE AN ACCOUNT?"}
                    </h1>
                    <p className="text-[13px] text-center text-gray-500 my-[20px]">
                      {registerToLoginToggleState
                        ? "Registering lets you track your order status and history. We only ask for what is needed to make checkout faster next time."
                        : "Sign in to see your orders, saved addresses and account details."}
                    </p>
                  </div>
                  <div className="lower_right_button text-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-gray-900 py-3 px-6 text-sm font-medium leading-none text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                      onClick={RegisterToLoginToggle}
                    >
                      {registerToLoginToggleState ? "Create an account" : "Sign in instead"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
