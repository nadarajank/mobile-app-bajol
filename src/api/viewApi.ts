import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const viewApi = createApi({
  reducerPath: "viewApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getAllUsers: builder.query<any[], Record<string, unknown>>({
      query: (body) => ({
        url: "/user/list",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = viewApi;
