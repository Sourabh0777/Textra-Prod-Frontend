/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../baseApi';

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchCustomers: builder.query<any, string | void>({
      query: (body) => ({
        url: '/core/customers',
        method: 'GET',
        body,
      }),
      providesTags: ['Customer'],
    }),
    fetchCustomer: builder.query<any, string>({
      query: (id) => `/core/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: '/core/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/core/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),
  }),
});

export const {
  useFetchCustomersQuery,
  useFetchCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
