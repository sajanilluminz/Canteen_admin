import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {postApiCall} from '~adapters/ApiManager';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {ICredentialProps} from '~screens/login/login.types';
import {RootState} from './store';
import { log } from 'react-native-reanimated';

type IloginInitialState = {
  adminDetails: IAdminDetialsProps | null;
  loading: boolean;
  error: null | string | object | undefined;
};

type IAdminDetialsProps = {
  token: string;
  name: string;
  email: string;
};

const initialState: IloginInitialState = {
  adminDetails: null,
  loading: false,
  error: null,
};
var userObj: IAdminDetialsProps | null = null;

export const LoginAdmin = createAsyncThunk(
  'loginAdmin',
  async (credentials: ICredentialProps) => {
    console.log('credentials :', credentials);
    
    return postApiCall({url: CanteenEndpoins.login, data: credentials})
      .then(res => {
        var admin = res?.data?.data?.data?.user;
        let token = res?.data?.data?.token;
        console.log('234r');

        userObj = {
          token: token,
          name: admin?.name ?? '',
          email: admin?.email ?? '',
        };
        return {
          userObj,
          error: null,
        };
      })
      .catch(error => {
        console.log(error);
        return {
          userObj: null,
          error: error,
        };
      });
  },
);

export const storeAdminDetails = createSlice({
  name: 'storeAdminDetails',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(LoginAdmin.pending, state => {
        state.loading = true;
      })
      .addCase(LoginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.adminDetails = action.payload?.userObj;
        state.error = action.payload?.error;
      })
      .addCase(LoginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storeAdminDetails.reducer;
export const {reset} = storeAdminDetails.actions;
export const loginLoadingState = (state: RootState) => state.admin.loading;
export const adminDetails = (state: RootState) => state.admin.adminDetails;
export const adminLoginError = (state: RootState) => state.admin.error;
export const adminToken = (state: RootState) =>
  state.admin?.adminDetails?.token;
