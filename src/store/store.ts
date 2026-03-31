import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import formReducer from "../features/form/formSlice";
import otpReducer from "../features/otp/otpSlice";
import { authApi } from "../api/authApi";
import { deleteAccountApi } from "../api/deleteAccountApi";
import { editFormApi } from "../api/editFormApi";
import { formApi } from "../api/formApi";
import { imageApi } from "../api/imageApi";
import { otpApi } from "../api/otpApi";
import { paymentApi } from "../api/paymentApi";
import { profileApi } from "../api/profileApi";
import { viewApi } from "../api/viewApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
    otp: otpReducer,
    [authApi.reducerPath]: authApi.reducer,
    [deleteAccountApi.reducerPath]: deleteAccountApi.reducer,
    [editFormApi.reducerPath]: editFormApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [viewApi.reducerPath]: viewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      deleteAccountApi.middleware,
      editFormApi.middleware,
      formApi.middleware,
      imageApi.middleware,
      otpApi.middleware,
      paymentApi.middleware,
      profileApi.middleware,
      viewApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
