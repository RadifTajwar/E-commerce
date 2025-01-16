'use client';
import { loginUser } from "@/redux/user/userLoginSlice";
import localStorageUtil from "@/utils/localStorageUtil";
import { jwtDecode } from "jwt-decode";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function page() {
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
      const result = await dispatch(loginUser({ email: logMail, password: logPass })).unwrap();

      // Store email and accessToken in localStorage

     

      // Handle successful login if needed
      console.log('Login successful:', result);
      const decoded = jwtDecode(result.accessToken);
      if (decoded.role === 'admin' && decoded.email) {
        localStorageUtil.setItem('accessToken', result.accessToken);
        router.push('/admin/dashboard');
      }else{
        setErrorLogin("Only Admins are allowed to login.");
      }




    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      console.error('Login failed:', error.message);
      // Optionally, set an error state to display an error message in the UI
      setErrorLogin("Invalid credentials or user does not exist.");
    }
  };

  useEffect(() => {
    // Retrieve userEmail and accessToken from localStorage
    const token = localStorageUtil.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      const storedEmail = decoded.email;
      if (storedEmail && decoded.role === 'admin') {
        // Redirect to 'my-account' page if either is missing
        router.push('/admin/dashboard');
      }
    }


  }, [router]);



  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            {/* Light Mode Image */}
            <Image
              aria-hidden="true"
              className='min-w-[448px] min-h-[669px]'
              src="/login-office.jpg"

              alt="Office"
              height={448}
              width={669}
            />

          </div>

          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2  bg-white md:bg-none ">
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <form onSubmit={handleLogSubmit}>
                <label className="block text-sm text-gray-700 dark:text-gray-400 font-medium">Email</label>
                <input
                  className={`block w-full px-3 py-1 mt-2 mb-4 text-sm leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                 
                  ${errorLogin ? 'border-red-500' : 'border-gray-200'
                    }`}
                  placeholder="Enter your email"
                  required
                  onChange={onLogMailChange}

                />

                <label className="block text-sm text-gray-700 dark:text-gray-400 font-medium">Password</label>
                <input
                  className={`block w-full px-3 py-1 mt-2 mb-4 text-sm leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 bg-gray-100 dark:bg-white border-transparent focus:border-blue-500${errorLogin ? 'border-red-500' : 'border-gray-200'
                    }`}
                  required
                  onChange={onLogPassChange}
                  type="password"
                  placeholder=""
                />
                {
                  errorLogin && <p className="text-red-500 text-sm text-center">{errorLogin}</p>
                }

                <button
                  className="inline-flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-purple-300 active:bg-blue-600 cursor-pointer"
                  type="submit"
                >
                  {
                    status === 'loading' ? 'Loading...' : 'Login'
                  }

                </button>

                <hr className="my-10" />

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
}
