import type { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { productService } from "@/services/product.service";
import type { Rating, RatingInput } from "@/types/product";
import { createApiThunk, createRequestSlice, type RequestState } from "../create-request-slice";

export const sendRating = createApiThunk<Rating, RatingInput>("rating/sendRating", (input) =>
  productService.createRating(input),
);
export const getRatingById = createApiThunk<Rating[], string>("rating/getRatingById", (productId) =>
  productService.ratings(productId),
);

type SendState = RequestState<"rating", Rating | null> & { isSuccess: boolean };
const send = createRequestSlice<Rating | null, Rating, RatingInput, SendState>({
  name: "rating",
  thunk: sendRating,
  dataKey: "rating",
  initialData: null,
  initialExtra: { isSuccess: false },
  onPending: (s) => {
    s.isSuccess = false;
  },
  onFulfilled: (s) => {
    s.isSuccess = true;
  },
  onRejected: (s) => {
    s.isSuccess = false;
  },
  reducers: {
    resetRatingState: (s) => {
      s.isLoading = false;
      s.isSuccess = false;
      s.error = null;
    },
  },
});

const byProduct = createRequestSlice<Rating[] | null, Rating[], string, RequestState<"data", Rating[] | null>>({
  name: "getRatingById",
  thunk: getRatingById,
  dataKey: "data",
  initialData: null,
  onPending: (s) => {
    s.data = null;
  },
});

export const resetRatingState = send.actions.resetRatingState as unknown as ActionCreatorWithoutPayload;
export const createRatingReducer = send.reducer;
export const ratingByProductIdReducer = byProduct.reducer;
