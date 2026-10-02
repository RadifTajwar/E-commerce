export interface HeroBanner {
  _id: string;
  id?: string;
  header?: string;
  title?: string;
  /** Image URLs; the storefront reads index 0 and 1 for the pair. */
  image: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroBannerInput {
  header?: string;
  title?: string;
  image: string[];
}

export interface VideoBanner {
  _id: string;
  id?: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoBannerInput {
  url: string;
}
