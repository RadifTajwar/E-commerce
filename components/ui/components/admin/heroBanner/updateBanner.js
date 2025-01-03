import { fetchHeroBannerById } from "@/redux/heroBanner/heroBannerByIdSlice";
import { updateHeroBanner } from "@/redux/heroBanner/updateHeroBannerSlice";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function updateBanner({ id, toggleVisibility, resetId, doneUpdate }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentCategoryRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
        previewImage: null,
        image2: null,
        previewImage2: null,
        title: [],
        images: [],
    });
    // Access the category data from the store
    const { heroBannerData, isLoading: categoryLoading, error: categoryError } = useSelector(
        (state) => state.heroBannerById
    );
    // Access the update category data from the store
    const {
        isLoading: updateCategoryLoading, // Loading state for updating category
        error: updateCategoryError // Error for updating category
    } = useSelector((state) => state.updateHeroBanners);

    const [imageUploading, setImageUploading] = useState(false)
    // Fetch the category data by ID

    const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // Checks for valid MongoDB ObjectId format
    // console.log(categoryData);

    // Fetch the category by ID
    useEffect(() => {
        if (id && isValidId(id)) {
            dispatch(fetchHeroBannerById(id));
        }
    }, [id, dispatch]);



    // Populate the form once both categoryData and parentCategories are available
    useEffect(() => {
        if (heroBannerData) {
            console.log(heroBannerData);
            setFormData({
                name: heroBannerData.header || 'asdfasd',
                image: heroBannerData.image?.[0] || null,
                previewImage: heroBannerData.image?.[0] || null,
                image2: heroBannerData.image?.[1] || null,
                previewImage2: heroBannerData.image?.[1] || null,
                title: heroBannerData.title || [],
                images: heroBannerData.image || [],
            });
            console.log("heroBannerData", heroBannerData);
            console.log(heroBannerData.title);
        }
    }, [heroBannerData]);







    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageInputDefault = (e) => {
        const file = e.target.files[0];
        console.log('Uploaded file:', file);
        if (file) {

            setFormData((prevData) => ({
                ...prevData,
                image: file,
                previewImage: URL.createObjectURL(file),
            }));
            console.log('Updated formData:', { ...formData, image: URL.createObjectURL(file) });
        } else {
            console.error('No file selected.');
        }
    };

    const handleImageInputHover = (e) => {
        const file = e.target.files[0];
        console.log('Uploaded file:', file);
        if (file) {

            setFormData((prevData) => ({
                ...prevData,
                image2: file,
                previewImage2: URL.createObjectURL(file),
            }));
            console.log('Updated formData:', { ...formData, image2: URL.createObjectURL(file) });
        } else {
            console.error('No file selected.');
        }
    };





    const handleSubmit = async (e) => {
        console.log("form data", formData);
        e.preventDefault();

        // Validation: Check if all required fields are filled
        if (!formData.name || !formData.image || !formData.image2) {
            console.error("All fields are required.");
            console.log(formData);// Inform user about validation error
            return; // Exit the function early
        }

        try {
            // Upload image to Cloudinary
            const folderName = `Banner`;
            console.log(formData);
            setImageUploading(true);
            const imageUrl = await uploadToCloudinary(formData.image, folderName);
            const imageUrl2 = await uploadToCloudinary(formData.image2, folderName);
            setImageUploading(false);
            // Prepare the final data for the backend

            const updatedImages = [...formData.images]; // Copy the existing images array
            updatedImages[0] = imageUrl; // Set the first image to the uploaded URL
            updatedImages[1] = imageUrl2;

            const bannerData = {
                header: formData.name,
                image: updatedImages, // Replace the file with the uploaded image URL
                title: formData.title // Replace the file with the uploaded image URL
            };
            console.log("parent category ", bannerData);
            // Dispatch the action to create a new category
            const updateResult = await dispatch(updateHeroBanner({ id, bannerData })).unwrap();

            // Reset the form data
            setFormData({
                name: '',
                image: null,
                previewImage: null,
                image2: null,
                previewImage2: null,
                title: [], // Array of dynamic strings
                images: [],
            });

            doneUpdate();
            resetId();
            toggleVisibility();
        } catch (error) {
            setImageUploading(false);
            console.error("Error creating category:", error);
            resetId();

        }
    };

    const cancelButtonPressed = () => {
        console.log("Cancel button pressed");
        setFormData({
            name: '',
            image: null,
            previewImage: null,
            image2: null,
            previewImage2: null,
            title: [], // Array of dynamic strings
            images: [],

        });
        resetId();
        toggleVisibility();
    };

    const handleAddTitle = () => {
        setFormData((prev) => ({
            ...prev,
            title: [...prev.title, ''], // Add an empty string for the new title
        }));
    };

    // Remove a title by index
    const handleRemoveTitle = (index) => {
        setFormData((prev) => ({
            ...prev,
            title: prev.title.filter((_, i) => i !== index), // Remove the title at the given index
        }));
    };

    // Update a title by index
    const handleTitleChange = (e, index) => {
        const { value } = e.target;
        setFormData((prev) => {
            const updatedtitle = [...prev.title];
            updatedtitle[index] = value; // Update the specific title
            return {
                ...prev,
                title: updatedtitle,
            };
        });
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
                                <h4 className="text-xl font-medium dark:text-gray-300">Update Banner</h4>
                                <p className="mb-0 text-sm font-normal dark:text-gray-300">Update your Banner necessary information from here</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 overflow-hidden h-full bg-white">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 flex items-center">
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                        Banner Header
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <input
                                            className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                                            type="text"
                                            name="name"
                                            placeholder="Header"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>


                                {/* Banner  Images 1 */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label
                                        htmlFor="image-upload"
                                        className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                                    >
                                        Banner Image 1
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <div className="w-full text-center mb-4">
                                            {/* Label to trigger file upload */}
                                            <label
                                                htmlFor="image-1-banner"
                                                className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                            >
                                                <input
                                                    id="image-1-banner"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageInputDefault} // Make sure the function is properly attached
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

                                        {/* Display preview image */}
                                        {formData.image && (
                                            <aside className="flex flex-row flex-wrap mt-4">
                                                <div draggable className="relative inline-flex items-center">
                                                    <img
                                                        className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                        src={
                                                            formData.image instanceof File
                                                                ? URL.createObjectURL(formData.image)
                                                                : formData.image
                                                        }
                                                        alt="Category"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-0 right-0 text-red-500 focus:outline-none"

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
                                {/* product hover Images  */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label

                                        className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                                    >
                                        Banner Image 2
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <div className="w-full text-center mb-4">
                                            {/* Label to trigger file upload */}
                                            <label
                                                htmlFor="image-2-banner"
                                                className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                            >
                                                <input
                                                    id="image-2-banner"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageInputHover} // Make sure the function is properly attached
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

                                        {/* Display preview image */}
                                        {formData.image2 && (
                                            <aside className="flex flex-row flex-wrap mt-4">
                                                <div draggable className="relative inline-flex items-center">
                                                    <img
                                                        className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                        src={
                                                            formData.image2 instanceof File
                                                                ? URL.createObjectURL(formData.image2)
                                                                : formData.image2
                                                        }
                                                        alt="Category"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-0 right-0 text-red-500 focus:outline-none"

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

                                {/*Banner title */}
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                        Banner Title
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        {formData.title.map((ttle, index) => (
                                            <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
                                                <div className="grid grid-cols-12 gap-2 mb-2">
                                                    {/* Color Name */}
                                                    <input
                                                        type="text"
                                                        name={`titleName-${index}`}
                                                        placeholder="Color Name"
                                                        className="col-span-11 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                                                        value={ttle}
                                                        onChange={(e) => handleTitleChange(e, index, "titleName")}
                                                    />

                                                    {/* Remove Color Button */}
                                                    <button
                                                        type="button"
                                                        className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                                                        onClick={() => handleRemoveTitle(index)}
                                                    >
                                                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mx-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>



                                            </div>
                                        ))}

                                        {/* Add Color Button */}
                                        <button
                                            type="button"
                                            className="mt-2 text-sm text-white bg-primary-500 px-3 py-1 rounded-md hover:bg-primary-600"
                                            onClick={handleAddTitle}
                                        >
                                            + Add Title
                                        </button>
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

                                        <span> {(updateCategoryLoading || imageUploading) ? 'Updating...' : 'Update Category'}</span>
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
