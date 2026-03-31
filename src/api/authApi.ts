import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    loginUser: builder.mutation<any, { mobileNumber: string; state: string; password: string }>({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
