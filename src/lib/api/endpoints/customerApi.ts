import { baseApi } from "../baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchCustomers: builder.query<any, string | void>({
      query: (businessId) => (businessId ? `/customers?business_id=${businessId}` : "/customers"),
      providesTags: ["Customer"],
    }),
    fetchCustomer: builder.query<any, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: "/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customer", id }, "Customer"],
    }),
    deleteCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const { useFetchCustomersQuery, useFetchCustomerQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } = customerApi;
