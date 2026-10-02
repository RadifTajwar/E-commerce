"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import ImageField from "@/components/admin/ImageField";
import { SQUARE_IMAGE } from "@/lib/image-size";
import { Field, Input } from "@/components/admin/ui";
import { isObjectId } from "@/config/constants";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchParentCategoryById, updateParentCategoryData } from "@/store/slices/parent-category.slice";
import { useEffect, useState } from "react";

const EMPTY_FORM = { name: "", image: null };

export default function UpdateParentCategories({ id, toggleVisibility, resetId, doneUpdate }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);

  const { parentCategoryData } = useAppSelector((state) => state.parentCategoryById);
  const { isLoading: updateCategoryLoading } = useAppSelector((state) => state.updateParentcategoryData);

  const previewImage = useObjectUrl(formData.image);

  useEffect(() => {
    if (id && isObjectId(id)) {
      dispatch(fetchParentCategoryById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (parentCategoryData) {
      setFormData({
        name: parentCategoryData.name || "",
        image: parentCategoryData.image || null,
      });
    }
  }, [parentCategoryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.image) {
      notify.error("No input field can be empty!");
      return;
    }

    try {
      const folderName = `ParentCategory/${formData.name}`;

      setImageUploading(true);
      const imageUrl = await uploadService.image(formData.image, folderName);
      setImageUploading(false);

      await dispatch(
        updateParentCategoryData({ id, categoryData: { name: formData.name, image: imageUrl } }),
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

  return (
    <DrawerForm
      title="Edit parent category"
      description="Update the name or image for this group."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      busyLabel="Saving…"
      isBusy={updateCategoryLoading || imageUploading}
    >
      <Field label="Name" htmlFor="parent-category-name-edit">
        <Input
          id="parent-category-name-edit"
          name="name"
          placeholder="e.g. Women handbag"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Field>

      <ImageField
        id="parent-category-image-edit-upload"
        spec={SQUARE_IMAGE}
        label="Image"
        preview={previewImage}
        onSelect={(file) => setFormData((prev) => ({ ...prev, image: file }))}
        onClear={() => setFormData((prev) => ({ ...prev, image: null }))}
      />
    </DrawerForm>
  );
}
