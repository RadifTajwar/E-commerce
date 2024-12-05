
import Image from 'next/image';
import Link from 'next/link';
export default function page() {

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
              <form>
                <label className="block text-sm text-gray-700 dark:text-gray-400 font-medium">Email</label>
                <input
                  className="block w-full px-3 py-1 mt-2 mb-4 text-sm leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                  type="email"
                  name="email"
                  placeholder="john@doe.com"
                  defaultValue="admin@gmail.com"
                />

                <label className="block text-sm text-gray-700 dark:text-gray-400 font-medium">Password</label>
                <input
                  className="block w-full px-3 py-1 mt-2 mb-4 text-sm leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                  type="password"
                  name="password"
                  placeholder="***************"
                  defaultValue="12345678"
                />

                <button
                  className="inline-flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-purple-300 active:bg-blue-600 cursor-pointer"
                  type="submit"
                >
                  Login
                </button>

                <hr className="my-10" />

                <button
                  disabled
                  className="inline-flex items-center justify-center w-full px-4 py-2 my-2 text-sm font-semibold text-gray-700 transition-colors duration-300 bg-gray-100 rounded-md shadow-sm hover:text-white hover:bg-blue-600 h-11 cursor-pointer" 
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.5 3h2.5v-3h-2.5c-1.93 0-3.5 1.57-3.5 3.5v1.5h-2v3h2v8h3v-8h2.5l0.5-3h-3v-1.5c0-0.271 0.229-0.5 0.5-0.5z"></path>
                  </svg>
                  <span className="ml-2">Login With Facebook</span>
                </button>

                <button
                  disabled
                  className="inline-flex items-center justify-center w-full px-4 py-2 my-2 text-sm font-semibold text-gray-700 transition-colors duration-300 bg-gray-100 rounded-md shadow-sm hover:text-white hover:bg-red-500 h-11 cursor-pointer"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.159 6.856v2.744h4.537c-0.184 1.178-1.372 3.45-4.537 3.45-2.731 0-4.959-2.262-4.959-5.050s2.228-5.050 4.959-5.050c1.553 0 2.594 0.663 3.188 1.234l2.172-2.091c-1.394-1.306-3.2-2.094-5.359-2.094-4.422 0-8 3.578-8 8s3.578 8 8 8c4.616 0 7.681-3.247 7.681-7.816 0-0.525-0.056-0.925-0.125-1.325l-7.556-0.003z"></path>
                  </svg>
                  <span className="ml-2">Login With Google</span>
                </button>
              </form>

              <p className="mt-4">
                <Link href="/forgot-password">
                  <button className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
                    Forgot your password?
                  </button>
                </Link>
              </p>
              <p className="mt-1">
                <Link href="/signup">
                  <button className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
                    Create account
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
}
