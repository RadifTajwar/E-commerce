import { useState } from "react";
export default function updateProducts({ toggleVisibility }) {

    const [images, setImages] = useState([
        {
            id: 1,
            src: "https://res.cloudinary.com/ecommerce1999/image/upload/v1730908875/product/WhatsAp.jpg",
            isDefault: true,
        },
        {
            id: 2,
            src: "https://res.cloudinary.com/ecommerce1999/image/upload/v1730908876/product/WhatsAppImage2024-11-02at17.26.41_7ed6f727.jpg",
            isDefault: false,
        },
    ]);
    const [quantity, setQuantity] = useState(0);

    const handleChange = (e) => {
        setQuantity(e.target.value);
    };
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file, index) => ({
            id: images.length + index + 1,
            src: URL.createObjectURL(file),
            isDefault: false,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (id) => {
        setImages((prev) => prev.filter((image) => image.id !== id));
    };

    return (
        <>

            <div className="drawer-content">
                <button className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center" onClick={toggleVisibility}>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="mx-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18">
                        </line>
                        <line x1="6" y1="6" x2="18" y2="18">
                        </line>
                    </svg>
                </button>
                <div className="flex flex-col w-full h-screen justify-between">
                    <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 min-h-0">
                        <div className="flex md:flex-row flex-col justify-between mr-20">
                            <div>
                                <h4 className="text-xl font-medium dark:text-gray-300">Update Customer</h4>
                                <p className="mb-0 text-sm font-normal dark:text-gray-300">Update your Customer necessary information from here</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative  dark:bg-gray-700 dark:text-gray-200  overflow-hidden h-full  bg-white" >
                        <div className="absolute inset-0  mr-0 mb-0 w-full" >
                            <form className="w-full">
                                <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen pb-64 sm:pb-48">
                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 flex items-center">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-normal text-sm">
                                            Product Title/Name
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <input
                                                className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value=""
                                            />
                                        </div>
                                    </div>


                                    {/* Product Description */}
                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                            Product Description
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <textarea
                                                className="block w-full text-sm dark:text-gray-300 rounded-md focus:outline-none form-textarea focus:border-purple-400 border-gray-300 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-300 focus:ring focus:ring-purple-300 border text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                                                name="description"
                                                placeholder="Product Description"
                                                rows="4"
                                                spellCheck="false"
                                            ></textarea>
                                        </div>
                                    </div>




                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label
                                            htmlFor="product-images"
                                            className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                                        >
                                            Product Images
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="w-full text-center mb-4">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                                >
                                                    <input
                                                        id="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageUpload}
                                                        style={{ display: "none" }}
                                                    />
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="none"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-3xl text-blue-500 mb-2"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <polyline points="16 16 12 12 8 16"></polyline>
                                                        <line x1="12" y1="12" x2="12" y2="21"></line>
                                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                                        <polyline points="16 16 12 12 8 16"></polyline>
                                                    </svg>
                                                    <p className="text-sm">Drag your images here</p>
                                                    <em className="text-xs text-gray-400">
                                                        (Only *.jpeg, *.webp and *.png images will be accepted)
                                                    </em>
                                                </label>
                                            </div>
                                            <aside className="flex flex-row flex-wrap mt-4">
                                                {images.map((image) => (
                                                    <div
                                                        key={image.id}
                                                        draggable
                                                        className="relative inline-flex items-center"
                                                    >
                                                        <img
                                                            className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                            src={image.src}
                                                            alt="product"
                                                        />
                                                        {image.isDefault && (
                                                            <p className="text-xs absolute py-1 w-full bottom-0 inset-x-0 bg-blue-500 rounded-full text-white text-center">
                                                                Default Image
                                                            </p>
                                                        )}
                                                        <button
                                                            type="button"
                                                            className="absolute top-0 right-0 text-red-500 focus:outline-none"
                                                            onClick={() => handleRemoveImage(image.id)}
                                                        >
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="none"
                                                                strokeWidth="2"
                                                                viewBox="0 0 24 24"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                height="1em"
                                                                width="1em"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </aside>
                                        </div>
                                    </div>


                                    <div class="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        {/* <!-- Label for Product Barcode --> */}
                                        <label
                                            for="barcode"
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
                                        >
                                            Product Barcode
                                        </label>


                                        {/* <!-- Input Field --> */}
                                        <div class="col-span-6 sm:col-span-4">
                                            <input
                                                id="barcode"
                                                name="barcode"
                                                type="text"
                                                placeholder="Product Barcode"
                                                value=""
                                                class="block w-full px-3 py-2 text-sm leading-5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:focus:ring-gray-300 dark:focus:border-gray-500 bg-gray-100 border-gray-200"
                                            />
                                        </div>
                                    </div>




                                    <div class="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        {/* <!-- Label for Default Category --> */}
                                        <label
                                            for="default-category"
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
                                        >
                                            Category
                                        </label>


                                        {/* <!-- Multiselect Container --> */}
                                        <div class="col-span-6 sm:col-span-4">
                                            <div class="relative">
                                                {/* <!-- Selected Option Display --> */}
                                                <div
                                                    class="flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                                                    id="default-category-display"
                                                >
                                                    <span class="text-sm text-gray-700 dark:text-gray-300">Fish & Meat</span>
                                                    {/* <!-- Arrow Icon --> */}
                                                    <span class="text-gray-500 dark:text-gray-300">▼</span>
                                                </div>


                                                {/* <!-- Options List --> */}
                                                <ul
                                                    class="absolute z-10 hidden w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600"
                                                    id="default-category-options"
                                                >
                                                    <li
                                                        class="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        Home
                                                    </li>
                                                    <li
                                                        class="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        Fish & Meat
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                                            Product Price
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="flex flex-row">
                                                <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:bg-white focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600">
                                                    ₹
                                                </span>
                                                <input
                                                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none rounded-l-none"
                                                    type="text"
                                                    name="originalPrice"
                                                    placeholder="Enter Product Price"
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                                            Sell Price
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="flex flex-row">
                                                <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:bg-white focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600">
                                                    ₹
                                                </span>
                                                <input
                                                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none rounded-l-none"
                                                    type="text"
                                                    name="originalPrice"
                                                    placeholder="Enter Product Price"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                            Product Quantity
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="flex flex-row">
                                                <input
                                                    className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 bg-gray-50 mr-2 rounded w-full h-12 p-2 text-sm border border-gray-300 focus:bg-white focus:border-blue-500 focus:outline-none"
                                                    type="number"
                                                    name="stock"
                                                    placeholder="Product Quantity"
                                                    value={quantity}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="bottom_section absolute z-10 bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
                                    <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150  focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 h-12  w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700 font-normal" type="button">Cancel</button>
                                    </div>
                                    <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-normal focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12" type="submit">
                                            <span>Update Product</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>






        </>
    )
}
