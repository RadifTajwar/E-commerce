export default function EditAccountPage() {
    return (
        <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
            <div className="name_address_district_phone_email_&_additionalInformation">
                {/* Name Field */}
                <div className="name flex w-full space-x-8">
                    <div className=" first_name w-1/2  pb-5">
                        <label htmlFor="firstName" className="block text-sm font-normal text-gray-900 pb-1">
                            First Name <span className="text-sm text-red-600">*</span>
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="firstName"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />
                        </div>

                    </div>
                    <div className=" last_name w-1/2  pb-5">
                        <label htmlFor="lastName" className="block text-sm font-normal text-gray-900 pb-1">
                            Last Name <span className="text-sm text-red-600">*</span>
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="lastName"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />
                        </div>

                    </div>
                </div>

                <div className="display_name">
                    <div className=" first_name w-full  pb-5">
                        <label htmlFor="displayName" className="block text-sm font-normal text-gray-900 pb-1">
                            Display Name <span className="text-sm text-red-600">*</span>
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="displayName"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />
                            <i className="text-xs text-gray-500">This will be how your name will be displayed in the account section and in reviews</i>
                        </div>

                    </div>
                </div>

                <div className="email_address">
                    <div className=" email_address w-full  pb-5">
                        <label htmlFor="emailAddress" className="block text-sm font-normal text-gray-900 pb-1">
                            Display Name <span className="text-sm text-red-600">*</span>
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="emailAddress"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />

                        </div>

                    </div>
                </div>

                <div className="text mb-5">
                    <p className="text-xl txt-black">Password Change</p>

                </div>

                <div className="changePassword px-10 py-5 border-2 border-gray-200 relative">




                    <div className=" current_password w-full  pb-5">
                        <label htmlFor="currentPassword" className="block text-sm font-normal text-gray-900 pb-1">
                            Current password (leave blank to leave unchanged)
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="currentPassword"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />

                        </div>

                    </div>


                    <div className=" current_password w-full  pb-5">
                        <label htmlFor="newPassword" className="block text-sm font-normal text-gray-900 pb-1">
                            New password (leave blank to leave unchanged)
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="newPassword"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />

                        </div>

                    </div>



                    <div className=" current_password w-full  pb-5">
                        <label htmlFor="confirmPassword" className="block text-sm font-normal text-gray-900 pb-1">
                            Confirm new password
                        </label>
                        <div className="input  w-full ">
                            <input
                                type="text"
                                id="confirmPassword"
                                className="   border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm focus:outline-none sm:text-sm"

                            />

                        </div>

                    </div>
                </div>
                <div className="saveChanges my-4">
                    <button
                        type="button"
                        disabled
                        title="Not available yet"
                        className="w-full py-3 text-white bg-black text-sm"
                    >
                        SAVE CHANGES
                    </button>
                </div>

            </div>
        </div>
    )
}
