import { sendRating } from '@/redux/rating/createRatingSlice';
import { getRatingById } from '@/redux/rating/ratingByProductIdSlice';
import { Skeleton } from '@mui/material';
import Rating from '@mui/material/Rating';
import 'flowbite';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
export default function AccordionSection({ productId }) {

    const dispatch = useDispatch();
    const [active, setActive] = useState(false); // State to toggle the accordion section
    const [rating, setRating] = useState(0); // State to store the selected rating
    const [ratingRes, setRatingRes] = useState([]);

    const{isLoading} = useSelector((state) => state.getRatingByProductId);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        review: '',
        rating: 0,
    });

    const handleReviewOpen = async ()  => {
        if(!active){
            setActive(!active); 
            const rating = await dispatch(getRatingById(productId)).unwrap();
            setRatingRes(rating);
        }
        else{
            setActive(!active);
        }
        
        
    };

    const handleRatingChange = (event, newValue) => {
        setRating(newValue); // Update state with the new rating value
        setFormData({ ...formData, rating: newValue });
    };


    const handleFormClicked = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || formData.rating === 0) {
            alert('Please fill out all fields and provide a rating.');
            return;
        }
        try {
            const result = await dispatch(
                sendRating({
                    productId: productId,
                    userName: formData.name,
                    userEmail: formData.email,
                    ratingStar: Number(formData.rating),
                    reviewText: formData.review,
                })
            ).unwrap();
        } catch (error) {
            console.log("error is ", error);
        }
        // Dispatch the action to add the review



        setFormData({
            name: '',
            email: '',
            review: '',
        });
        setRating(0);
        const rating = await dispatch(getRatingById(productId)).unwrap();
        setRatingRes(rating);

    };



    return (
        <>
            <div className='border border-gray-200 mt-16 mb-4 px-4'>
                {/* First Accordion Section */}
                <h2 id="accordion-flush-heading-1">
                    <button type="button" className="flex items-center  w-full py-5 font-medium rtl:text-right text-gray-900 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                        <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                        </svg>
                        <span>Description</span>
                    </button>
                </h2>
                <div className="hidden transition-all duration-500 ease-in-out" >
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

                <button
                    type="button"
                    className="flex items-center w-full py-5 font-medium rtl:text-right text-gray-900 dark:border-gray-700 dark:text-gray-400 gap-3"
                    onClick={handleReviewOpen}
                >
                    <svg
                        data-accordion-icon
                        className={`w-3 h-3 transform transition-transform duration-500 ease-in-out ${active ? 'rotate-0' : 'rotate-180'
                            }`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                        />
                    </svg>
                    <span>Reviews </span>
                </button>

                <div
                    className={`transition-all duration-500 ease-in-out overflow-scroll`}
                    style={{
                        maxHeight: active ? '350px' : '0',
                        opacity: active ? 1 : 0,
                    }}
                >
                    {
                        isLoading && (
                            <div className="py-5 dark:border-gray-700">
                                <p className="text-sm font-normal pb-4">REVIEWS</p>

                                {/* Reviews Section Skeleton */}
                                <div className="comments w-full">
                                    {[...Array(1)].map((_, index) => (
                                        <div key={index} className="flex w-full justify-between items-center mb-10">
                                            <div className="left flex space-x-4 items-center">
                                                <div className="profile_icon">
                                                    <Skeleton variant="circular" width={60} height={60} />
                                                </div>
                                                <div className="review_text">
                                                    <Skeleton variant="text" width={120} height={20} />
                                                    <Skeleton variant="text" width={180} height={20} />
                                                </div>
                                            </div>
                                            <div className="right">
                                                <Skeleton variant="text" width={80} height={20} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                    {
                       !isLoading &&  ratingRes.length === 0 ? (<p className="text-sm text-gray-600 font-normal space-y-2">No reviews yet</p>) :
                            (
                                <>
                                    <div className="py-5 dark:border-gray-700">
                                        <p className="text-sm font-normal pb-4">REVIEWS</p>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="comments w-full">
                                        {
                                            ratingRes?.map((item, index) => (
                                                <div key={index} className="flex w-full justify-between items-center mb-10">
                                                    <div className="left flex space-x-4 items-center">
                                                        <div className="profile_icon ">
                                                            <Image src="/profile.jpg" width={60} height={60} className="rounded-full" />
                                                        </div>
                                                        <div className="review_text">
                                                            <p className="text-sm text-gray-600 font-normal space-y-2">{item?.userName}</p>
                                                            <p className="text-sm text-gray-600 font-normal space-y-2">{item?.reviewText}</p>
                                                        </div>
                                                    </div>
                                                    <div className="right">
                                                        <p className="text-sm text-gray-600 font-normal space-y-2">
                                                            <Rating value={item?.ratingStar} readOnly />
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </>
                            )
                    }


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
                                <Rating value={rating} onChange={handleRatingChange} />
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
                                value={formData.review}
                                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                            />
                        </div>

                        <div className="w-full">
                            <form className="w-full" onSubmit={handleFormClicked}>
                                <div className="input_fields w-full flex jusfity-between space-x-4">
                                    {/* Name Input */}
                                    <div className="mb-4 w-1/2">
                                        <label className="block text-sm font-normal mb-2" htmlFor="name">
                                            Name <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div className="mb-4 w-1/2">
                                        <label className="block text-sm font-normal mb-2" htmlFor="email">
                                            Email <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>



                                {/* Submit Button */}
                                <div className="buttons_ADD_TO_CART bg-black text-white text-center mb-10">
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
