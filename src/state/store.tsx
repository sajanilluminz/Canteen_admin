import {
  configureStore,
  Store,
  getDefaultMiddleware,
  combineReducers,
} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storeAdminDetailsReducer from '~state/loginSlice';
import getProductsReducer from '~state/allProductsSlice';
import getSuggestionReducer from '~state/suggestionSlice';
import getCategoryReducer from '~state/categoriesSlice';
import getUsersReducer from '~state/getUsers';
import {persistReducer, persistStore} from 'redux-persist';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['admin'],
};

const rootReducer = combineReducers({
  admin: storeAdminDetailsReducer,
  users: getUsersReducer,
  categories: getCategoryReducer,
  products: getProductsReducer,
  suggestion: getSuggestionReducer,
});

const middleware = [
  ...getDefaultMiddleware({
    // serializableCheck: {
    //   // Ignore these action types
    //   ignoredActions: ['persist/PERSIST'],
    //   ignoredActionPaths: ['currentPlacedOrder.currentOrderDetails.headers'],
    // },
    immutableCheck: false,
    serializableCheck: false,
  }),
];

const store: Store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware,
});
const persistor = persistStore(store);

const exportObj = {
  store,
  persistor,
};

export default exportObj;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
