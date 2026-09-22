"use client";
import BannerAdminPage from "@/components/admin/BannerAdminPage";
import AllHeroBanners from "@/components/ui/components/admin/heroBanner/allHeroBanners";
import UpdateBanner from "@/components/ui/components/admin/heroBanner/updateBanner";
import { useAppDispatch } from "@/store/hooks";
import { fetchAllHeroBanners } from "@/store/slices/banner.slice";

export default function HeroBannerPage() {
  const dispatch = useAppDispatch();

  return (
    <BannerAdminPage
      title="Hero Banner"
      successMessage="Hero Banner Updated Successfully!"
      onUpdated={() => dispatch(fetchAllHeroBanners())}
      List={AllHeroBanners}
      Form={UpdateBanner}
    />
  );
}
