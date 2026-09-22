"use client";
import { CircleXIcon } from "@/components/admin/icons";
import { CloseIcon, UploadCloudIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHeroBannerById, updateHeroBanner } from "@/store/slices/banner.slice";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  image: null,
  image2: null,
  title: [],
  images: [],
};

export default function UpdateBanner({ id, toggleVisibility, resetId, doneUpdate }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);

  const { heroBannerData } = useAppSelector((state) => state.heroBannerById);
  const { isLoading: updateBannerLoading } = useAppSelector((state) => state.updateHeroBanners);

  const previewImage = useObjectUrl(formData.image);
  const previewImage2 = useObjectUrl(formData.image2);

  useEffect(() => {
    if (id && isObjectId(id)) {
      dispatch(fetchHeroBannerById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (heroBannerData) {
      setFormData({
        name: heroBannerData.header || "",
        image: heroBannerData.image?.[0] || null,
        image2: heroBannerData.image?.[1] || null,
        title: heroBannerData.title || [],
        images: heroBannerData.image || [],
      });
    }
  }, [heroBannerData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageInputDefault = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleImageInputHover = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prevData) => ({ ...prevData, image2: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image || !formData.image2) {
      notify.error("Header and both banner images are required.");
      return;
    }

    try {
      const folderName = "Banner";

      setImageUploading(true);
      const imageUrl = await uploadService.image(formData.image, folderName);
      const imageUrl2 = await uploadService.image(formData.image2, folderName);
      setImageUploading(false);

      const updatedImages = [...formData.images];
      updatedImages[0] = imageUrl;
      updatedImages[1] = imageUrl2;

      const bannerData = {
        header: formData.name,
        image: updatedImages,
        title: formData.title,
      };

      await dispatch(updateHeroBanner({ id, bannerData })).unwrap();

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

  const handleAddTitle = () => {
    setFormData((prev) => ({ ...prev, title: [...prev.title, ""] }));
  };

  const handleRemoveTitle = (index) => {
    setFormData((prev) => ({ ...prev, title: prev.title.filter((_, i) => i !== index) }));
  };

  const handleTitleChange = (e, index) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedTitle = [...prev.title];
      updatedTitle[index] = value;
      return { ...prev, title: updatedTitle };
    });
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
              <h4 className="text-xl font-medium dark:text-gray-300">Update Banner</h4>
              <p className="mb-0 text-sm font-normal dark:text-gray-300">
                Update your Banner necessary information from here
              </p>
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

              {/* Banner Image 1 */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label
                  htmlFor="image-1-banner"
                  className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                >
                  Banner Image 1
                </label>
                <div className="col-span-8 sm:col-span-4">
                  <div className="w-full text-center mb-4">
                    <label
                      htmlFor="image-1-banner"
                      className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                    >
                      <input
                        id="image-1-banner"
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputDefault}
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
                          alt="Banner 1"
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

              {/* Banner Image 2 */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label
                  htmlFor="image-2-banner"
                  className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium"
                >
                  Banner Image 2
                </label>
                <div className="col-span-8 sm:col-span-4">
                  <div className="w-full text-center mb-4">
                    <label
                      htmlFor="image-2-banner"
                      className="flex flex-col items-center border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 py-4"
                    >
                      <input
                        id="image-2-banner"
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputHover}
                        style={{ display: "none" }}
                      />
                      <UploadCloudIcon className="text-3xl text-blue-500 mb-2 h-[1em] w-[1em]" />
                      <p className="text-sm">Drag your images here</p>
                      <em className="text-xs text-gray-400">
                        (Only *.jpeg, *.webp and *.png images will be accepted)
                      </em>
                    </label>
                  </div>

                  {previewImage2 && (
                    <aside className="flex flex-row flex-wrap mt-4">
                      <div draggable className="relative inline-flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 m-2"
                          src={previewImage2}
                          alt="Banner 2"
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          className="absolute top-0 right-0 text-red-500 focus:outline-none"
                          onClick={() => setFormData((prev) => ({ ...prev, image2: null }))}
                        >
                          <CircleXIcon />
                        </button>
                      </div>
                    </aside>
                  )}
                </div>
              </div>

              {/* Banner titles */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <label className="block text-sm text-gray-700 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                  Banner Title
                </label>
                <div className="col-span-8 sm:col-span-4">
                  {formData.title.map((titleLine, index) => (
                    <div key={index} className="bg-gray-50 border rounded-md p-4 mb-4">
                      <div className="grid grid-cols-12 gap-2 mb-2">
                        <input
                          type="text"
                          name={`titleName-${index}`}
                          placeholder="Title line"
                          className="col-span-11 px-3 py-1 rounded-md border border-gray-300 focus:border-purple-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:ring focus:ring-purple-300 text-sm"
                          value={titleLine}
                          onChange={(e) => handleTitleChange(e, index)}
                        />

                        <button
                          type="button"
                          aria-label="Remove title"
                          className="col-span-1 text-red-600 hover:text-red-800 bg-white shadow-md rounded-full w-10 h-10 "
                          onClick={() => handleRemoveTitle(index)}
                        >
                          <CloseIcon className="mx-auto h-[1em] w-[1em]" />
                        </button>
                      </div>
                    </div>
                  ))}

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
                  disabled={updateBannerLoading || imageUploading}
                >
                  <span>{updateBannerLoading || imageUploading ? "Updating..." : "Update Banner"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
