"use client";
import { CircleXIcon } from "@/components/admin/icons";
import { CloseIcon, UploadCloudIcon } from "@/components/ui/icons";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createParentCategory } from "@/store/slices/parent-category.slice";
import { useState } from "react";

const EMPTY_FORM = { name: "", image: null };

export default function AddParentCategory({ toggleAddProductVisible, doneAddProduct }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.createParentCategory);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);

  const previewImage = useObjectUrl(formData.image);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image) {
      doneAddProduct("validationError");
      return;
    }

    try {
      const folderName = `ParentCategory/${formData.name}`;

      setImageUploading(true);
      const imageUrl = await uploadService.image(formData.image, folderName);
      setImageUploading(false);

      await dispatch(createParentCategory({ name: formData.name, image: imageUrl })).unwrap();

      setFormData(EMPTY_FORM);
      doneAddProduct("success");
    } catch (error) {
      setImageUploading(false);
      doneAddProduct("error", error.message);
    }
  };

  const cancelButtonPressed = () => {
    setFormData(EMPTY_FORM);
    toggleAddProductVisible();
  };

  return (
    <div className="addCategory drawer-content">
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
              <h4 className="text-xl font-medium dark:text-gray-300">Create Parent Category</h4>
              <p className="mb-0 text-sm font-normal dark:text-gray-300">
                Create your Parent Category necessary information from here
              </p>
            </div>
          </div>
        </div>
        <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 overflow-hidden h-full bg-white">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="middle_section px-6 pt-8 flex-grow overflow-y-scroll w-full max-h-screen lg:pb-48 md:pb-80 pb-96">
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 flex items-center">
                <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                  Parent Category Title/Name
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
                <label
                  htmlFor="parent-category-image-add-upload"
                  className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                >
                  Parent Category Image
                </label>
                <div className="col-span-8 sm:col-span-4">
                  <div className="w-full text-center mb-4">
                    <label
                      htmlFor="parent-category-image-add-upload"
                      className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                    >
                      <input
                        id="parent-category-image-add-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageInput}
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
                          alt="Parent category"
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
                  disabled={isLoading || imageUploading}
                >
                  <span>{isLoading || imageUploading ? "Creating..." : "Create Parent Category"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
