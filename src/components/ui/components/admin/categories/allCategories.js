"use client";
import RowActions from "@/components/admin/RowActions";
import TableSkeletonRows from "@/components/admin/TableSkeletonRows";
import Thumb from "@/components/admin/Thumb";
import {
  Card,
  CardBody,
  EmptyState,
  Mono,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { isPending } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllCategories } from "@/store/slices/category.slice";
import { useEffect, useMemo } from "react";

export default function AllCategories({ onEdit, onDelete, search = "" }) {
  const dispatch = useAppDispatch();
  const categoriesState = useAppSelector((state) => state.categories);
  const { categories, error } = categoriesState;
  const busy = isPending(categoriesState);

  useEffect(() => {
    void dispatch(fetchAllCategories());
  }, [dispatch]);

  // `fetchAllCategories` takes no arguments, so the search box narrows the
  // already-loaded list instead of firing a request per keystroke.
  const visibleCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) => (category.name || "").toLowerCase().includes(term));
  }, [categories, search]);

  return (
    <>
      {error && !busy && (
        <Card className="mb-5 shrink-0 border-red-200 dark:border-red-900/50">
          <CardBody className="text-sm text-red-600 dark:text-red-400">{error}</CardBody>
        </Card>
      )}

      <TableWrap>
        <Table>
          <THead>
            <TR>
              <TH>Icon</TH>
              <TH>Name</TH>
              <TH>ID</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {busy && <TableSkeletonRows columns={4} />}
            {!busy &&
              visibleCategories?.map((category) => (
                <TR key={category.id}>
                  <TD>
                    <Thumb src={category.image} alt={category.name} />
                  </TD>
                  <TD className="font-medium text-slate-900 dark:text-white">{category.name}</TD>
                  <TD>
                    <Mono>{category.id}</Mono>
                  </TD>
                  <TD align="right">
                    <RowActions
                      label={category.name}
                      onEdit={() => onEdit(category.id)}
                      onDelete={() => onDelete(category.id)}
                    />
                  </TD>
                </TR>
              ))}
          </TBody>
        </Table>

        {!busy && (!visibleCategories || visibleCategories.length === 0) && (
          <EmptyState
            title={search ? "No categories match that search" : "No categories yet"}
            description={
              search
                ? "Try a different name."
                : "Categories sit under a parent category and hold your products."
            }
          />
        )}
      </TableWrap>
    </>
  );
}
