'use client'
export default function settings() {
  const updateButtonClicked =(e)=>{
        e.preventDefault();
  }
  return (
    <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
      <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Settings</h1>
      <div className="container p-6 mx-auto bg-white  dark:bg-gray-800 dark:text-gray-200 rounded-lg">
        <form >
          <div className="grid grid-cols-12 font-sans">
            <div className="col-span-12 md:col-span-12 lg:col-span-12 mr-3 ">

              <div className="lg:px-6 pt-4 lg:pl-40 lg:pr-40 md:pl-5 md:pr-5 flex-grow scrollbar-hide w-full max-h-full pb-0">
                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Number of images per product</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="number" name="number_of_image_per_product" placeholder="Number of images per product" autocomplete="new-password" value="4" />
                  </div>
                </div>
                <div class="grid md:grid-cols-5 sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label class="block text-sm text-gray-600 font-semibold dark:text-gray-400 mb-1 sm:col-span-2">Receipt size (width)</label>
                  <div class="sm:col-span-3">
                    <select class="block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white focus:border-blue-500 border-transparent focus:bg-white h-12" name="receipt_size">
                      <option value="57-mm">57 mm</option><option value="80-mm">80 mm</option>
                      <option value="3-1/8">3 1/8"</option>
                      <option value="2-1/4">2 1/4"</option>
                      <option value="A4">A4</option>
                    </select>
                  </div>
                </div>
                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Company Name</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="text" name="company_name" placeholder="Company Name" autocomplete="new-password" value="" />
                  </div>
                </div>
                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Address</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="text" name="address" placeholder="Address" autocomplete="new-password" value="" />
                  </div>
                </div>

                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Post Code</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="text" name="post_code" placeholder="Post Code" autocomplete="new-password" value="" />
                  </div>
                </div>
                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Contact</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="text" name="contact" placeholder="Contact" autocomplete="new-password" value="" />
                  </div>
                </div>
                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Email</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="email" name="email" placeholder="Email" autocomplete="new-password" value="" />
                  </div>
                </div>

                <div class="grid md:grid-cols-5 items-center sm:grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 sm:col-span-2">Website</label>
                  <div class="sm:col-span-3">
                    <input class="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500" type="text" name="website" placeholder="Website" autocomplete="new-password" value="" />
                  </div>
                </div>
                <div class="flex flex-row-reverse pb-6">
                  <button class="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 h-12 px-8" type="submit" onClick={updateButtonClicked}> Update</button>
                  </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
