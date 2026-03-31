import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    uploadImages: builder.mutation<any, { formData: FormData; userId: number }>({
      query: ({ formData, userId }) => ({
        url: `/upload/user/dp/${userId}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImagesMutation } = imageApi;
