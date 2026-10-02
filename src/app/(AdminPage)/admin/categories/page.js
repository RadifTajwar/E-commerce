"use client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import AddCategory from "@/components/ui/components/admin/categories/addCategory";
import AllCategories from "@/components/ui/components/admin/categories/allCategories";
import UpdateCategories from "@/components/ui/components/admin/categories/updateCategories";
import { Button, Card, CardBody, Input, PageHeader } from "@/components/admin/ui";
import { PlusIcon } from "@/components/ui/icons";
import { isObjectId } from "@/config/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { notify } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCategoryById, fetchAllCategories, fetchCategoryById } from "@/store/slices/category.slice";
import { useState } from "react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isVisibleAddProduct, setIsVisibleAddProduct] = useState(false);

  const { categoryData } = useAppSelector((state) => state.categoryById);
  const deleteName = categoryData && categoryData.id === deleteId ? categoryData.name : "";

  const refetch = () => dispatch(fetchAllCategories());

  const doneAddProduct = (result, message) => {
    if (result === "success") {
      notify.success("Category Added Successfully!");
      refetch();
      setIsVisibleAddProduct(false);
    } else if (result === "validationError") {
      notify.error("No input field can be empty!");
    } else {
      notify.error(message || "Internal Server Error!");
    }
  };

  const doneUpdate = () => {
    notify.success("Category Updated Successfully!");
    refetch();
  };

  const openUpdate = (id) => setUpdateId(id);
  const closeUpdate = () => setUpdateId(null);

  const openDelete = (id) => {
    setDeleteId(id);
    if (isObjectId(id)) dispatch(fetchCategoryById(id));
  };
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCategoryById(deleteId)).unwrap();
      closeDelete();
      notify.success("Category Deleted Successfully!");
      refetch();
    } catch (error) {
      notify.error(error.message);
    }
  };

  const toggleAddProductVisible = () => setIsVisibleAddProduct((open) => !open);

  return (
    <>
      <PageHeader
        title="Categories"
        description="Product categories, grouped under a parent category."
        actions={
          <Button onClick={toggleAddProductVisible}>
            <PlusIcon className="h-4 w-4" />
            Add category
          </Button>
        }
      />

      <Card className="mb-5 shrink-0">
        <CardBody>
          <Input
            type="search"
            aria-label="Search categories"
            className="max-w-sm"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardBody>
      </Card>

      <AllCategories onEdit={openUpdate} onDelete={openDelete} search={debouncedSearch} />

      <AdminDrawer isOpen={Boolean(updateId)} onClose={closeUpdate}>
        <UpdateCategories
          toggleVisibility={closeUpdate}
          id={updateId}
          resetId={closeUpdate}
          doneUpdate={doneUpdate}
        />
      </AdminDrawer>

      <AdminDrawer isOpen={isVisibleAddProduct} onClose={toggleAddProductVisible}>
        <AddCategory toggleAddProductVisible={toggleAddProductVisible} doneAddProduct={doneAddProduct} />
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
