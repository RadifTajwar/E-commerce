'use client'
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
export default function page() {

    const [showDistrictOption, setShowDistrictOption] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDistrict, setSelectedDiestrict] = useState("Chittagong")
    const districts = ["Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];

    const filteredDistricts = districts.filter((district) =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
            <div className="text mb-5">
                <p className="text-2xl txt-black">BILLING ADDRESS</p>

            </div>

            <div className="name_address_district_phone_email_&_additionalInformation">
                {/* Name Field */}
                <div className=" w-full pb-5">
                    <label htmlFor="name" className="block text-sm font-normal text-gray-900 pb-1">
                        Full Name (আপনার সম্পূর্ণ নাম) <span className="text-sm text-red-600">*</span>
                    </label>
                    <div className="input  w-full lg:w-1/2">
                        <input
                            type="text"
                            id="name"
                            className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                        />
                    </div>

                </div>



                {/* Address Field */}
                <div className="w-full pb-5">
                    <label htmlFor="address" className="block text-sm font-normal text-gray-900 pb-1">
                        Full address(আপনার সম্পূর্ণ ঠিকানা লিখুন) <span className="text-sm text-red-600">*</span>
                    </label>
                    <div className="input w-full">
                        <input
                            type="text"
                            id="address"
                            className="  px-4 border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                        />
                    </div>
                </div>

                {/* District Field */}
                <div className="w-full pb-5">
                    <label htmlFor="district" className="block text-sm font-normal text-gray-900 pb-1">
                        District (জেলা) <span className="text-sm text-red-600">*</span>
                    </label>
                    <div className="relative inline-block w-full">
                        <div className="px-4 border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm">
                            <button
                                className="w-full text-left flex justify-between items-center focus:outline-none"
                                onClick={() => setShowDistrictOption(!showDistrictOption)}
                            >
                                {selectedDistrict}
                                <svg
                                    className={`w-4 h-4 ml-2 ${showDistrictOption ? 'rotate-180' : 'rotate-0'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>


                            </button>
                        </div>

                        {/* Search Bar */}
                        {showDistrictOption && (
                            <div className="absolute z-10 left-0 right-0 bg-white border-x-2 border-gray-200 shadow-md ">
                                <div className="relative w-full p-4 bg-gray-200">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                    {/* Search Icon */}
                                    <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 me-2" />
                                </div>



                                <ul className="max-h-[200px] overflow-scroll">
                                    {filteredDistricts.length > 0 ? (
                                        filteredDistricts.map((district, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2.5 cursor-pointer hover:bg-gray-700 hover:text-white text-sm"
                                                onClick={() => {
                                                    setSelectedDiestrict(district);
                                                    setSearchTerm(""); // Set the selected district in the search bar
                                                    setShowDistrictOption(false); // Close the dropdown
                                                }}
                                            >
                                                {district}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2.5 text-sm text-gray-900">
                                            No results found
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                </div>

                {/* Phone Field */}
                <div className="w-full pb-5">
                    <label htmlFor="phone" className="block text-sm font-normal text-gray-900 pb-1">
                        Phone(আপনার ফোন নাম্বরটি লিখুন) <span className="text-sm text-red-600">*</span>
                    </label>
                    <div className="input w-full">
                        <input
                            type="tel"
                            id="phone"
                            className="  px-4 border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="w-full pb-5">
                    <label htmlFor="email" className="block text-sm font-normal text-gray-900 pb-1">
                        Email address (optional)
                    </label>
                    <div className="input w-full">
                        <input
                            type="email"
                            id="email"
                            className=" px-4  border-2 border-gray-200 p-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                        />
                    </div>
                </div>

                {/* Additional Information Field */}
             
            </div>
        </div>
    )
}
