import { bannerService } from "@/services/banner.service";
import type { HeroBanner, HeroBannerInput, VideoBanner, VideoBannerInput } from "@/types/banner";
import { createApiThunk, createRequestSlice } from "../create-request-slice";

// ---- hero banners ------------------------------------------------------------
export const fetchAllHeroBanners = createApiThunk<HeroBanner[], void>("heroBanners/fetchAll", () =>
  bannerService.heroList(),
);
export const fetchHeroBannerById = createApiThunk<HeroBanner, string>("heroBanners/fetchById", (id) =>
  bannerService.heroById(id),
);
export const updateHeroBanner = createApiThunk<HeroBanner, { id: string; bannerData: HeroBannerInput }>(
  "heroBanners/update",
  ({ id, bannerData }) => bannerService.heroUpdate(id, bannerData),
);

const heroList = createRequestSlice({
  name: "heroBanners",
  thunk: fetchAllHeroBanners,
  dataKey: "heroBanners",
  initialData: [] as HeroBanner[],
});
const heroById = createRequestSlice({
  name: "heroBannerById",
  thunk: fetchHeroBannerById,
  dataKey: "heroBannerData",
  initialData: null as HeroBanner | null,
});
const heroUpdate = createRequestSlice({
  name: "updateHeroBanner",
  thunk: updateHeroBanner,
  dataKey: "heroBannerData",
  initialData: null as HeroBanner | null,
});

// ---- video banners -----------------------------------------------------------
export const fetchAllVideoBanners = createApiThunk<VideoBanner[], void>("videoBanners/fetchAll", () =>
  bannerService.videoList(),
);
export const fetchVideoBannerById = createApiThunk<VideoBanner, string>("videoBanners/fetchById", (id) =>
  bannerService.videoById(id),
);
export const updateVideoBanner = createApiThunk<VideoBanner, { id: string; bannerData: VideoBannerInput }>(
  "videoBanners/update",
  ({ id, bannerData }) => bannerService.videoUpdate(id, bannerData),
);

const videoList = createRequestSlice({
  name: "videoBanners",
  thunk: fetchAllVideoBanners,
  dataKey: "videoBanners",
  initialData: [] as VideoBanner[],
});
const videoById = createRequestSlice({
  name: "videoBannerById",
  thunk: fetchVideoBannerById,
  dataKey: "videoBannerData",
  initialData: null as VideoBanner | null,
});
const videoUpdate = createRequestSlice({
  name: "updateVideoBanner",
  thunk: updateVideoBanner,
  dataKey: "videoBannerData",
  initialData: null as VideoBanner | null,
});

export const heroBannersReducer = heroList.reducer;
export const heroBannerByIdReducer = heroById.reducer;
export const updateHeroBannerReducer = heroUpdate.reducer;
export const videoBannersReducer = videoList.reducer;
export const videoBannerByIdReducer = videoById.reducer;
export const updateVideoBannerReducer = videoUpdate.reducer;
