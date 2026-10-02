"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import ImageField from "@/components/admin/ImageField";
import { BANNER_IMAGE } from "@/lib/image-size";
import { Field, Input } from "@/components/admin/ui";
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

  return (
    <DrawerForm
      title="Edit hero banner"
      description="The carousel at the top of the storefront."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      busyLabel="Saving…"
      isBusy={updateBannerLoading || imageUploading}
    >
      <Field label="Header" htmlFor="hero-banner-header">
        <Input
          id="hero-banner-header"
          name="name"
          placeholder="Headline shown over the banner"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <ImageField
          id="hero-banner-image-1"
          spec={BANNER_IMAGE}
          label="Banner image 1"
          preview={previewImage ?? formData.images?.[0]}
          onSelect={(file) => setFormData((prev) => ({ ...prev, image: file }))}
          onClear={() => setFormData((prev) => ({ ...prev, image: null }))}
        />
        <ImageField
          id="hero-banner-image-2"
          spec={BANNER_IMAGE}
          label="Banner image 2"
          preview={previewImage2 ?? formData.images?.[1]}
          onSelect={(file) => setFormData((prev) => ({ ...prev, image2: file }))}
          onClear={() => setFormData((prev) => ({ ...prev, image2: null }))}
        />
      </div>
    </DrawerForm>
  );
}
