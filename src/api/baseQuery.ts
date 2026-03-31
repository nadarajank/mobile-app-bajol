import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store/store";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://usrapi.bajolmatrimony.com/";

export const apiBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const createBaseApi = (reducerPath: string) =>
  createApi({
    reducerPath,
    baseQuery: apiBaseQuery,
    endpoints: () => ({}),
  });
