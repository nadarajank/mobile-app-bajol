import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

type UserProfileQueryArg =
  | number
  | {
      id: number;
      viewerUserId?: number | string | null;
    };

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, UserProfileQueryArg>({
      query: (arg) => {
        if (typeof arg === "number") {
          return `/user/get/${arg}`;
        }

        return {
          url: `/user/get/${arg.id}`,
          params: arg.viewerUserId ? { viewerUserId: arg.viewerUserId } : undefined,
        };
      },
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApi;
