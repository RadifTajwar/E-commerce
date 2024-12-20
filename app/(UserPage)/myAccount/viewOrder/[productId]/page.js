
export default function page() {
    return (
        <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
            <div className="upper_text">
                <p className="text-gray-500 text-sm">Order <span className="text-black px-2 py-1.5 bg-gray-100 font-medium">#15185</span>  was placed on <span className="text-black px-2 py-1.5 bg-gray-100 font-medium">July 13, 2024</span> and is currently <span className="text-black px-2 py-1.5 bg-gray-100 font-medium">Processing</span> .</p>
            </div>
            <div className="orderDetails mt-10">
                <div className="text mb-5">
                    <p className="text-2xl txt-black">ORDER DETAILS</p>

                </div>

                <div className="productDetails mb-12">
                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items ">
                            <p className="px-2.5 py-4 font-regular ">PRODUCT</p>

                        </div>
                        <div className="total">
                            <p className="px-2.5 py-4 font-regular ">TOTAL</p>
                        </div>
                    </div>

                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items px-3 py-4 font-regular text-sm ">
                            <p className="hover:text-gray-400 duration-300 cursor-pointer">File Organizer Series 1 - Black × 1</p>
                            <p className="mt-2.5 text-gray-500 text-xs"><span className="text-black text-sm">Color:</span>Black</p>

                        </div>
                        <div className="total flex items-center">
                            <p className="px-3 py-4 font-regular text-sm text-gray-700"> ৳ 3,900.00</p>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items">
                            <p className="px-3 py-4 font-regular text-sm">Subtotal:</p>

                        </div>
                        <div className="total flex items-center">
                            <p className="px-3 py-4 font-regular text-sm text-gray-700"> ৳ 3,900.00</p>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items ">
                            <p className="px-3 py-4 font-regular text-sm">Shipping:</p>

                        </div>
                        <div className="total flex items-center">
                            <p className="px-3 py-4 font-regular text-xs text-gray-700"> <span className="text-black text-sm">৳ 100.00 </span>via Home Delivery-Dhaka City</p>
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items ">
                            <p className="px-3 py-4 font-regular text-sm">Payment Method:</p>

                        </div>
                        <div className="total flex items-center">
                            <p className="px-3 py-4 font-regular text-sm text-gray-700"> Cash on delivery</p>
                        </div>
                    </div>

                    <div className="flex justify-between border-b border-gray-300">
                        <div className="items ">
                            <p className="px-3 py-4 font-regular text-2xl">TOTAL:</p>

                        </div>
                        <div className="total flex items-center">
                            <p className="px-3 py-4 font-regular text-2xl"> ৳ 4,000.00</p>
                        </div>
                    </div>

                </div>

                <div className="text mb-5">
                    <p className="text-2xl txt-black">BILLING ADDRESS</p>

                </div>
                <div className="details mb-5 text-sm space-y-2">
                    <p className="text-gray-700">Radif</p>
                    <p className="text-gray-700">40, Rasulpur, Dania, Dhaka-1236</p>
                    <p className="text-gray-700">Chattogram </p>
                    <p className="text-gray-700">+8801521750111</p>
                    <p className="text-gray-700">radiftajwarmahi420@gmail.com</p>

                </div>
            </div>
        </div>
    )
}
