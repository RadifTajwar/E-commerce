"use client";

import { useRef, useState, type ComponentType } from "react";
import { notify } from "@/lib/toast";
import { PageHeader } from "@/components/admin/ui";
import { AdminDrawer } from "./AdminDrawer";

export interface BannerListProps {
  toggleVisibility: (id: string) => void;
}

export interface BannerFormProps {
  id: string | null;
  toggleVisibility: () => void;
  resetId: () => void;
  doneUpdate: () => void;
}

export interface BannerAdminPageProps {
  title: string;
  description?: string;
  /** Toast shown once the update thunk has actually resolved. */
  successMessage: string;
  /** Refetch the list; runs immediately after a successful update. */
  onUpdated: () => void;
  List: ComponentType<BannerListProps>;
  Form: ComponentType<BannerFormProps>;
}

/**
 * The shell the hero-banner and video-banner screens share: a heading, the
 * list, and the update drawer. Each screen only supplies its own list, form
 * and refetch.
 */
export function BannerAdminPage({ title, description, successMessage, onUpdated, List, Form }: BannerAdminPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const idRef = useRef<string | null>(null);

  const closeDrawer = () => {
    idRef.current = null;
    setIsVisible(false);
  };

  const openDrawer = (id: string) => {
    idRef.current = id;
    setIsVisible(true);
  };

  const doneUpdate = () => {
    notify.success(successMessage);
    onUpdated();
  };

  return (
    <>
      <PageHeader title={title} description={description} />
      <List toggleVisibility={openDrawer} />

      <AdminDrawer isOpen={isVisible} onClose={closeDrawer}>
        <Form id={idRef.current} toggleVisibility={closeDrawer} resetId={closeDrawer} doneUpdate={doneUpdate} />
      </AdminDrawer>
    </>
  );
}

export default BannerAdminPage;
