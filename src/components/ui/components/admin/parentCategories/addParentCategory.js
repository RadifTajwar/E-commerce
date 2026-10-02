"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import ImageField from "@/components/admin/ImageField";
import { SQUARE_IMAGE } from "@/lib/image-size";
import { Field, Input } from "@/components/admin/ui";
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
    <DrawerForm
      title="Create parent category"
      description="A top-level group shown in the storefront navigation."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Create parent category"
      busyLabel="Creating…"
      isBusy={isLoading || imageUploading}
    >
      <Field label="Name" htmlFor="parent-category-name">
        <Input
          id="parent-category-name"
          name="name"
          placeholder="e.g. Women handbag"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Field>

      <ImageField
        id="parent-category-image-add-upload"
        spec={SQUARE_IMAGE}
        label="Image"
        preview={previewImage}
        onSelect={(file) => setFormData((prev) => ({ ...prev, image: file }))}
        onClear={() => setFormData((prev) => ({ ...prev, image: null }))}
      />
    </DrawerForm>
  );
}
