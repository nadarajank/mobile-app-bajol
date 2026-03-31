import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, number>({
      query: (id) => `/user/get/${id}`,
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApi;
