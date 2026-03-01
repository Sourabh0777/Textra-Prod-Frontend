import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '@/lib/slices/userSlice';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api`,
    prepareHeaders: (headers, { getState }) => {
      // You can add auth headers here if needed
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (userId) => ({
        url: `/users`,
        method: 'GET',
        params: { userId },
      }),
    }),
    getUserByClerkId: builder.query<User, string>({
      query: (clerkId) => ({
        url: `/users`,
        method: 'GET',
        params: { clerkId },
      }),
    }),
  }),
});

export const { useGetUserByIdQuery, useGetUserByClerkIdQuery } = userApi;
