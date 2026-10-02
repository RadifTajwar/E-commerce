"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import ImageField from "@/components/admin/ImageField";
import { SQUARE_IMAGE } from "@/lib/image-size";
import { Field, Input, Select } from "@/components/admin/ui";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCategory } from "@/store/slices/category.slice";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  image: null,
  parentCategory: "",
  parentCategoryId: "",
};

export default function AddCategory({ toggleAddProductVisible, doneAddProduct }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);


  const { parentCategories } = useAppSelector((state) => state.allParentCategories);
  const { isLoading: createCategoryLoading } = useAppSelector((state) => state.createNewCategory);

  const previewImage = useObjectUrl(formData.image);

  useEffect(() => {
    dispatch(fetchAllParentCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.parentCategoryId || !formData.image) {
      doneAddProduct("validationError");
      return;
    }

    try {
      const folderName = `Category/${formData.name}`;

      setImageUploading(true);
      const imageUrl = await uploadService.image(formData.image, folderName);
      setImageUploading(false);

      await dispatch(
        createCategory({
          name: formData.name,
          description: formData.description,
          parentCategoryId: formData.parentCategoryId,
          image: imageUrl,
        }),
      ).unwrap();

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

  const handleCategorySelect = (parentCategory) => {
    setFormData((prevData) => ({
      ...prevData,
      parentCategory: parentCategory.name,
      parentCategoryId: parentCategory.id,
    }));
  };

  return (
    <DrawerForm
      title="Create category"
      description="Categories sit under a parent category and hold products."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Create category"
      busyLabel="Creating…"
      isBusy={createCategoryLoading || imageUploading}
    >
      <Field label="Name" htmlFor="category-add-name">
        <Input
          id="category-add-name"
          name="name"
          placeholder="e.g. Ladies site bag"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Field>

      <Field label="Description" htmlFor="category-add-description">
        <Input
          id="category-add-description"
          name="description"
          placeholder="Shown on the category page"
          value={formData.description}
          onChange={handleInputChange}
        />
      </Field>

      <Field
        label="Parent category"
        htmlFor="category-add-parent"
        hint="Which top-level group this category belongs to."
      >
        <Select
          id="category-add-parent"
          value={formData.parentCategoryId}
          onChange={(e) => {
            const hit = parentCategories.find((p) => p.id === e.target.value);
            if (hit) handleCategorySelect(hit);
          }}
        >
          <option value="">Select a parent category</option>
          {parentCategories.map((parentCategory) => (
            <option key={parentCategory.id} value={parentCategory.id}>
              {parentCategory.name}
            </option>
          ))}
        </Select>
      </Field>

      <ImageField
        id="category-add-image"
        spec={SQUARE_IMAGE}
        label="Image"
        preview={previewImage}
        onSelect={(file) => setFormData((prev) => ({ ...prev, image: file }))}
        onClear={() => setFormData((prev) => ({ ...prev, image: null }))}
      />
    </DrawerForm>
  );
}
