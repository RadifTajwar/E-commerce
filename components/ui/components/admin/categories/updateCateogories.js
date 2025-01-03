import { fetchCategoryById } from "@/redux/category/categoryByIdSlice";
import { updateCategoryData } from "@/redux/category/updateCategoryDataSlice";
import { fetchAllParentCategories } from "@/redux/parentCategory/allParentCategorySlice";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function updateCategories({ id, toggleVisibility, resetId, doneUpdate }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentCategoryRef = useRef(null);
    // Access the category data from the store
    const { categoryData, isLoading: categoryLoading, error: categoryError } = useSelector(
        (state) => state.categoryById
    );
    // Access the update category data from the store
    const {
        isLoading: updateCategoryLoading, // Loading state for updating category
        error: updateCategoryError // Error for updating category
    } = useSelector((state) => state.updateCategoryData);
    // Access the parent categories from the store
    const { parentCategories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.allParentCategories
    );

    const [imageUploading, setImageUploading] = useState(false)
    // Fetch the category data by ID

    const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // Checks for valid MongoDB ObjectId format
    // console.log(categoryData);

    // Fetch the category by ID
    useEffect(() => {
        if (id && isValidId(id)) {
            dispatch(fetchCategoryById(id));
        }
    }, [id, dispatch]);

    // Fetch all parent categories
    useEffect(() => {
        dispatch(fetchAllParentCategories());
    }, [dispatch]);

    // Populate the form once both categoryData and parentCategories are available
    useEffect(() => {
        if (categoryData && parentCategories.length > 0) {
            const matchingParentCategory = parentCategories.find(
                (parentCategory) => parentCategory.id === categoryData.parentCategoryId
            );

            setFormData({
                name: categoryData.name || '',
                description: categoryData.description || '',
                image: categoryData.image || null,
                parentCategory: matchingParentCategory?.name || parentCategories[0]?.name || '', // Default to the first parent category if no match
                parentCategoryId: matchingParentCategory?.id || parentCategories[0]?.id || '', // Default to the first parent category ID if no match
                previewImage: categoryData.image || null
            });
        }
    }, [categoryData, parentCategories]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null,
        parentCategory: '', // Example of a default category
        parentCategoryId: '', // Example of a default category ID
        previewImage: null
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                image: file, // Store the file for uploading
                previewImage: URL.createObjectURL(file), // Create and store the preview URL
            }));
        } else {
            console.error('No file selected.');
        }
    };





    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("abcd", formData);
        // Validation: Check if all required fields are filled
        if (!formData.name || !formData.description || !formData.parentCategoryId || !formData.image) {
            console.error("All fields are required.");
            console.log(formData);// Inform user about validation error
            return; // Exit the function early
        }

        try {
            // Upload image to Cloudinary
            const folderName = `Category/${formData.name}`;

            setImageUploading(true);
            const imageUrl = await uploadToCloudinary(formData.image, folderName);
            setImageUploading(false);
            // Prepare the final data for the backend
            const categoryData = {
                ...formData,
                image: imageUrl, // Replace the file with the uploaded image URL
            };
            // Dispatch the action to create a new category

            console.log(id, categoryData);
            const updateResult = await dispatch(updateCategoryData({ id, categoryData })).unwrap();

            // Reset the form data
            setFormData({
                name: '',
                description: '',
                image: null,
                parentCategory: '',
                parentCategoryId: '',
                previewImage: null
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
            description: '',
            image: null,
            category: '',
            parentCategoryId: '',
            previewImage: null
        });
        resetId();
        toggleVisibility();
    };


    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close the dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                parentCategoryRef.current && !parentCategoryRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleCategorySelect = (parentCategoryName) => {
        setFormData({ ...formData, parentCategory: parentCategoryName, parentCategoryId: parentCategories.find((category) => category.name === parentCategoryName).id });
        setIsOpen(false); // Close dropdown after selecting a category
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
                                <h4 className="text-xl font-medium dark:text-gray-300">Update Category</h4>
                                <p className="mb-0 text-sm font-normal dark:text-gray-300">Update your Category necessary information from here</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 overflow-hidden h-full bg-white">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">
                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 flex items-center">
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                        Category Title/Name
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <input
                                            className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                                            type="text"
                                            name="name"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                        Category Description
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <textarea
                                            className="px-3 py-1  block w-full text-sm dark:text-gray-300 rounded-md focus:outline-none form-textarea focus:border-purple-400 border-gray-300 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:ring-gray-300 focus:ring focus:ring-purple-300 border text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                                            name="description"
                                            placeholder="Product Description"
                                            rows="4"
                                            spellCheck="false"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                </div>


                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2">
                                        Category
                                    </label>
                                    <div className="col-span-6 sm:col-span-4">
                                        <div className="relative">
                                            {/* Parent Category Dropdown */}
                                            <div
                                                ref={parentCategoryRef}
                                                className="parentCategory flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                                                onClick={toggleDropdown} // Toggle the dropdown visibility
                                            >
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{formData.parentCategory}</span>
                                                <span className="text-gray-500 dark:text-gray-300">▼</span>
                                            </div>

                                            {/* Dropdown List */}
                                            {isOpen && (
                                                <ul
                                                    ref={dropdownRef}
                                                    className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto"
                                                >
                                                    {parentCategories.length > 0 ? (
                                                        parentCategories.map((parentCategory) => (
                                                            <li key={parentCategory.id}>
                                                                <a
                                                                    className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                                                    onClick={() => handleCategorySelect(parentCategory.name)} // Select category and close dropdown
                                                                >
                                                                    {parentCategory.name}
                                                                </a>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>
                                                            <a
                                                                className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                                                                disabled
                                                            >
                                                                No Categories Available
                                                            </a>
                                                        </li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                    <label htmlFor="product-images" className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                                        Category Image
                                    </label>
                                    <div className="col-span-8 sm:col-span-4">
                                        <div className="w-full text-center mb-4">
                                            <label htmlFor="image-upload" className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4">
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                />
                                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-blue-500 mb-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <polyline points="16 16 12 12 8 16"></polyline>
                                                    <line x1="12" y1="12" x2="12" y2="21"></line>
                                                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                                    <polyline points="16 16 12 12 8 16"></polyline>
                                                </svg>
                                                <p className="text-sm">Drag your images here</p>
                                                <em className="text-xs text-gray-400">(Only *.jpeg, *.webp and *.png images will be accepted)</em>
                                            </label>
                                        </div>
                                        {formData.previewImage && (
                                            <aside className="flex flex-row flex-wrap mt-4">
                                                <div draggable className="relative inline-flex items-center">
                                                    <img className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2" src={formData.previewImage} alt="Category" />
                                                    <button type="button" className="absolute top-0 right-0 text-red-500 focus:outline-none">
                                                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
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
