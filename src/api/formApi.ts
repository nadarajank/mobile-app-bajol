import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const formApi = createApi({
  reducerPath: "formApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    submitForm: builder.mutation<any, Record<string, unknown>>({
      query: (body) => ({
        url: "/user/save",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitFormMutation } = formApi;
