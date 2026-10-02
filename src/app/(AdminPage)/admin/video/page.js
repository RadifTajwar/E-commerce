"use client";
import BannerAdminPage from "@/components/admin/BannerAdminPage";
import AllVideoBanners from "@/components/ui/components/admin/video/allVideoBanners";
import UpdateVideoBanner from "@/components/ui/components/admin/video/updateVideoBanner";
import { useAppDispatch } from "@/store/hooks";
import { fetchAllVideoBanners } from "@/store/slices/banner.slice";

export default function VideoBannerPage() {
  const dispatch = useAppDispatch();

  return (
    <BannerAdminPage
      title="Video Banner"
      successMessage="Video Updated Successfully!"
      onUpdated={() => dispatch(fetchAllVideoBanners())}
      List={AllVideoBanners}
      Form={UpdateVideoBanner}
    />
  );
}
