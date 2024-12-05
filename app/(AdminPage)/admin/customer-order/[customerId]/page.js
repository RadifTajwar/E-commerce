import CustomerOrder from "@/components/ui/components/admin/customers/customerOrder"
export default function page() {
    return (
        <>
            <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
                <h1 className="my-6 text-lg font-bold text-black dark:text-gray-300">
                    Customer Order List
                </h1>
                <div className="w-full bg-white rounded-md dark:bg-gray-800">
                    <div className="p-8 text-center">
                        <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M454.65 169.4A31.82 31.82 0 00432 160h-64v-16a112 112 0 00-224 0v16H80a32 32 0 00-32 32v216c0 39 33 72 72 72h272a72.22 72.22 0 0050.48-20.55 69.48 69.48 0 0021.52-50.2V192a31.75 31.75 0 00-9.35-22.6zM176 144a80 80 0 01160 0v16H176zm192 96a112 112 0 01-224 0v-16a16 16 0 0132 0v16a80 80 0 00160 0v-16a16 16 0 0132 0z"></path>
                            </svg>
                        </span>
                        <h2 className="font-medium text-base mt-4 text-gray-600">
                            This Customer has no order yet!
                        </h2>
                    </div>
                </div>
                <div className="customerOrder">
                    <CustomerOrder/>
                </div>
            </div>

        </>
    )
}
