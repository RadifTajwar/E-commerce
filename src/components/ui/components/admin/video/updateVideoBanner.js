"use client";
import DrawerForm from "@/components/admin/DrawerForm";
import { Label } from "@/components/admin/ui";
import { isObjectId } from "@/config/constants";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { notify } from "@/lib/toast";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVideoBannerById, updateVideoBanner } from "@/store/slices/banner.slice";
import { useEffect, useState } from "react";

export default function UpdateVideoBanner({ id, toggleVisibility, resetId, doneUpdate }) {
  const dispatch = useAppDispatch();
  const [video, setVideo] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  const { videoBannerData } = useAppSelector((state) => state.videoBannerById);
  const { isLoading: updateVideoLoading } = useAppSelector((state) => state.updateVideoBanners);

  const previewVideo = useObjectUrl(video);

  useEffect(() => {
    if (id && isObjectId(id)) {
      dispatch(fetchVideoBannerById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (videoBannerData) {
      setVideo(videoBannerData.url || null);
    }
  }, [videoBannerData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      notify.error("A video file is required.");
      return;
    }

    try {
      setVideoUploading(true);
      const url = await uploadService.video(video, "Video");
      setVideoUploading(false);

      await dispatch(updateVideoBanner({ id, bannerData: { url } })).unwrap();

      setVideo(null);
      doneUpdate();
      resetId();
      toggleVisibility();
    } catch (error) {
      setVideoUploading(false);
      notify.error(error.message);
    }
  };

  const cancelButtonPressed = () => {
    setVideo(null);
    resetId();
    toggleVisibility();
  };

  return (
    <DrawerForm
      title="Edit video banner"
      description="The video that plays in the storefront's feature section."
      onClose={cancelButtonPressed}
      onSubmit={handleSubmit}
      submitLabel="Save changes"
      busyLabel="Saving…"
      isBusy={updateVideoLoading || videoUploading}
    >
      <div>
        <Label htmlFor="video-banner">Banner video</Label>
        <label
          htmlFor="video-banner"
          className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-8 text-center transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
        >
          <input
            id="video-banner"
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setVideo(file);
              e.target.value = "";
            }}
          />
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24" className="mb-2 text-slate-400" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </svg>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload a video</p>
          <p className="mt-0.5 text-xs text-slate-400">MP4, WebM or OGG</p>
        </label>

        {previewVideo && (
          <video
            src={previewVideo}
            controls
            className="mt-4 w-full max-w-sm rounded-lg border border-slate-200 dark:border-slate-700"
          />
        )}
      </div>
    </DrawerForm>
  );
}
