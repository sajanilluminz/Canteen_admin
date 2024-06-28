import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getApiCall} from '~adapters/ApiManager';
import CanteenEndpoins from '~adapters/CanteenEndpoins';
import {ITransactioinProps} from '~screens/userListing/components/userListing';
import {RootState} from './store';

type IGetUSersInitialState = {
  loading: boolean;
  error: string | null | undefined;
  userFilter: 'A-Z' | 'Paid' | 'Z-A' | 'unPaid';
  currentDueAmount: number | null | string;
  users: IuserDetails[] | null;
};

export type IuserDetails = {
  name: string;
  email: string;
  amount: number;
  userId: string;
  userImage: string;
  paymentHistoryArr: IPaymentHistoryProps[] | null;
};

export type IPaymentHistoryProps = {
  amount: number;
  Paid: boolean;
  createdAt: string;
};

const initialState: IGetUSersInitialState = {
  loading: false,
  error: null,
  currentDueAmount: null,
  users: null,
  userFilter: 'Paid',
};

export const getUsers = createAsyncThunk(
  'getUsers',
  async (authToken: string) => {
    let headers = {Authorization: `Bearer ${authToken}`};
    return getApiCall({url: CanteenEndpoins.getUsers, headers})
      .then(response => {
        let dataArray: IuserDetails[] | any = [];
        let userObj: IuserDetails;
        let users = response.data.data.Users;
        users.forEach(
          (user: {
            email: string;
            name: string;
            Amount: number;
            _id: string;
            profileUrl: string;
            paymentHistory: any;
          }) => {
            userObj = {
              name: user.name,
              amount: user.Amount,
              userId: user._id,
              email: user.email,
              userImage: user.profileUrl,
              paymentHistoryArr: user.paymentHistory,
            };
            dataArray?.push(userObj);
          },
        );
        dataArray.sort(
          (a: {amount: string}, b: {amount: string}) =>
            parseFloat(b.amount) - parseFloat(a.amount),
        );
        return {dataArray, error: null};
      })
      .catch(error => {
        console.log(error);
        return {dataArray: null, error: error};
      });
  },
);

export const getUsersSlice = createSlice({
  name: 'getUsers',
  initialState,
  reducers: {
    deleteAUser: (state, action: PayloadAction<string>) => {
      var filteredUser: any;
      filteredUser = state.users?.filter(user => {
        return user.userId !== action.payload;
      });
      state.users = filteredUser;
    },
    updateCurrentDueAmount: (
      state,
      action: PayloadAction<number | string | null>,
    ) => {
      state.currentDueAmount = action.payload;
    },
    deductAmount: (
      state,
      action: PayloadAction<{id: string | undefined; amount: number}>,
    ) => {
      state.users?.forEach(user => {
        if (user.userId === action.payload.id) {
          user.amount -= action.payload.amount;
        }
      });
      state.users &&
        state.users.sort(
          (a: {amount: number}, b: {amount: number}) => b.amount - a.amount,
        );
    },
    sordData: (state, action: PayloadAction<string>) => {
      if (action.payload === 'A-Z') {
        state.userFilter = 'A-Z';
        state.users?.sort((a: {name: string}, b: {name: string}) =>
          a.name.localeCompare(b.name),
        );
      } else if (action.payload === 'Z-A') {
        state.userFilter = 'Z-A';
        state.users?.sort((a: {name: string}, b: {name: string}) =>
          b.name.localeCompare(a.name),
        );
      } else if (action.payload === 'Paid') {
        state.userFilter = 'Paid';
        state.users?.sort(
          (a: {amount: number}, b: {amount: number}) => b.amount - a.amount,
        );
      } else if (action.payload === 'unPaid') {
        state.userFilter = 'unPaid';
        state.users?.sort(
          (a: {amount: number}, b: {amount: number}) => a.amount - b.amount,
        );
      }
    },
    addNewTranaction: (state, action: PayloadAction<ITransactioinProps>) => {
      state.users &&
        state.users.forEach((item: IuserDetails) => {
          if (item.userId === action.payload.user) {
            item.paymentHistoryArr?.unshift(action.payload);
          }
        });
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => {
        state.loading = true;
      })
      .addCase(
        getUsers.fulfilled,
        (
          state,
          action: PayloadAction<
            | {dataArray: IuserDetails[]; error: null}
            | {dataArray: null; error: any}
          >,
        ) => {
          state.loading = false;
          state.users = action.payload.dataArray;
          state.userFilter = 'Paid';
          state.error = action.payload.error;
        },
      )
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getUsersSlice.reducer;
export const {
  updateCurrentDueAmount,
  deductAmount,
  sordData,
  deleteAUser,
  addNewTranaction,
} = getUsersSlice.actions;
export const userData = (state: RootState) => state.users.users;
export const currentDueAmount = (state: RootState) =>
  state.users.currentDueAmount;
export const userFilterCurrentState = (state: RootState) =>
  state.users.userFilter;
export const userFetchingError = (state: RootState) => state.users.error;
export const userFetchingLoadingState = (state: RootState) =>
  state.users.loading;
