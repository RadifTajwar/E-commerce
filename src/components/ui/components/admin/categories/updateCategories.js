"use client";
import { CircleXIcon } from "@/components/admin/icons";
import { CloseIcon, UploadCloudIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoryById, updateCategoryData } from "@/store/slices/category.slice";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  image: null,
  parentCategory: "",
  parentCategoryId: "",
};

export default function UpdateCategories({ id, toggleVisibility, resetId, doneUpdate }) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);

  const toggleRef = useRef(null);
  const listRef = useRef(null);
  const dropdownRefs = useMemo(() => [toggleRef, listRef], []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRefs, closeDropdown, isOpen);

  const { categoryData } = useAppSelector((state) => state.categoryById);
  const { isLoading: updateCategoryLoading } = useAppSelector((state) => state.updateCategoryData);
  const { parentCategories } = useAppSelector((state) => state.allParentCategories);

  const previewImage = useObjectUrl(formData.image);

  useEffect(() => {
    if (id && isObjectId(id)) {
      dispatch(fetchCategoryById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchAllParentCategories());
  }, [dispatch]);

  // Fill the form once the category and the parent list are both available.
  useEffect(() => {
    if (categoryData && parentCategories.length > 0) {
      const matchingParentCategory = parentCategories.find(
        (parentCategory) => parentCategory.id === categoryData.parentCategoryId,
      );

      setFormData({
        name: categoryData.name || "",
        description: categoryData.description || "",
        image: categoryData.image || null,
        parentCategory: matchingParentCategory?.name || parentCategories[0]?.name || "",
        parentCategoryId: matchingParentCategory?.id || parentCategories[0]?.id || "",
      });
    }
  }, [categoryData, parentCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.parentCategoryId || !formData.image) {
      notify.error("No input field can be empty!");
      return;
    }

    try {
      const folderName = `Category/${formData.name}`;

      setImageUploading(true);
      const imageUrl = await uploadService.image(formData.image, folderName);
      setImageUploading(false);

      await dispatch(
        updateCategoryData({
          id,
          categoryData: {
            name: formData.name,
            description: formData.description,
            parentCategoryId: formData.parentCategoryId,
            image: imageUrl,
          },
        }),
      ).unwrap();

      setFormData(EMPTY_FORM);
      doneUpdate();
      resetId();
      toggleVisibility();
    } catch (error) {
      setImageUploading(false);
      notify.error(error.message);
    }
  };

  const cancelButtonPressed = () => {
    setFormData(EMPTY_FORM);
    resetId();
    toggleVisibility();
  };

  const handleCategorySelect = (parentCategory) => {
    setFormData((prevData) => ({
      ...prevData,
      parentCategory: parentCategory.name,
      parentCategoryId: parentCategory.id,
    }));
    setIsOpen(false);
  };

  return (
    <div className="updateCategory drawer-content">
      <button
        className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
        type="button"
        aria-label="Close"
        onClick={cancelButtonPressed}
      >
        <CloseIcon className="mx-auto h-[1em] w-[1em]" />
      </button>

      <div className="flex flex-col w-full h-screen justify-between">
        <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 min-h-0">
          <div className="flex md:flex-row flex-col justify-between mr-20">
            <div>
              <h4 className="text-xl font-medium dark:text-gray-300">Update Category</h4>
              <p className="mb-0 text-sm font-normal dark:text-gray-300">
                Update your Category necessary information from here
              </p>
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
                >
                  Category
                </label>
                <div className="col-span-6 sm:col-span-4">
                  <div className="relative">
                    <div
                      ref={toggleRef}
                      className="parentCategory flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                      onClick={() => setIsOpen((open) => !open)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{formData.parentCategory}</span>
                      <span className="text-gray-500 dark:text-gray-300">▼</span>
                    </div>

                    {isOpen && (
                      <ul
                        ref={listRef}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto"
                      >
                        {parentCategories.length > 0 ? (
                          parentCategories.map((parentCategory) => (
                            <li key={parentCategory.id}>
                              <button
                                type="button"
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={() => handleCategorySelect(parentCategory)}
                              >
                                {parentCategory.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>
                            <span className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                              No Categories Available
                            </span>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label
                  htmlFor="category-image-update-upload"
                  className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                >
                  Category Image
                </label>
                <div className="col-span-8 sm:col-span-4">
                  <div className="w-full text-center mb-4">
                    <label
                      htmlFor="category-image-update-upload"
                      className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                    >
                      <input
                        id="category-image-update-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                      <UploadCloudIcon className="text-3xl text-blue-500 mb-2 h-[1em] w-[1em]" />
                      <p className="text-sm">Drag your images here</p>
                      <em className="text-xs text-gray-400">
                        (Only *.jpeg, *.webp and *.png images will be accepted)
                      </em>
                    </label>
                  </div>
                  {previewImage && (
                    <aside className="flex flex-row flex-wrap mt-4">
                      <div draggable className="relative inline-flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                          src={previewImage}
                          alt="Category"
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          className="absolute top-0 right-0 text-red-500 focus:outline-none"
                          onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                        >
                          <CircleXIcon />
                        </button>
                      </div>
                    </aside>
                  )}
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
                  <span>{updateCategoryLoading || imageUploading ? "Updating..." : "Update Category"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
