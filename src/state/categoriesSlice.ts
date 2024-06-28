import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {getApiCall} from '~adapters/ApiManager';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {RootState} from './store';

type ICategoriesInitialState = {
  categories: null | ICategoryData[];
  loading: boolean;
  error: string | undefined | null | object;
};

export type ICategoryData = {
  name: string;
  id: string;
};

const initialState: ICategoriesInitialState = {
  categories: null,
  loading: true,
  error: undefined,
};

export const fetchCategories = createAsyncThunk(
  'fetchCategories',
  async (authToken: string) => {
    let headers = {Authorization: `Bearer ${authToken}`};
    return getApiCall({url: CanteenEndpoins.getCategories, headers})
      .then(async response => {
        let arr: ICategoryData[] = [];
        response?.data?.data?.category.forEach(
          (category: {name: string; _id: string}) => {
            arr?.push({name: category.name, id: category._id});
          },
        );
        arr.unshift({name: 'All', id: '1'});
        return {arr, error: null};
      })
      .catch(error => {
        console.log(error);
        return {arr: null, error: error};
      });
  },
);

export const getCategoriesSlice = createSlice({
  name: 'getCategories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (
          state,
          action: PayloadAction<
            {arr: ICategoryData[]; error: null} | {arr: null; error: any}
          >,
        ) => {
          state.loading = false;
          state.categories = action.payload.arr;
          state.error = action.payload.error;
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getCategoriesSlice.reducer;

export const categoryData = (state: RootState) => state.categories.categories;
export const categroyDataFetchingError = (state: RootState) =>
  state.categories.error;
export const categoryLoadingState = (state: RootState) =>
  state.categories.loading;
