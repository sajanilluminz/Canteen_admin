import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getApiCall} from '~adapters/ApiManager';
import CanteenEndpoints from '~adapters/CanteenEndpoins';
import {RootState} from './store';

export interface ISuggestion {
  name: string;
  userName: string;
  price: number;
  reason: string;
  suggestionId: string;
  productStatus: number;
}

interface ISuggestionInitialState {
  suggestions: ISuggestion[] | null;
  totalPages: number;
  totalPagesFulfilled: number;
  currentPage: number;
  currentPageFulfilled: number;
  suggestionsPending: ISuggestion[] | null;
  loading: boolean;
  error: null | undefined | string;
}

const initialState: ISuggestionInitialState = {
  suggestions: null,
  suggestionsPending: null,
  totalPagesFulfilled: 1,
  currentPageFulfilled: 1,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

var suggestedObj: ISuggestion | null = null;

export const fetchSuggestionsPending = createAsyncThunk(
  'fetch Pending Suggestions',
  async ({token, page = 1}: {token: any; page?: number}) => {
    var totalPages: number = 1;
    let headers = {Authorization: `Bearer ${token}`};
    let config = {
      headers: headers,
      params: {
        page: page,
        limit: 10,
      },
    };
    let suggestionsPendingArr: ISuggestion[] = [];
    return getApiCall({
      url: CanteenEndpoints.suggestions,
      config,
    })
      .then(res => {
        const response = res.data.data.allItems;
        totalPages = res.data.data.totalPages;
        response.forEach(
          (element: {
            productStatus: number;
            name: string;
            price: number;
            user: {name: string};
            _id: string;
            reason: string;
          }) => {
            suggestedObj = {
              name: element?.name,
              price: element?.price,
              productStatus: element?.productStatus,
              userName: element?.user?.name,
              suggestionId: element?._id,
              reason: element?.reason,
            };
            suggestionsPendingArr?.push(suggestedObj);
          },
        );

        return {
          suggestionsPendingArr,
          currentPage: page,
          totalPages: totalPages,
          error: null,
        };
      })
      .catch(error => {
        console.log(error);
        return {
          suggestionsPendingArr: [],
          totalPages,
          error: error,
          currentPage: page,
        };
      });
  },
);

export const fetchSuggestionsFulfilled = createAsyncThunk(
  'fetch Suggestions',
  async ({token, page = 1}: {token: any; page?: number}) => {
    let headers = {Authorization: `Bearer ${token}`};
    var totalPages: number = 1;
    let suggestionArr: ISuggestion[] = [];
    let config = {
      headers: headers,
      params: {
        page: page,
        limit: 10,
      },
    };
    return getApiCall({
      url: CanteenEndpoints.suggestionsHistory,
      config,
    })
      .then(res => {
        const response = res.data.data.allItems;
        totalPages = res.data.data.totalPages;
        response.forEach(
          (element: {
            productStatus: number;
            name: string;
            price: number;
            user: {name: string};
            _id: string;
            reason: string;
          }) => {
            suggestedObj = {
              name: element?.name,
              price: element?.price,
              productStatus: element?.productStatus,
              userName: element?.user?.name,
              suggestionId: element?._id,
              reason: element?.reason,
            };
            suggestionArr?.push(suggestedObj);
          },
        );

        return {
          suggestionArr: suggestionArr,
          currentPage: page,
          totalPages: totalPages,
          error: null,
        };
      })
      .catch(error => {
        console.log(error);
        return {
          suggestionArr: [],
          totalPages: totalPages,
          currentPage: page,
          error: error,
        };
      });
  },
);

const suggestionSlice = createSlice({
  name: 'get/suggestions',
  initialState,
  reducers: {
    updateSuggestions: (state, action: PayloadAction<ISuggestion>) => {
      var new_arr: any;
      new_arr = state.suggestionsPending?.filter(element => {
        return element.suggestionId !== action.payload.suggestionId;
      });

      state.suggestionsPending = new_arr;
      state.suggestions?.unshift(action.payload);
    },
    updateCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage += action.payload;
    },
    resetPageCount: state => {
      state.currentPage = 1;
    },
    updateFulfilledPage: (state, action: PayloadAction<number>) => {
      state.currentPageFulfilled += action.payload;
    },
    resetFulfilled: state => {
      state.currentPageFulfilled = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSuggestionsPending.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSuggestionsPending.fulfilled, (state, action) => {
        let listOld =
          action.payload.currentPage === 1
            ? []
            : state.suggestionsPending || [];

        state.suggestionsPending = listOld.concat(
          action.payload.suggestionsPendingArr,
        );
        state.totalPages = action.payload.totalPages;
        if (state.suggestions !== null) {
          state.loading = false;
        }
        state.error = action.payload.error;
      })
      .addCase(fetchSuggestionsPending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSuggestionsFulfilled.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSuggestionsFulfilled.fulfilled, (state, action) => {
        state.loading = false;
        let listOld =
          action.payload.currentPage === 1 ? [] : state.suggestions || [];

        state.suggestions = [...listOld, ...action.payload.suggestionArr];

        state.totalPagesFulfilled = action.payload.totalPages;
        state.error = action.payload.error;
      })
      .addCase(fetchSuggestionsFulfilled.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default suggestionSlice.reducer;
export const {
  updateSuggestions,
  updateCurrentPage,
  resetPageCount,
  updateFulfilledPage,
  resetFulfilled,
} = suggestionSlice.actions;
export const suggestionLoadingState = (state: RootState) =>
  state?.suggestion?.loading;
export const suggestionsArr = (state: RootState) =>
  state?.suggestion?.suggestions;
export const suggestionsPendingArray = (state: RootState) =>
  state?.suggestion?.suggestionsPending;
export const suggestionError = (state: RootState) => state?.suggestion?.error;
export const suggestionPendingTotalPages = (state: RootState) =>
  state?.suggestion?.totalPages;
export const currentPageToRender = (state: RootState) =>
  state?.suggestion?.currentPage;
export const currentPageToRenderFulfilled = (state: RootState) =>
  state?.suggestion?.currentPageFulfilled;
export const suggestionFulfilledTotalPages = (state: RootState) =>
  state?.suggestion?.totalPagesFulfilled;
