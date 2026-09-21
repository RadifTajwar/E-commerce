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
}

export type RequestState<K extends string, TData> = RequestStateBase & { [key in K]: TData };

type AnyState = RequestStateBase;

export interface RequestSliceOptions<TData, TResult, TArg, TState extends AnyState> {
  name: string;
  thunk: AsyncThunk<TResult, TArg, ThunkConfig>;
  dataKey: string;
  initialData: TData;
  /** Convert the thunk result into the stored data (default: identity). */
  mapResult?: (result: TResult) => TData;
  /** Set on fulfilled, cleared on pending. */
  successMessage?: string;
  /** Extra fields in the initial state (e.g. meta, status). */
  initialExtra?: Partial<TState>;
  /** Extra synchronous reducers. */
  reducers?: SliceCaseReducers<TState>;
  onPending?: (state: TState) => void;
  onFulfilled?: (state: TState, result: TResult) => void;
  onRejected?: (state: TState, error: string) => void;
}

export function createRequestSlice<TData, TResult, TArg, TState extends AnyState = AnyState>(
  options: RequestSliceOptions<TData, TResult, TArg, TState>,
) {
  const { name, thunk, dataKey, initialData, mapResult, successMessage } = options;

  const initialState = {
    [dataKey]: initialData,
    isLoading: false,
    error: null,
    successMessage: null,
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
          state.error = message;
          options.onRejected?.(state, message);
        });
    },
  });
}
