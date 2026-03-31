import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const deleteAccountApi = createApi({
  reducerPath: "deleteAccountApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    deleteUserAccount: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/user/delete/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteUserAccountMutation } = deleteAccountApi;
