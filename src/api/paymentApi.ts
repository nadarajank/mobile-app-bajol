import { createApi } from "@reduxjs/toolkit/query/react";

import { apiBaseQuery } from "./baseQuery";

type CreateCashfreeOrderRequest = {
  user_id: number;
  plan_id: number;
  order_amount: number;
  order_currency: string;
  receipt: string;
  customer_email?: string;
  customer_phone?: string;
};

type CreateProfileAccessOrderRequest = {
  viewer_user_id: number;
  target_user_id: number;
  order_amount: number;
  order_currency: string;
  receipt: string;
  customer_email?: string;
  customer_phone?: string;
};

type CashfreeOrderResponse = {
  success: boolean;
  cashfree_order?: {
    order_id?: string;
    payment_session_id?: string;
  };
  local_payment_id?: number;
  final_amount?: {
    order_amount: number;
    order_currency: string;
  };
};

type ConfirmProfileAccessOrderResponse = {
  success: boolean;
  message?: string;
  unlockedProfile?: Record<string, unknown>;
};

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    createCashfreeOrder: builder.mutation<
      CashfreeOrderResponse,
      CreateCashfreeOrderRequest
    >({
      query: (body) => ({
        url: "/cashfree/create-subscription-order",
        method: "POST",
        body,
      }),
    }),
    createProfileAccessOrder: builder.mutation<
      CashfreeOrderResponse,
      CreateProfileAccessOrderRequest
    >({
      query: (body) => ({
        url: "/cashfree/create-profile-access-order",
        method: "POST",
        body,
      }),
    }),
    confirmProfileAccessOrder: builder.mutation<
      ConfirmProfileAccessOrderResponse,
      { cashfree_order_id: string }
    >({
      query: (body) => ({
        url: "/cashfree/confirm-profile-access-order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useConfirmProfileAccessOrderMutation,
  useCreateCashfreeOrderMutation,
  useCreateProfileAccessOrderMutation,
} = paymentApi;
