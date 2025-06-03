import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a service to handle orders
export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://18.208.134.101:1337/api' }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/commandes',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { data: orderData }
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
