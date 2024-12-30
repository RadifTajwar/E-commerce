import { fetchAllCategories } from "@/redux/category/allCategoriesSlice";
import { fetchProductById } from "@/redux/product/productByIdSlice";
import { updateProductData } from "@/redux/product/updateProductDataSlice";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function updateProducts({ toggleVisibility, doneUpdate, id, resetId }) {

    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentCategoryRef = useRef(null);
    // Access the parent categories from the store
    const { categories, isLoading: parentLoading, error: parentError } = useSelector(
        (state) => state.categories
    );
    // Access the update category data from the store
    const {
        isLoading: updateproductLoading, // Loading state for updating category
        error: updateproductError // Error for updating category
    } = useSelector((state) => state.updateProductData);

    const { productData, isLoading: productLoading, error: productError } = useSelector(
        (state) => state.productById
    );

    const [imageUploading, setImageUploading] = useState(false)
    // Fetch the category data by ID


    const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // Checks for valid MongoDB ObjectId format
    // console.log(categoryData);

    // Fetch the category by ID
    useEffect(() => {
        console.log("id ashche??", id);
        if (id && isValidId(id)) {
            dispatch(fetchProductById(id));
            console.log("dhukse to");
        }
    }, [id, dispatch]);


    // Fetch all parent categories
    useEffect(() => {
        dispatch(fetchAllCategories());

    }, [dispatch]);



    const [formData, setFormData] = useState({
        // Basic Product Information
        barcode: "",
        name: "",
        slug: "",
        category: "", // Set default category ID if necessary
        categoryId: "",
        inStock: false, // Boolean for availability
        onSale: false, // Boolean for sale status

        // Pricing
        originalPrice: "0", // Default numeric value
        discountedPrice: "0", // Default numeric value

        // Images
        imageDefault: null, // URL or file
        previewImageDefault: null,
        imageHover: null, // URL or file
        previewImageHover: null,
        leather: {
            title: [],
            image: null,
        },
        // Colors
        color: [

        ],

        // Additional Details
        additionalDetails: [

        ],

        // Product Details
        productDetails: {
            additionalProductDetails: {

            },
            size: [

            ],
            warranty: "0", // Example: "2 years"
        },

    });


    useEffect(() => {
        if (productData && categories.length > 0) {
            const matchingCategory = categories.find(
                (parentCategory) => parentCategory.id === productData.parentCategoryId
            );

            setFormData({
                // Basic information
                name: productData.name || '',
                description: productData.description || '',
                imageDefault: productData.imageDefault || null,
                imageHover: productData.imageHover || null,
                previewImageDefault: productData.imageDefault || null,
                previewImageHover: productData.imageHover || null,

                // Category-related information
                category: matchingCategory?.name || categories[0]?.name || '', // Default to the first parent category if no match
                categoryId: matchingCategory?.id || categories[0]?.id || '',  // Default to the first parent category ID if no match

                // Pricing information
                originalPrice: productData.originalPrice || 0,
                discountedPrice: productData.discountedPrice || 0,
                leather: productData.leather || {
                    title: [],
                    image: null,
                },


                // Color field
                color: productData.color || [
                    {

                    },
                ],

                // Product details
                productDetails: {
                    size: productData.productDetails?.size || '',
                    warranty: productData.productDetails?.warranty || '',
                    leatherType: productData.productDetails?.leatherType || '',
                    leatherHide: productData.productDetails?.leatherHide || '',
                    waterResistant: productData.productDetails?.waterResistant || false,
                    additionalProductDetails: productData.productDetails?.additionalProductDetails || [],
                },

                // Additional details if needed
                additionalDetails: productData.additionalDetails || [],

                // Stock and availability
                inStock: productData.inStock || true,
                onSale: productData.onSale || false,

                // Rating (if applicable)
                rating: {
                    average: productData.rating?.average || 0,
                    totalReviews: productData.rating?.totalReviews || 0,
                },

                // Any other fields
                barcode: productData.barcode || '',
                id: productData.id || '',
            });

        }
    }, [productData, categories]);





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
                imageDefault: file,
                previewImageDefault: URL.createObjectURL(file),
            }));
            console.log('Updated formData:', { ...formData, imageDefault: URL.createObjectURL(file) });
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
                imageHover: file,
                previewImageHover: URL.createObjectURL(file),
            }));
            console.log('Updated formData:', { ...formData, imageHover: URL.createObjectURL(file) });
        } else {
            console.error('No file selected.');
        }
    };

    const handleLeatherImageInputDefault = (e, colorIndex) => {
        const file = e.target.files[0];
        console.log('Uploaded file:', file);
        if (file) {

            setFormData((prevData) => ({
                ...prevData,
                leather: {
                    ...prevData.leather,
                    image: file,
                }
            }));

        } else {
            console.error('No file selected.');
        }
    };

    const handleTitleChange = (e, index) => {
        const updatedTitles = [...formData.leather.title];  // Create a shallow copy of the titles array
        updatedTitles[index] = e.target.value;  // Update the specific title at the given index

        // Update formData state with the updated title array
        setFormData({
            ...formData,
            leather: {
                ...formData.leather,
                title: updatedTitles,  // Set the updated titles array
            }
        });
    };

    const handleColorChange = (e, index, field) => {
        // Create a deep copy of the colors array
        const updatedColors = formData.color.map((color) => ({ ...color }));
        updatedColors[index][field] = e.target.value;

        // Create a deep copy of the additionalDetails array
        const updatedAdditionalDetails = formData.additionalDetails.map((detail) => ({ ...detail }));
        if (field === "colorName") updatedAdditionalDetails[index].color = e.target.value;
        if (field === "hex") updatedAdditionalDetails[index].hex = e.target.value;
        if (field === "availableQuantity") updatedAdditionalDetails[index].quantity = parseInt(e.target.value, 10) || 0;

        // Update the formData state
        setFormData({
            ...formData,
            color: updatedColors,
            additionalDetails: updatedAdditionalDetails,
        });
    };


    const handleAddColor = () => {
        setFormData({
            ...formData,
            color: [
                ...formData.color,
                { colorName: "", hex: "", availableQuantity: 0 },
            ],
            additionalDetails: [
                ...formData.additionalDetails,
                { color: "", hex: "", quantity: 0 },
            ],
        });
    };

    const handleAddTitle = () => {
        console.log("here after title  is ", formData.leather);
        setFormData({
            ...formData,
            leather: {
                ...formData.leather, // Preserve the entire leather object
                title: [
                    ...formData.leather.title, // Append to the existing title array
                    "", // Add an empty string as the new dynamic title
                ],
            },
        });
    };

    const handleImageUpload = (e, colorIndex) => {
        const files = Array.from(e.target.files); // Convert FileList to Array
        console.log("files", files);

        const fileURLs = files.map((file) => URL.createObjectURL(file)); // Generate preview URLs
        console.log("fileUrls", fileURLs);

        // Create a deep copy of the current additionalDetails array to avoid modifying frozen objects
        const updatedAdditionalDetails = formData.additionalDetails.map((detail, index) => ({
            ...detail,
            images: Array.isArray(detail.images) ? [...detail.images] : [],
            imagesPreview: Array.isArray(detail.imagesPreview) ? [...detail.imagesPreview] : [],
        }));

        // Ensure the colorIndex entry exists
        if (!updatedAdditionalDetails[colorIndex]) {
            updatedAdditionalDetails[colorIndex] = { images: [], imagesPreview: [] };
        }

        // Add files and previews to the respective arrays
        updatedAdditionalDetails[colorIndex].images = [
            ...(updatedAdditionalDetails[colorIndex]?.images || []),
            ...files,
        ];
        updatedAdditionalDetails[colorIndex].imagesPreview = [
            ...(updatedAdditionalDetails[colorIndex]?.imagesPreview || []),
            ...fileURLs,
        ];

        // Update the formData state with the new additionalDetails
        setFormData({
            ...formData,
            additionalDetails: updatedAdditionalDetails,
        });
    };

    const handleRemoveTitle = (index) => {
        const updatedTitle = formData.leather.title.filter((_, i) => i !== index);
        
        // Correctly updating the formData state with the updated title inside the leather object
        setFormData({
            ...formData,
            leather: {
                ...formData.leather,
                title: updatedTitle, // Update the title array inside leather
            },
        });
    };

    const handleRemoveImage = (colorIndex, imageIndex) => {
        const updatedAdditionalDetails = formData.additionalDetails.map((detail, index) => ({
            ...detail,
            images: Array.isArray(detail.images) ? [...detail.images] : [],
            imagesPreview: Array.isArray(detail.imagesPreview) ? [...detail.imagesPreview] : [],
        }));


        updatedAdditionalDetails[colorIndex].images = updatedAdditionalDetails[colorIndex].images.filter(
            (_, idx) => idx !== imageIndex
        );
        updatedAdditionalDetails[colorIndex].imagesPreview = updatedAdditionalDetails[colorIndex].imagesPreview.filter(
            (_, idx) => idx !== imageIndex
        );


        setFormData({
            ...formData,
            additionalDetails: updatedAdditionalDetails,
        });
    };


    const handleRemoveColor = (index) => {
        const updatedColors = formData.color.filter((_, i) => i !== index);
        const updatedAdditionalDetails = formData.additionalDetails.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            color: updatedColors,
            additionalDetails: updatedAdditionalDetails,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if all required fields are filled
        if (
            !formData.name ||

            !formData.categoryId ||
            !formData.imageDefault ||
            !formData.originalPrice ||
            !formData.discountedPrice ||
            !formData.imageHover ||
            !formData.productDetails.size ||
            !formData.productDetails.warranty
        ) {
            console.error("All fields are required.");
            doneUpdate(); // Inform user about validation error
            return; // Exit the function early
        }

        const folderName = `Product/${formData.name}`;

        setImageUploading(true);

        try {
            // Upload default and hover images
            const ImageDefault = await uploadToCloudinary(formData.imageDefault, folderName);
            const ImageHover = await uploadToCloudinary(formData.imageHover, folderName);
            console.log("uploaded image", ImageDefault, ImageHover);
            // Map through additionalDetails and upload their images to color-specific folders
            const updatedLeather = { ...formData.leather }; // Create a copy of the leather object to avoid direct mutation

            if (formData.leather.image) {
                const leatherImageUrl = await uploadToCloudinary(formData.leather.image, folderName);
                updatedLeather.image = leatherImageUrl; // Add or update the image property with the uploaded URL
            }

            // Proceed with the rest of your work using updatedLeather
            console.log(updatedLeather, "updatedLeather is this");

            const updatedAdditionalDetails = await Promise.all(
                formData.additionalDetails.map(async (detail) => {
                    if (detail.quantity > 0) {
                        formData.inStock = true;
                    }
                    if (detail.images && detail.images.length > 0) {
                        const colorFolderName = `${folderName}/${detail.color}`; // Folder specific to the color name
                        const uploadedImages = await Promise.all(
                            detail.images.map(async (image) => {
                                console.log("image is this ", image);
                                return await uploadToCloudinary(image, colorFolderName);
                            })
                        );
                        return {
                            ...detail,
                            images: uploadedImages, // Replace local images with uploaded URLs
                        };
                    }
                    return detail; // Return unchanged if no images exist
                })
            );



            // Update formData with uploaded image URLs
            const updatedData = {
                ...formData,
                imageDefault: ImageDefault,
                imageHover: ImageHover,
                additionalDetails: updatedAdditionalDetails,
                leather: updatedLeather
            };

            console.log("Updated data is :", updatedData);

            // Dispatch the action to create the product
            const updateResult = await dispatch(updateProductData({ id, updatedData })).unwrap();

            // Reset the form data
            cancelButtonPressed();
            doneUpdate();
            setImageUploading(false);
            resetId();
        } catch (error) {
            console.error("Error creating product:", error);

            doneUpdate();
            setImageUploading(false);
            resetId();
        }
    };



    const cancelButtonPressed = () => {
        console.log("Cancel button pressed");
        setFormData({
            // Basic Product Information
            barcode: "",
            name: "",
            slug: "",
            category: "", // Set default category ID if necessary
            categoryId: "",
            inStock: true, // Boolean for availability
            onSale: false, // Boolean for sale status

            // Pricing
            originalPrice: "0", // Default numeric value
            discountedPrice: "0", // Default numeric value

            // Images
            imageDefault: null, // URL or file
            imageHover: null, // URL or file
            //leather
            leather: {
                title: [],
                image: null,
            },

            // Colors
            color: [

            ],

            // Additional Details
            additionalDetails: [

            ],

            // Product Details
            productDetails: {
                additionalProductDetails: {

                },
                size: [

                ],
                warranty: "0", // Example: "2 years"
            },

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

    const handleCategorySelect = (categoryName) => {
        setFormData({ ...formData, category: categoryName, categoryId: categories.find((category) => category.name === categoryName).id });
        setIsOpen(false); // Close dropdown after selecting a category
    };

    useEffect(() => {
        console.log("Updated products:", productData); // Logs updated products
    }, [productData]);

    return (
        <>

            <div className="drawer-content">
                <button
                    className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
                    onClick={() => { cancelButtonPressed() }}
                >
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
                                <h4 className="text-xl font-medium dark:text-gray-300">Create Product</h4>
                                <p className="mb-0 text-sm font-normal dark:text-gray-300">Create your Product necessary information from here</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full relative  dark:bg-gray-700 dark:text-gray-200  overflow-hidden h-full  bg-white" >
                        <div className="absolute inset-0  mr-0 mb-0 w-full" >
                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">
                                    {/* product name  */}
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
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    {/* product Barcode  */}
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
                                                className="block w-full px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:border-blue-500"
                                                type="text"
                                                name="barcode"
                                                placeholder="Name"
                                                value={formData.barcode}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* product categories */}
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
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{formData.category}</span>
                                                    <span className="text-gray-500 dark:text-gray-300">▼</span>
                                                </div>

                                                {/* Dropdown List */}
                                                {isOpen && (
                                                    <ul
                                                        ref={dropdownRef}
                                                        className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto"
                                                    >
                                                        {categories.length > 0 ? (
                                                            categories.map((parentCategory) => (
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
                                    {/* Product color section */}
                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                            Product Colors
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            {formData.color.map((color, index) => (
                                                <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
                                                    <div className="grid grid-cols-12 gap-2 mb-2">
                                                        {/* Color Name */}
                                                        <input
                                                            type="text"
                                                            name={`colorName-${index}`}
                                                            placeholder="Color Name"
                                                            className="col-span-4 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                                                            value={color.colorName}
                                                            onChange={(e) => handleColorChange(e, index, "colorName")}
                                                        />

                                                        {/* Hex Code */}
                                                        <input
                                                            type="text"
                                                            name={`hex-${index}`}
                                                            placeholder="Hex Code"
                                                            className="col-span-4 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                                                            value={color.hex}
                                                            onChange={(e) => handleColorChange(e, index, "hex")}
                                                        />

                                                        {/* Available Quantity */}
                                                        <input
                                                            type="text"
                                                            name={`availableQuantity-${index}`}
                                                            placeholder="Quantity"
                                                            className="col-span-3 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                                                            value={color.availableQuantity}
                                                            onChange={(e) => handleColorChange(e, index, "availableQuantity")}
                                                        />

                                                        {/* Remove Color Button */}
                                                        <button
                                                            type="button"
                                                            className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                                                            onClick={() => handleRemoveColor(index)}
                                                        >
                                                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="mx-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                        </button>

                                                    </div>

                                                    {/* Image Upload Section for Color */}
                                                    <div className="mt-4">
                                                        <label

                                                            className="block text-sm text-gray-700 dark:text-gray-400 font-medium mb-1"
                                                        >
                                                            Upload Images for {color.colorName}
                                                        </label>
                                                        <div className="w-full text-center mb-4">
                                                            <label
                                                                htmlFor={`color-image-update-${index}`}
                                                                className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                                            >
                                                                <input
                                                                    id={`color-image-update-${index}`}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={(e) => handleImageUpload(e, index)} // This function is connected for each color
                                                                    style={{ display: "none" }} // Hide the file input
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
                                                                </svg>
                                                                <p className="text-sm">Drag your images here</p>
                                                                <em className="text-xs text-gray-400">
                                                                    (Only *.jpeg, *.webp and *.png images will be accepted)
                                                                </em>
                                                            </label>
                                                        </div>

                                                        {/* Display preview images for the current color only if images exist */}
                                                        {formData.additionalDetails[index]?.images && formData.additionalDetails[index].images.length > 0 && (
                                                            <aside className="flex flex-row flex-wrap mt-4">
                                                                {formData.additionalDetails[index].images.map((image, imgIndex) => (
                                                                    <div key={imgIndex} className="relative inline-flex items-center">
                                                                        <img
                                                                            className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                                            src={
                                                                                image instanceof File
                                                                                    ? URL.createObjectURL(image)
                                                                                    : image
                                                                            }
                                                                            alt={`${color.colorName} Image ${imgIndex + 1}`}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="absolute top-0 right-0 text-red-500 focus:outline-none"
                                                                            onClick={() => handleRemoveImage(index, imgIndex)}
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
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Color Button */}
                                            <button
                                                type="button"
                                                className="mt-2 text-sm text-white bg-primary-500 px-3 py-1 rounded-md hover:bg-primary-600"
                                                onClick={handleAddColor}
                                            >
                                                + Add Color
                                            </button>
                                        </div>
                                    </div>


                                    {/* leather section */}
                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                                        Leather (Image size : 638 x 638)
                                        </label>

                                        <div className="col-span-8 sm:col-span-4">
                                            {formData.leather && (
                                                <>

                                                    {
                                                        formData.leather.image && (
                                                            <div className="col-span-8 sm:col-span-4">
                                                                <div className="w-full text-center mb-4">
                                                                    {/* Label to trigger file upload */}
                                                                    <label
                                                                        htmlFor="image-leather-adding"
                                                                        className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                                                    >
                                                                        <input
                                                                            id="image-leather-adding"
                                                                            type="file"
                                                                            accept="image/*"
                                                                            multiple
                                                                            onChange={handleLeatherImageInputDefault} // Make sure the function is properly attached
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
                                                                {formData.leather.image && (
                                                                    <aside className="flex flex-row flex-wrap mt-4">
                                                                        <div draggable className="relative inline-flex items-center">
                                                                            <img
                                                                                className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                                                src={
                                                                                    formData.leather.image instanceof File
                                                                                        ? URL.createObjectURL(formData.leather.image)
                                                                                        : formData.leather.image
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
                                                        )
                                                    }
                                                    {
                                                        formData.leather.title?.map((title, index) => {
                                                            return ( // Ensure you use 'return' to return the JSX
                                                                <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
                                                                    <div className="grid grid-cols-12 gap-2 mb-2">

                                                                        {/* Available Quantity */}
                                                                        <input
                                                                            type="text"
                                                                            name={`title-${index}`}
                                                                            placeholder="Title"
                                                                            className="col-span-3 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                                                                            value={title}
                                                                            onChange={(e) => handleTitleChange(e, index)}
                                                                        />

                                                                        {/* Remove Color Button */}
                                                                        <button
                                                                            type="button"
                                                                            className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                                                                            onClick={() => handleRemoveTitle(index)}
                                                                        >
                                                                            <svg
                                                                                stroke="currentColor"
                                                                                fill="none"
                                                                                strokeWidth="2"
                                                                                viewBox="0 0 24 24"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                className="mx-auto"
                                                                                height="1em"
                                                                                width="1em"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </>
                                            )}

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








                                    {/* Product Default Images */}
                                    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                                        <label
                                            htmlFor="image-upload"
                                            className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                                        >
                                            Product Default Image
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="w-full text-center mb-4">
                                                {/* Label to trigger file upload */}
                                                <label
                                                    htmlFor="image-default-update"
                                                    className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                                >
                                                    <input
                                                        id="image-default-update"
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
                                            {formData.imageDefault && (
                                                <aside className="flex flex-row flex-wrap mt-4">
                                                    <div draggable className="relative inline-flex items-center">
                                                        <img
                                                            className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                            src={
                                                                formData.imageDefault instanceof File
                                                                    ? URL.createObjectURL(formData.imageDefault)
                                                                    : formData.imageDefault
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
                                            Product Hover Image
                                        </label>
                                        <div className="col-span-8 sm:col-span-4">
                                            <div className="w-full text-center mb-4">
                                                {/* Label to trigger file upload */}
                                                <label
                                                    htmlFor="image-hover-update"
                                                    className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                                                >
                                                    <input
                                                        id="image-hover-update"
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
                                            {formData.imageHover && (
                                                <aside className="flex flex-row flex-wrap mt-4">
                                                    <div draggable className="relative inline-flex items-center">
                                                        <img
                                                            className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                                            src={
                                                                formData.imageHover instanceof File
                                                                    ? URL.createObjectURL(formData.imageHover)
                                                                    : formData.imageHover
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




                                    {/* product price  */}
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
                                                    value={formData.originalPrice}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* product sell price  */}
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
                                                    name="discountedPrice"
                                                    placeholder="Enter Product Price"
                                                    value={formData.discountedPrice}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
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
                                        <button className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-normal focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12" type="submit" disabled={(updateproductLoading || imageUploading)}>

                                            <span> {(updateproductLoading || imageUploading) ? 'Updating...' : 'Update Product'}</span>
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
