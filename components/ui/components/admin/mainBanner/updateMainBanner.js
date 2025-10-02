import { fetchHeroBannerById } from "@/redux/heroBanner/heroBannerByIdSlice";
import { updateHeroBanner } from "@/redux/heroBanner/updateHeroBannerSlice";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function updateMainBanner({
  id,
  toggleVisibility,
  resetId,
  doneUpdate,
}) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const parentCategoryRef = useRef(null);
  // Access the category data from the store
  const {
    heroBannerData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useSelector((state) => state.heroBannerById);
  // Access the update category data from the store
  const {
    isLoading: updateCategoryLoading, // Loading state for updating category
    error: updateCategoryError, // Error for updating category
  } = useSelector((state) => state.updateHeroBanners);

  const [imageUploading, setImageUploading] = useState(false);
  // Fetch the category data by ID

  const isValidId = (id) => /^[a-fA-F0-9]{24}$/.test(id); // Checks for valid MongoDB ObjectId format
  //

  // Fetch the category by ID
  useEffect(() => {
    if (id && isValidId(id)) {
      dispatch(fetchHeroBannerById(id));
    }
  }, [id, dispatch]);

  // Populate the form once both categoryData and parentCategories are available
  useEffect(() => {
    if (heroBannerData) {
      setFormData({
        images: heroBannerData.image ? heroBannerData.image : [],
      });
    }
  }, [heroBannerData]);

  const [formData, setFormData] = useState({
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Cloudinary
      const folderName = `Banner`;

      setImageUploading(true);

      // Upload images starting from index 2
      const imagesToUpload = formData.images.slice(2); // Get images starting from index 2
      const uploadedImages = await Promise.all(
        imagesToUpload.map(async (image) => {
          // Upload each image to Cloudinary
          const uploadedImage = await uploadToCloudinary(image, folderName);
          return uploadedImage; // Return the uploaded image URL
        })
      );

      // Replace the local images with the uploaded image URLs
      formData.images = [
        ...formData.images.slice(0, 2), // Keep the first two images unchanged
        ...uploadedImages, // Append the uploaded images
      ];

      setImageUploading(false);

      // Prepare the final data for the backend
      const bannerData = {
        header: heroBannerData.header,
        image: formData.images,
        title: formData.title, // Replace the file with the uploaded image URL
      };

      // Dispatch the action to create a new category
      const updateResult = await dispatch(
        updateHeroBanner({ id, bannerData })
      ).unwrap();

      // Reset the form data
      setFormData({
        images: [],
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
      images: [],
    });
    resetId();
    toggleVisibility();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Update formData to include the new file(s)
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleRemoveImage = (imgIndex) => {
    setFormData((prevData) => {
      const updatedImages = prevData.images.filter(
        (_, index) => index !== imgIndex
      );
      return {
        ...prevData,
        images: updatedImages,
      };
    });
  };

  return (
    <>
      <div className="updateCategory drawer-content">
        <button
          className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
          onClick={() => {
            cancelButtonPressed();
          }}
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

        <div className="flex flex-col w-full h-screen justify-between">
          <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 min-h-0">
            <div className="flex md:flex-row flex-col justify-between mr-20">
              <div>
                <h4 className="text-xl font-medium dark:text-gray-300">
                  Update Banner
                </h4>
                <p className="mb-0 text-sm font-normal dark:text-gray-300">
                  Update your Banner necessary information from here
                </p>
              </div>
            </div>
          </div>
          <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 overflow-hidden h-full bg-white">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96 ">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Product Images
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="bg-gray-50 border rounded-md p-4 mb-4">
                      <div className="mt-4">
                        <div className="w-full text-center mb-4">
                          <label
                            htmlFor={`banner-image-update`}
                            className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                          >
                            <input
                              id={`banner-image-update`}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleImageUpload(e)}
                              style={{ display: "none" }}
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
                              (Only *.jpeg, *.webp and *.png images will be
                              accepted)
                            </em>
                          </label>
                        </div>

                        <aside className="flex flex-row flex-wrap mt-4">
                          {formData.images.slice(2).map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative inline-flex items-center"
                            >
                              <img
                                className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                                src={
                                  image instanceof File
                                    ? URL.createObjectURL(image)
                                    : image
                                } // File object or URL
                                alt={`Image ${imgIndex}`}
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 text-red-500 focus:outline-none"
                                onClick={() => handleRemoveImage(imgIndex + 2)} // Correct index to pass (add 2 to account for slice)
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom_section absolute z-10 bottom-0 w-full right-0 pt-4 pb-32 lg:pb-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150  focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 focus:outline-none rounded-lg border border-gray-200 px-4 w-full mr-3 flex items-center justify-center cursor-pointer h-12 bg-gray-200 h-12  w-full text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700 font-normal"
                    type="button"
                    onClick={cancelButtonPressed}
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-normal focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12"
                    type="submit"
                    disabled={updateCategoryLoading || imageUploading}
                  >
                    <span>
                      {" "}
                      {updateCategoryLoading || imageUploading
                        ? "Updating..."
                        : "Update Category"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
