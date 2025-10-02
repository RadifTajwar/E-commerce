import { updateVideoBanner } from "@/redux/video/updateVideoBannerSlice";
import { fetchVideoBannerById } from "@/redux/video/videoBannerByIdSlice";
import { uploadVideoToCloudinary } from "@/utils/uploadVidToCloudinary";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function updateBanner({ id, toggleVisibility, resetId, doneUpdate }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentCategoryRef = useRef(null);
    // Access the category data from the store
    const { videoBannerData, isLoading: categoryLoading, error: categoryError } = useSelector(
        (state) => state.videoBannerById
    );
    // Access the update category data from the store
    const {
        isLoading: updateCategoryLoading, // Loading state for updating category
        error: updateCategoryError // Error for updating category
    } = useSelector((state) => state.updateVideoBanners);

    const [imageUploading, setImageUploading] = useState(false)
    // Fetch the category data by ID

    const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // Checks for valid MongoDB ObjectId format
    // 

    // Fetch the category by ID
    useEffect(() => {
        if (id && isValidId(id)) {
            dispatch(fetchVideoBannerById(id));
        }
    }, [id, dispatch]);



    // Populate the form once both categoryData and parentCategories are available
    useEffect(() => {
        if (videoBannerData) {
            
            setFormData({
                image: videoBannerData.url || null,
                previewImage: videoBannerData.url || null,

            });
        }
    }, [videoBannerData]);

    const [formData, setFormData] = useState({

        image: null,
        previewImage: null,

    });


    const handleVideoInputDefault = (e) => {
        const file = e.target.files[0];
        
        if (file) {

            setFormData((prevData) => ({
                ...prevData,
                image: file,
                previewImage: URL.createObjectURL(file),
            }));
             });
        } else {
            
        }
    };





    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if all required fields are filled
        if (!formData.image) {
            
            // Inform user about validation error
            return; // Exit the function early
        }

        try {
            // Upload image to Cloudinary
            const folderName = `Video`;
            
            setImageUploading(true);
            const imageUrl = await uploadVideoToCloudinary(formData.image, folderName);
            setImageUploading(false);
            // Prepare the final data for the backend
            const bannerData = {
                url: imageUrl, // Replace the file with the uploaded image URL
            };
            
            // Dispatch the action to create a new category
            const updateResult = await dispatch(updateVideoBanner({ id, bannerData })).unwrap();

            // Reset the form data
            setFormData({
                image: null,
                previewImage: null,
            });
            doneUpdate();
            resetId();
            toggleVisibility();
        } catch (error) {
            setImageUploading(false);
            
            resetId();

        }
    };

    const cancelButtonPressed = () => {
        
        setFormData({

            image: null,
            previewImage: null,


        });
        resetId();
        toggleVisibility();
    };


    return (
        <>

            <div className="updateCategory drawer-content">
                <button
                    className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
                    onClick={() => { cancelButtonPressed() }}
                >
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mx-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="flex flex-col w-full h-screen justify-between">
                    <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 min-h-0">
                        <div className="flex md:flex-row flex-col justify-between mr-20">
                            <div>
                                <h4 className="text-xl font-medium dark:text-gray-300">Update Video</h4>
                                <p className="mb-0 text-sm font-normal dark:text-gray-300">Update your Video necessary information from here</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 overflow-hidden h-full bg-white">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">

                                {/* Video Upload */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label
                                        htmlFor="video-upload"
                                        className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                                    >
                                        Banner Video
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <div className="w-full text-center mb-4">
                                            {/* Label to trigger file upload */}
                                            <label
                                                htmlFor="video-banner"
                                                className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                            >
                                                <input
                                                    id="video-banner"
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoInputDefault} // Attach a handler for video upload
                                                    style={{ display: "none" }} // Input remains hidden but accessible
                                                />
                                                {/* Icon and text */}
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
                                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                </svg>
                                                <p className="text-sm">Drag your videos here</p>
                                                <em className="text-xs text-gray-400">
                                                    (Only *.mp4, *.webm, and *.ogg video files will be accepted)
                                                </em>
                                            </label>
                                        </div>

                                        {/* Display preview video */}
                                        {formData.image && (
                                            <aside className="flex flex-row flex-wrap mt-4">
                                                <div draggable className="relative inline-flex items-center">
                                                    <video
                                                        className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                        src={
                                                            formData.image instanceof File
                                                                ? URL.createObjectURL(formData.image)
                                                                : formData.image
                                                        }
                                                        alt="Banner Video"
                                                        controls // Allow video playback
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-0 right-0 text-red-500 focus:outline-none"
                                                       // Attach a handler for removing the uploaded video
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
                                            </aside>
                                        )}
                                    </div>
                                </div>


                            </div>

                            <div className="bottom_section absolute z-10 bottom-0 w-full right-0 pt-4 pb-32 lg:pb-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" >
                                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                    <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150  focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 h-12  w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700 font-normal" type="button"
                                        onClick={cancelButtonPressed}
                                    >Cancel</button>
                                </div>
                                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                    <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-normal focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12" type="submit" disabled={(updateCategoryLoading || imageUploading)}>

                                        <span> {(updateCategoryLoading || imageUploading) ? 'Updating...' : 'Update Video'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>



        </>
    )
}
