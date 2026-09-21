"use client";

import { useEffect, useState } from "react";

/**
 * Object URL for a File/Blob preview, revoked automatically when the value
 * changes or the component unmounts. Strings (already-uploaded URLs) pass through.
 */
export function useObjectUrl(source: File | Blob | string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setUrl(null);
      return;
    }
    if (typeof source === "string") {
      setUrl(source);
      return;
    }
    const objectUrl = URL.createObjectURL(source);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [source]);

  return url;
}
