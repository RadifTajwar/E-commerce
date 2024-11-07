import Rating from '@mui/material/Rating';
import 'flowbite';
import Image from 'next/image';

export default function AccordionSection() {
    return (
        <>
            <div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-900 dark:text-gray-400" className='border border-gray-200 mt-16 mb-4 px-4'>
                {/* First Accordion Section */}
                <h2 id="accordion-flush-heading-1">
                    <button type="button" className="flex items-center  w-full py-5 font-medium rtl:text-right text-gray-900 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                        </svg>
                        <span>Description</span>
                    </button>
                </h2>
                <div id="accordion-flush-body-1" className="hidden transition-all duration-500 ease-in-out" aria-labelledby="accordion-flush-heading-1">
                    <div className="py-5 dark:border-gray-700">
                        <ul className="text-sm text-gray-600 font-normal space-y-2 block" style={{ listStyleType: "disc" }}>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                            <li>100% Genuine Leather</li>
                        </ul>
                    </div>
                    <p className="text-sm text-gray-600 font-normal space-y-2">
                        Your everyday job will be easier if you keep all of your paperwork, file, documents, tabs up to 10 inches, checkbooks, certificates, business cards, and pencils in an A4 file bag. Cowhide is used to create the bag, which has a long lifespan.
                    </p>
                    <p className="text-sm text-gray-600 font-normal space-y-2">
                        We ensure that your handmade leather goods is made to last a lifetime by incorporating quality throughout the whole production process. From our studio, we make full-grain leather goods using traditional leatherworking techniques and equipment.
                    </p>
                </div>

                {/* Second Accordion Section */}
                <h2 id="accordion-flush-heading-2">
                    <button type="button" className="flex items-center w-full py-5 font-medium rtl:text-right text-gray-900 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-2" aria-expanded="true" aria-controls="accordion-flush-body-2">
                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                        </svg>
                        <span>Reviews (0)</span>
                    </button>
                </h2>
                <div id="accordion-flush-body-2" className="hidden transition-all duration-500 ease-in-out lg:max-h-[350px] lg:overflow-scroll" aria-labelledby="accordion-flush-heading-2">
                    <div className="py-5 dark:border-gray-700">
                        <p className="text-sm font-normal pb-4">REVIEWS</p>
                    </div>

                    {/* Reviews Section */}
                    <div className="comments w-full">
                        <div className="flex w-full justify-between items-center mb-10">
                            <div className="left flex space-x-4 items-center">
                                <div className="profile_icon ">
                                    <Image src="/profile.jpg" width={60} height={60} className="rounded-full" />
                                </div>
                                <div className="review_text">
                                    <p className="text-sm text-gray-600 font-normal space-y-2">Your review is awaiting approval</p>
                                    <p className="text-sm text-gray-600 font-normal space-y-2">Joss</p>
                                </div>
                            </div>
                            <div className="right">
                                <p className="text-sm text-gray-600 font-normal space-y-2">
                                    <Rating />
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Write a Comment Section */}
                    <div className="write_a_comment">
                        <div className="py-5 dark:border-gray-700">
                            <p className="text-sm font-normal">ADD A REVIEW</p>
                        </div>
                        <p className="text-sm font-normal text-gray-600 pb-4">Your email address will not be published. Required fields are marked *</p>

                        <div className="flex space-x-4">
                            <div className="text">
                                <p className="text-sm font-normal">Your rating:</p>
                            </div>
                            <div className="stars">
                                <Rating />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review">
                                <p className="text-sm font-normal">Your review</p>
                            </label>
                            <textarea
                                id="review"
                                className="max-w-full min-w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize min-h-44"
                                placeholder="Write your review here..."
                                rows="5"
                            />
                        </div>

                        <div className="w-full">
                            <form className="w-full">
                                <div className="input_fields w-full flex jusfity-between space-x-4">
                                    {/* Name Input */}
                                    <div className="mb-4 w-1/2">
                                        <label className="block text-sm font-normal mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value="Radif Tajwar"
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-4 w-1/2">
                                        <label className="block text-sm font-normal mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value="Raditajwarmahi420@gmail.com"
                                        />
                                    </div>
                                </div>

                                {/* Checkbox */}
                                <div className="mb-4">
                                    <label className="inline-flex items-center">
                                        <input type="checkbox" className="form-checkbox text-blue-500 text-sm" />
                                        <span className="ml-2 text-gray-700">Save my name, email, and website in this browser for the next time I comment.</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="buttons_ADD_TO_CART bg-black text-white text-center">
                                    <button type="submit" className="text-center w-full py-3 text-sm font-medium">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
