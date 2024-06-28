import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {getApiCall} from '~adapters/ApiManager';
import {baseUrl} from '~utils/constants/baseurl';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {RootState} from './store';

export interface IproductsInitialState {
  products: null | IProductsProps[] | undefined;
  filteredProduct: null | IProductsProps[] | undefined;
  loading: boolean;
  refresh: number;
  error: string | undefined;
  selectedCategory: string;
  filterState: boolean | null;
}

export type IProductsProps = {
  name: string;
  price: number;
  id: string;
  quantity: number;
  isActive: boolean;
  isDeleted: false;
  imageId: string;
  category?: string;
  image?: string;
};

const initialState: IproductsInitialState = {
  products: null,
  filteredProduct: null,
  loading: true,
  selectedCategory: 'All',
  refresh: 0,
  error: undefined,
  filterState: null,
};

var demoObj: IProductsProps | null = null;

export const getProducts = createAsyncThunk(
  'getProducts',
  async (authToken: string) => {
    let headers = {Authorization: `Bearer ${authToken}`};
    return getApiCall({url: CanteenEndpoins.getAllProducts, headers})
      .then(async response => {
        let data_Array: IProductsProps[] = [];
        await response?.data?.data?.allItems.forEach((item: any) => {
          demoObj = {
            name: item?.name,
            price: item?.price,
            isActive: item?.isActive,
            isDeleted: item?.isDeleted,
            category: item?.categoryId?.name,
            quantity: item?.quantity,
            id: item?._id,
            image: `${baseUrl}${item?.image?.image_url}`,
            imageId: item?.image?._id,
          };
          data_Array.push(demoObj);
        });
        return {data_Array, error: null};
      })
      .catch(error => {
        console.log(error);
        return {data_Array: [], error};
      });
  },
);

export const getProductsSlice = createSlice({
  name: 'allproducts',
  initialState,
  reducers: {
    updateProducts: (state, action: PayloadAction<IProductsProps>) => {
      state.filteredProduct?.forEach(item => {
        if (item.id === action.payload.id) {
          item.name = action.payload.name;
          item.category = action.payload.category;
          item.id = action.payload.id;
          item.image = action.payload.image;
          item.imageId = action.payload.imageId;
          item.isActive = action.payload.isActive;
          item.isDeleted = action.payload.isDeleted;
          item.price = action.payload.price;
          item.quantity = action.payload.quantity;
        }
      });
      state.products?.forEach(item => {
        if (item.id === action.payload.id) {
          item.name = action.payload.name;
          item.category = action.payload.category;
          item.id = action.payload.id;
          item.image = action.payload.image;
          item.imageId = action.payload.imageId;
          item.isActive = action.payload.isActive;
          item.isDeleted = action.payload.isDeleted;
          item.price = action.payload.price;
          item.quantity = action.payload.quantity;
        }
      });
    },
    disableProduct: (state, action: PayloadAction<string>) => {
      state.products?.forEach(item => {
        if (item.id === action.payload) {
          item.isActive = false;
        }
      });
      state.filteredProduct?.forEach(item => {
        if (item.id === action.payload) {
          item.isActive = false;
        }
      });
    },
    enableProduct: (state, action: PayloadAction<string>) => {
      state.products?.forEach(item => {
        if (item.id === action.payload) {
          item.isActive = true;
        }
        state.filteredProduct?.forEach(items => {
          if (items.id === action.payload) {
            items.isActive = true;
          }
        });
      });
    },
    addNewProdcut: (state, action: PayloadAction<IProductsProps>) => {
      state.products?.push(action.payload);
      state.products?.sort((a: {name: string}, b: {name: string}) =>
        a.name.localeCompare(b.name),
      );
      state.filteredProduct?.push(action.payload);
      state.filteredProduct?.sort((a: {name: string}, b: {name: string}) =>
        a.name.localeCompare(b.name),
      );
      // state.selectedCategory = 'All';
      // state.filteredProduct = state.products;
      // state.filterState = null;
    },
    updateCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    updateFilterValue: (state, action: PayloadAction<boolean | null>) => {
      state.filterState = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      let products: IProductsProps[] | null | undefined;
      let productsSec: IProductsProps[] | null | undefined;
      state.filteredProduct = state.products;
      products = state.products?.filter(item => {
        return item.id !== action.payload;
      });
      productsSec = state.filteredProduct?.filter(item => {
        if (state.selectedCategory === 'All' && state.filterState !== null) {
          return (
            item.id !== action.payload && item.isActive === state.filterState
          );
        } else if (
          state.filterState === null &&
          state.selectedCategory !== 'All'
        ) {
          return (
            item.id !== action.payload &&
            item.category === state.selectedCategory
          );
        } else if (
          state.filterState === null &&
          state.selectedCategory === 'All'
        ) {
          return item.id !== action.payload;
        } else {
          return (
            item.id !== action.payload &&
            item.category === state.selectedCategory &&
            item.isActive === state.filterState
          );
        }
      });
      state.products = products;
      state.filteredProduct = productsSec;
    },
    resetFilter: state => {
      state.filterState = null;
      state.selectedCategory = 'All';
    },
    updateProdcutsByCategory: state => {
      let products: IProductsProps[] | null | undefined;
      state.filteredProduct = state.products;
      if (state.selectedCategory === 'All') {
        if (state.filterState === null) {
          state.filteredProduct = state.products;
        } else if (state.filterState === true) {
          products = state.filteredProduct?.filter(item => {
            return item.isActive === true;
          });
          state.filteredProduct = products;
        } else {
          products = state.filteredProduct?.filter(item => {
            return item.isActive === false;
          });
          state.filteredProduct = products;
        }
      } else {
        products = state.filteredProduct?.filter(item => {
          if (state.filterState === null) {
            return item.category === state.selectedCategory;
          } else {
            return (
              item.category === state.selectedCategory &&
              item.isActive === state.filterState
            );
          }
        });
        state.filteredProduct = products;
      }
    },
    updateDataByFilter: state => {
      let products: IProductsProps[] | null | undefined;
      state.filteredProduct = state.products;
      if (state.filterState === null) {
        if (state.selectedCategory === 'All') {
          state.filteredProduct = state.products;
        } else {
          products = state.filteredProduct?.filter(item => {
            return item.category === state.selectedCategory;
          });
          state.filteredProduct = products;
        }
      } else {
        if (state.selectedCategory === 'All') {
          products = state.filteredProduct?.filter(item => {
            return item.isActive === state.filterState;
          });
        } else {
          products = state.filteredProduct?.filter(item => {
            return (
              item.category === state.selectedCategory &&
              item.isActive === state.filterState
            );
          });
        }
        state.filteredProduct = products;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProducts.pending, state => {
        state.loading = true;
      })
      .addCase(
        getProducts.fulfilled,
        (
          state,
          action: PayloadAction<
            | {data_Array: IProductsProps[]; error: null}
            | {error: any; data_Array: null}
          >,
        ) => {
          state.loading = false;
          state.filterState = null;
          state.selectedCategory = 'All';
          state.products = action.payload.data_Array;
          state.filteredProduct = action.payload.data_Array;
          state.error = action.payload.error;
        },
      )
      .addCase(getProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.filterState = null;
        state.selectedCategory = 'All';
        state.loading = false;
      });
  },
});

export default getProductsSlice.reducer;

export const products = (state: RootState) => state.products.filteredProduct;
export const allProducts = (state: RootState) => state.products.products;
export const stateD = (state: RootState) => state;
export const {
  updateProducts,
  addNewProdcut,
  deleteProduct,
  enableProduct,
  disableProduct,
  updateCategory,
  updateFilterValue,
  resetFilter,
  updateProdcutsByCategory,
  updateDataByFilter,
} = getProductsSlice.actions;
export const getProductsError = (state: RootState) => state.products.error;
export const getPrductsLoadingState = (state: RootState) =>
  state.products.loading;
export const getSelectedCategoryValue = (state: RootState) =>
  state.products.selectedCategory;
export const refresh = (state: RootState) => state?.products?.refresh;
export const filterState = (state: RootState) => state.products.filterState;
