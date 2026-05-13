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
          ? `/core/sub-admin/vehicles?customer_id=${customerId}`
          : '/core/sub-admin/vehicles',
      providesTags: ['Vehicle'],
    }),
    createSubAdminVehicle: builder.mutation<any, any>({
      query: (body) => ({
        url: '/core/sub-admin/vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    updateSubAdminVehicle: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/core/sub-admin/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }, 'Vehicle'],
    }),
    deleteSubAdminVehicle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/sub-admin/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),

    // Services
    fetchSubAdminServices: builder.query<any, string | void>({
      query: (vehicleId) => (vehicleId ? `/core/sub-admin/services?vehicle_id=${vehicleId}` : '/core/sub-admin/services'),
      providesTags: ['Service'],
    }),
    createSubAdminService: builder.mutation<any, any>({
      query: (body) => ({
        url: '/core/sub-admin/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service', 'Vehicle'],
    }),
    updateSubAdminService: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/core/sub-admin/services/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }, 'Service', 'Vehicle'],
    }),
    deleteSubAdminService: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/sub-admin/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service', 'Vehicle'],
    }),

    // Reminders
    fetchSubAdminReminders: builder.query<any, void>({
      query: () => '/core/sub-admin/reminders',
      providesTags: ['Reminder'],
    }),
    createSubAdminReminder: builder.mutation<any, any>({
      query: (body) => ({
        url: '/core/sub-admin/reminders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reminder', 'Vehicle'],
    }),
    updateSubAdminReminder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/core/sub-admin/reminders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Reminder', id }, 'Reminder', 'Vehicle'],
    }),
    deleteSubAdminReminder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/sub-admin/reminders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reminder', 'Vehicle'],
    }),
    markSubAdminVisited: builder.mutation<any, string>({
      query: (id) => ({
        url: `/core/sub-admin/reminders/${id}/shop-visit`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reminder', id }, 'Reminder', 'Service', 'Vehicle'],
    }),
    triggerSubAdminReminderWorker: builder.mutation<any, { reminder_id: string }>({
      query: (body) => ({
        url: '/core/sub-admin/reminders/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reminder'],
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
  useFetchSubAdminServicesQuery,
  useCreateSubAdminServiceMutation,
  useUpdateSubAdminServiceMutation,
  useDeleteSubAdminServiceMutation,
  useFetchSubAdminRemindersQuery,
  useCreateSubAdminReminderMutation,
  useUpdateSubAdminReminderMutation,
  useDeleteSubAdminReminderMutation,
  useMarkSubAdminVisitedMutation,
  useTriggerSubAdminReminderWorkerMutation,
  useGetSubAdminBusinessDetailsQuery,
  useUpdateSubAdminBusinessDetailsMutation,
  useUpdateSubAdminBusinessWabaMutation,
} = subAdminApi;
