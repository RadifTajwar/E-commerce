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
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { useEffect } from "react";

export default function AllParentCategories({ onEdit, onDelete }) {
  const dispatch = useAppDispatch();
  const parentState = useAppSelector((state) => state.allParentCategories);
  const { parentCategories, error } = parentState;
  const busy = isPending(parentState);

  useEffect(() => {
    void dispatch(fetchAllParentCategories());
  }, [dispatch]);

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
              parentCategories?.map((category) => (
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

        {!busy && (!parentCategories || parentCategories.length === 0) && (
          <EmptyState
            title="No parent categories yet"
            description="Parent categories group your product categories in the storefront navigation."
          />
        )}
      </TableWrap>
    </>
  );
}
