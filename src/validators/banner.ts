import { z } from "zod";
import { urlString } from "./common";

export const heroBannerUpdateSchema = z
  .object({
    header: z.string().max(200).optional(),
    title: z.string().max(200).optional(),
    image: z.array(urlString).min(1).max(10),
  })
  .passthrough();

export const videoBannerUpdateSchema = z.object({
  url: urlString,
});
