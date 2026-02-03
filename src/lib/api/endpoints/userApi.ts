import { baseApi } from '../baseApi';
import { User } from '@/lib/slices/userSlice';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchLoginUser: builder.query<User, void>({
      query: () => '/core/customers/current',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (userId) => `/core/users?userId=${userId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    getUserByClerkId: builder.query<User, string>({
      query: (clerkId) => `/core/users?clerkId=${clerkId}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    assignUserRole: builder.mutation<User, { businessTypeId: string }>({
      query: ({ businessTypeId }) => ({
        url: `/core/users/${businessTypeId}/role`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useFetchLoginUserQuery, useGetUserByIdQuery, useGetUserByClerkIdQuery, useAssignUserRoleMutation } =
  userApi;
