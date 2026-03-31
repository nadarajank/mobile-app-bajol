import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const editFormApi = createApi({
  reducerPath: "editFormApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    editForm: builder.mutation<any, { id: number } & Record<string, unknown>>({
      query: ({ id, ...body }) => ({
        url: `/user/update/${id}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useEditFormMutation } = editFormApi;
