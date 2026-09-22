"use client";

import { Skeleton } from "@mui/material";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonSpec {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  className?: string;
}

export interface SkeletonColumn {
  /** Extra classes for the <td> (defaults to "px-4 py-3"). */
  cellClassName?: string;
  /** Wraps the placeholders when a cell holds more than one of them. */
  innerClassName?: string;
  skeletons: SkeletonSpec[];
}

export interface SkeletonTableProps {
  head: SkeletonColumn[];
  row: SkeletonColumn[];
  rows?: number;
  /** The bordered card every admin table except the orders one sits in. */
  bordered?: boolean;
  headClassName?: string;
  bodyClassName?: string;
}

const DEFAULT_HEAD =
  "text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800 overflow-hidden";
const DEFAULT_BODY =
  "bg-white divide-y overflow-hidden divide-gray-100 dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400";

function Cell({ column }: { column: SkeletonColumn }) {
  const placeholders = column.skeletons.map((spec, index) => (
    <Skeleton
      key={index}
      variant={spec.variant ?? "text"}
      width={spec.width}
      height={spec.height}
      className={spec.className}
    />
  ));

  return (
    <td className={cn("px-4 py-3", column.cellClassName)}>
      {column.innerClassName ? <div className={column.innerClassName}>{placeholders}</div> : <Fragment>{placeholders}</Fragment>}
    </td>
  );
}

/** The loading table the admin lists used to each spell out by hand. */
export function SkeletonTable({
  head,
  row,
  rows = 10,
  bordered = true,
  headClassName = DEFAULT_HEAD,
  bodyClassName = DEFAULT_BODY,
}: SkeletonTableProps) {
  const table = (
    <div className="w-full overflow-x-auto">
      <table className="w-full whitespace-no-wrap">
        <thead className={headClassName}>
          <tr>
            {head.map((column, index) => (
              <Cell key={index} column={column} />
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((column, index) => (
                <Cell key={index} column={column} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!bordered) return table;

  return (
    <div className="all_products w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring-1 ring-black ring-opacity-5 mb-8 rounded-b-lg">
      {table}
    </div>
  );
}

export default SkeletonTable;
