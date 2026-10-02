"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import ImageField from "@/components/admin/ImageField";
import { SQUARE_IMAGE } from "@/lib/image-size";
import { Field, Input, Select } from "@/components/admin/ui";
import { isObjectId } from "@/config/constants";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCategoryById, updateCategoryData } from "@/store/slices/category.slice";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  image: null,
  parentCategory: "",
  parentCategoryId: "",
};

export default function UpdateCategories({ id, toggleVisibility, resetId, doneUpdate }) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageUploading, setImageUploading] = useState(false);


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
  };

  return (
    <DrawerForm
      title="Edit category"
      description="Update this category's details."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      busyLabel="Saving…"
      isBusy={updateCategoryLoading || imageUploading}
    >
      <Field label="Name" htmlFor="category-edit-name">
        <Input
          id="category-edit-name"
          name="name"
          placeholder="e.g. Ladies site bag"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Field>

      <Field label="Description" htmlFor="category-edit-description">
        <Input
          id="category-edit-description"
          name="description"
          placeholder="Shown on the category page"
          value={formData.description}
          onChange={handleInputChange}
        />
      </Field>

      <Field
        label="Parent category"
        htmlFor="category-edit-parent"
        hint="Which top-level group this category belongs to."
      >
        <Select
          id="category-edit-parent"
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
        id="category-edit-image"
        spec={SQUARE_IMAGE}
        label="Image"
        preview={previewImage}
        onSelect={(file) => setFormData((prev) => ({ ...prev, image: file }))}
        onClear={() => setFormData((prev) => ({ ...prev, image: null }))}
      />
    </DrawerForm>
  );
}
