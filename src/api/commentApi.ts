import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

export type CommentReply = {
  id: number | string;
  comment?: string;
  content?: string;
  message?: string;
  userName?: string;
  name?: string;
  createdAt?: string;
};

export type ProfileComment = {
  id: number | string;
  comment?: string;
  content?: string;
  message?: string;
  userName?: string;
  name?: string;
  createdAt?: string;
  replies?: CommentReply[];
};

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    getProfileComments: builder.query<ProfileComment[], number>({
      query: (profileId) => `/user/${profileId}/comments`,
      transformResponse: (response: ProfileComment[] | { data?: ProfileComment[]; comments?: ProfileComment[] }) => {
        if (Array.isArray(response)) {
          return response;
        }

        return response?.comments || response?.data || [];
      },
      providesTags: (_result, _error, profileId) => [{ type: "Comments", id: profileId }],
    }),
    createProfileComment: builder.mutation<
      unknown,
      { profileId: number; comment: string; userId?: number | null; userName?: string | null }
    >({
      query: ({ profileId, ...body }) => ({
        url: `/user/${profileId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { profileId }) => [{ type: "Comments", id: profileId }],
    }),
    createCommentReply: builder.mutation<
      unknown,
      { profileId: number; commentId: number | string; reply: string; userId?: number | null; userName?: string | null }
    >({
      query: ({ commentId, ...body }) => ({
        url: `/comments/${commentId}/replies`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { profileId }) => [{ type: "Comments", id: profileId }],
    }),
  }),
});

export const {
  useCreateCommentReplyMutation,
  useCreateProfileCommentMutation,
  useGetProfileCommentsQuery,
} = commentApi;
