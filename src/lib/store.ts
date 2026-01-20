import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/lib/slices/userSlice";
import { baseApi } from "@/lib/api/baseApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
