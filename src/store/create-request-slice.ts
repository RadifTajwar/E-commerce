import {
  createAsyncThunk,
  createSlice,
  type AsyncThunk,
  type SliceCaseReducers,
  type SliceSelectors,
  type ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { getErrorMessage } from "@/lib/api/errors";

/**
 * Helpers that replace the 33 hand-written request slices with one factory
 * while keeping the exact state shape components read:
 *   { [dataKey]: data, isLoading, error, successMessage, ...extra }
 */

export type ThunkConfig = { rejectValue: string };

/** A thunk that calls a service and rejects with a plain error message string. */
export function createApiThunk<Returned, Arg = void>(type: string, fn: (arg: Arg) => Promise<Returned>) {
  return createAsyncThunk<Returned, Arg, ThunkConfig>(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });
}

export interface RequestStateBase {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  /**
   * False until the first request for this slice finishes (either way).
   *
   * Without it "not fetched yet" and "fetched, came back empty" look identical,
   * so a page renders its empty state for a frame before the effect that starts
   * the fetch has even run — the flash of "no orders" before the spinner.
   */
  settled: boolean;
}

export type RequestState<K extends string, TData> = RequestStateBase & { [key in K]: TData };

export interface RequestSliceOptions<K extends string, TData, TResult, TArg, TExtra extends object> {
  name: string;
  thunk: AsyncThunk<TResult, TArg, ThunkConfig>;
  /** Name of the field holding the data, e.g. "categories" → state.categories. */
  dataKey: K;
  initialData: TData;
  /** Convert the thunk result into the stored data (default: identity). */
  mapResult?: (result: TResult) => TData;
  /** Set on fulfilled, cleared on pending. */
  successMessage?: string;
  /** Extra fields in the initial state (e.g. meta, status). */
  initialExtra?: TExtra;
  /** Extra synchronous reducers. */
  reducers?: SliceCaseReducers<RequestState<K, TData> & TExtra>;
  onPending?: (state: RequestState<K, TData> & TExtra) => void;
  onFulfilled?: (state: RequestState<K, TData> & TExtra, result: TResult) => void;
  onRejected?: (state: RequestState<K, TData> & TExtra, error: string) => void;
}

type NoExtra = Record<string, never>;

export function createRequestSlice<K extends string, TData, TResult, TArg, TExtra extends object = NoExtra>(
  options: RequestSliceOptions<K, TData, TResult, TArg, TExtra>,
) {
  type TState = RequestState<K, TData> & TExtra;
  const { name, thunk, dataKey, initialData, mapResult, successMessage } = options;

  const initialState = {
    [dataKey]: initialData,
    isLoading: false,
    error: null,
    successMessage: null,
    settled: false,
    ...(options.initialExtra ?? {}),
  } as TState;

  return createSlice<TState, SliceCaseReducers<TState>, string, SliceSelectors<TState>>({
    name,
    initialState,
    reducers: (options.reducers ?? {}) as ValidateSliceCaseReducers<TState, SliceCaseReducers<TState>>,
    extraReducers: (builder) => {
      builder
        .addCase(thunk.pending, (draft) => {
          const state = draft as unknown as TState;
          state.isLoading = true;
          state.error = null;
          state.successMessage = null;
          options.onPending?.(state);
        })
        .addCase(thunk.fulfilled, (draft, action) => {
          const state = draft as unknown as TState;
          state.isLoading = false;
          state.settled = true;
          (state as unknown as Record<string, unknown>)[dataKey] = mapResult
            ? mapResult(action.payload)
            : (action.payload as unknown as TData);
          if (successMessage) state.successMessage = successMessage;
          options.onFulfilled?.(state, action.payload);
        })
        .addCase(thunk.rejected, (draft, action) => {
          const state = draft as unknown as TState;
          const message = action.payload ?? action.error.message ?? "Request failed";
          state.isLoading = false;
          state.settled = true;
          state.error = message;
          options.onRejected?.(state, message);
        });
    },
  });
}

/**
 * Whether a slice should still be showing a placeholder: either a request is in
 * flight, or none has finished yet. Pages branch on this instead of `isLoading`
 * so they never paint an empty state before the first fetch resolves.
 */
export const isPending = (state: { isLoading: boolean; settled: boolean }): boolean =>
  state.isLoading || !state.settled;
