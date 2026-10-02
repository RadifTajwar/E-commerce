"use client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AddParentCategory from "@/components/ui/components/admin/parentCategories/addParentCategory";
import AllParentCategories from "@/components/ui/components/admin/parentCategories/allParentCategories";
import UpdateParentCategories from "@/components/ui/components/admin/parentCategories/updateParentCategories";
import { Button, PageHeader } from "@/components/admin/ui";
import { PlusIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { notify } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteParentCategoryById,
  fetchAllParentCategories,
  fetchParentCategoryById,
} from "@/store/slices/parent-category.slice";
import { useState } from "react";

export default function ParentCategoriesPage() {
  const dispatch = useAppDispatch();

  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);

  const { parentCategoryData } = useAppSelector((state) => state.parentCategoryById);
  const deleteName = parentCategoryData && parentCategoryData.id === deleteId ? parentCategoryData.name : "";

  const refetch = () => dispatch(fetchAllParentCategories());

  const doneAddProduct = (result, message) => {
    if (result === "success") {
      notify.success("Parent Category Added Successfully!");
      refetch();
      setIsVisibleAddProduct(false);
    } else if (result === "validationError") {
      notify.error("No input field can be empty!");
    } else {
      notify.error(message || "Internal Server Error!");
      setIsVisibleAddProduct(false);
    }
  };

  const doneUpdate = () => {
    notify.success("Parent Category Updated Successfully!");
    refetch();
  };

  const openUpdate = (id) => setUpdateId(id);
  const closeUpdate = () => setUpdateId(null);

  const openDelete = (id) => {
    setDeleteId(id);
    if (isObjectId(id)) dispatch(fetchParentCategoryById(id));
  };
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteParentCategoryById(deleteId)).unwrap();
      closeDelete();
      notify.success("Parent Category Deleted Successfully!");
      refetch();
    } catch (error) {
      notify.error(error.message);
    }
  };

  const toggleAddProductVisible = () => setIsVisibleAddProduct((open) => !open);

  return (
    <>
      <PageHeader
        title="Parent categories"
        description="Top-level groups shown in the storefront navigation."
        actions={
          <Button onClick={toggleAddProductVisible}>
            <PlusIcon className="h-4 w-4" />
            Add parent category
          </Button>
        }
      />

      <AllParentCategories onEdit={openUpdate} onDelete={openDelete} />

      <AdminDrawer isOpen={Boolean(updateId)} onClose={closeUpdate}>
        <UpdateParentCategories
          toggleVisibility={closeUpdate}
          id={updateId}
          resetId={closeUpdate}
          doneUpdate={doneUpdate}
        />
      </AdminDrawer>

      <AdminDrawer isOpen={isVisibleAddProduct} onClose={toggleAddProductVisible}>
        <AddParentCategory toggleAddProductVisible={toggleAddProductVisible} doneAddProduct={doneAddProduct} />
      </AdminDrawer>

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteId)}
        name={deleteName}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
