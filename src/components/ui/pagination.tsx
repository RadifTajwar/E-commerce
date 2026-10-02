import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as React from "react";

type NavProps = React.ComponentPropsWithoutRef<"nav">;
type UlProps = React.ComponentPropsWithoutRef<"ul">;
type LiProps = React.ComponentPropsWithoutRef<"li">;
type SpanProps = React.ComponentPropsWithoutRef<"span">;

const Pagination = ({ className, ...props }: NavProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, UlProps>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, LiProps>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

// Renders an <a> when it links somewhere and a real <button> otherwise, so
// handlers and aria-disabled land on an element that can carry them.
type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  /** With an href it renders an <a>; without one, a real <button>. */
  href?: string;
} & React.ComponentPropsWithoutRef<"button"> &
  Omit<React.ComponentPropsWithoutRef<"a">, "type">;

const PaginationLink = ({ className, isActive, size = "icon", href, ...props }: PaginationLinkProps) => {
  const classes = cn(buttonVariants({
    variant: isActive ? "outline" : "ghost",
    size,
  }), className)

  if (href === undefined) {
    return (
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        className={classes}
        {...props} />
    )
  }

  return (
    <a
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={classes}
      {...props} />
  )
}
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}>
    <ChevronLeftIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: SpanProps) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <DotsHorizontalIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
};

