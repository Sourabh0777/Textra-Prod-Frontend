import { baseApi } from '../../baseApi';

export const opticalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customers
    fetchOpticalCustomers: builder.query<any, string | void>({
      query: (search) => (search ? `/optical-service/customers?search=${search}` : '/optical-service/customers'),
      providesTags: ['OpticalCustomer'],
    }),
    fetchOpticalCustomer: builder.query<any, string>({
      query: (id) => `/optical-service/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'OpticalCustomer', id }, 'OpticalCustomer'],
    }),
    createOpticalCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: '/optical-service/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OpticalCustomer'],
    }),
    updateOpticalCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'OpticalCustomer', id }, 'OpticalCustomer'],
    }),
    deleteOpticalCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OpticalCustomer'],
    }),

    // Prescriptions
    fetchPrescriptions: builder.query<any, string | void>({
      query: (customerId) =>
        customerId ? `/optical-service/prescriptions?customer_id=${customerId}` : '/optical-service/prescriptions',
      providesTags: ['Prescription'],
    }),
    fetchPrescription: builder.query<any, string>({
      query: (id) => `/optical-service/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prescription', id }],
    }),
    createPrescription: builder.mutation<any, any>({
      query: (body) => ({
        url: '/optical-service/prescriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prescription', 'OpticalCustomer'],
    }),
    updatePrescription: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/prescriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Prescription', id }, 'Prescription'],
    }),
    deletePrescription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prescription'],
    }),
  }),
});

export const {
  useFetchOpticalCustomersQuery,
  useFetchOpticalCustomerQuery,
  useCreateOpticalCustomerMutation,
  useUpdateOpticalCustomerMutation,
  useDeleteOpticalCustomerMutation,

  useFetchPrescriptionsQuery,
  useFetchPrescriptionQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = opticalApi;
