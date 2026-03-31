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

type CreateCashfreeOrderResponse = {
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

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: apiBaseQuery,
  endpoints: (builder) => ({
    createCashfreeOrder: builder.mutation<
      CreateCashfreeOrderResponse,
      CreateCashfreeOrderRequest
    >({
      query: (body) => ({
        url: "/cashfree/create-subscription-order",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateCashfreeOrderMutation } = paymentApi;
