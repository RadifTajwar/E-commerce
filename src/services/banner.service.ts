import { API } from "@/config/constants";
import type { ApiEnvelope } from "@/types/api";
import type { HeroBanner, HeroBannerInput, VideoBanner, VideoBannerInput } from "@/types/banner";
import { http, unwrap } from "./_shared";

export const bannerService = {
  heroList: () => http.get<ApiEnvelope<HeroBanner[]>>(API.heroBanners).then(unwrap),
  heroById: (id: string) => http.get<ApiEnvelope<HeroBanner>>(API.heroBanner(id)).then(unwrap),
  heroUpdate: (id: string, input: HeroBannerInput) =>
    http.patch<ApiEnvelope<HeroBanner>>(API.heroBanner(id), input).then(unwrap),

  videoList: () => http.get<ApiEnvelope<VideoBanner[]>>(API.videoBanners).then(unwrap),
  videoById: (id: string) => http.get<ApiEnvelope<VideoBanner>>(API.videoBanner(id)).then(unwrap),
  videoUpdate: (id: string, input: VideoBannerInput) =>
    http.patch<ApiEnvelope<VideoBanner>>(API.videoBanner(id), input).then(unwrap),
};
