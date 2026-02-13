import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/lib/slices/userSlice';
import { baseApi } from '@/lib/api/baseApi';
import { userApi } from '@/lib/api/userApi';
import { oAuthApi } from '@/lib/api/oAuthApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [oAuthApi.reducerPath]: oAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, userApi.middleware, oAuthApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
