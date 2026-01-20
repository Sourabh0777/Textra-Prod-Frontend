import { baseApi } from '../baseApi';
import { User } from '@/lib/slices/userSlice';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLoginUser: builder.query<User, void>({
      query: () => '/users/current',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/users?userId=${userId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    getUserByClerkId: builder.query<User, string>({
      query: (clerkId) => `/users?clerkId=${clerkId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const { useFetchLoginUserQuery, useGetUserByIdQuery, useGetUserByClerkIdQuery } = userApi;
