"use client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AddParentCategory from "@/components/ui/components/admin/parentCategories/addParentCategory";
import AllParentCategories from "@/components/ui/components/admin/parentCategories/allParentCategories";
import UpdateParentCategories from "@/components/ui/components/admin/parentCategories/updateParentCategories";
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
      <div className=" max-w-2xl md:max-w-3xl lg:max-w-7xl grid px-6 mx-auto overflow-x-auto">
        <h1 className="my-6 text-lg font-bold text-gray-700 dark:text-gray-300">Parent Categories</h1>

        <div className="min-w-0  border border-gray-200 rounded-lg ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 shadow-xs mb-5">
          <div className="p-4">
            <form className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex" onSubmit={(e) => e.preventDefault()}>
              <div className="lg:flex md:flex   md:w-full md:justify-end flex-grow-0">
                <div className="w-full md:w-48 lg:w-48 xl:w-48">
                  <button
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full h-12"
                    type="button"
                    onClick={toggleAddProductVisible}
                  >
                    <span className="mr-2">
                      <PlusIcon className="h-[1em] w-[1em]" />
                    </span>
                    Add Parent Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <AllParentCategories onEdit={openUpdate} onDelete={openDelete} />
      </div>

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
