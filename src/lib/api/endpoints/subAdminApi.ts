/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../baseApi';
import { IBusiness } from '@/types';

export const subAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customers
    fetchSubAdminCustomers: builder.query<any, string | void>({
      query: (body) => ({
        url: '/core/sub-admin/customers',
        method: 'GET',
        body,
      }),
      providesTags: ['Customer'],
    }),
    createSubAdminCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: '/core/sub-admin/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Customer'],
    }),
    updateSubAdminCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/core/sub-admin/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),
    deleteSubAdminCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/sub-admin/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    // Vehicles
    fetchSubAdminVehicles: builder.query<any, string | void>({
      query: (customerId) =>
        customerId
          ? `/sub-admin/vehicle-service/vehicles?customer_id=${customerId}`
          : '/sub-admin/vehicle-service/vehicles',
      providesTags: ['Vehicle'],
    }),
    createSubAdminVehicle: builder.mutation<any, any>({
      query: (body) => ({
        url: '/sub-admin/vehicle-service/vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    updateSubAdminVehicle: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/sub-admin/vehicle-service/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }, 'Vehicle'],
    }),
    deleteSubAdminVehicle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/sub-admin/vehicle-service/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),

    // Business
    getSubAdminBusinessDetails: builder.query<IBusiness, void>({
      query: () => '/core/sub-admin/businesses/business',
      providesTags: ['Business'],
    }),
    updateSubAdminBusinessDetails: builder.mutation({
      query: (body) => ({
        url: '/core/sub-admin/businesses/update-business',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    updateSubAdminBusinessWaba: builder.mutation<IBusiness, { id: string; data: Partial<IBusiness> }>({
      query: ({ id, data }) => ({
        url: `/core/sub-admin/businesses/waba/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, 'Business', 'User'],
    }),
  }),
});

export const {
  useFetchSubAdminCustomersQuery,
  useCreateSubAdminCustomerMutation,
  useUpdateSubAdminCustomerMutation,
  useDeleteSubAdminCustomerMutation,
  useFetchSubAdminVehiclesQuery,
  useCreateSubAdminVehicleMutation,
  useUpdateSubAdminVehicleMutation,
  useDeleteSubAdminVehicleMutation,
  useGetSubAdminBusinessDetailsQuery,
  useUpdateSubAdminBusinessDetailsMutation,
  useUpdateSubAdminBusinessWabaMutation,
} = subAdminApi;
