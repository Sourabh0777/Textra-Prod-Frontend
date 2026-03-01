import { baseApi } from '../baseApi';

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchServices: builder.query<any, string | void>({
      query: (vehicleId) => (vehicleId ? `/bike-service/services?vehicle_id=${vehicleId}` : '/bike-service/services'),
      providesTags: ['Service'],
    }),
    fetchService: builder.query<any, string>({
      query: (id) => `/bike-service/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
    createService: builder.mutation<any, any>({
      query: (body) => ({
        url: '/bike-service/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/bike-service/services/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Service', id }, 'Service'],
    }),
    deleteService: builder.mutation<any, string>({
      query: (id) => ({
        url: `/bike-service/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useFetchServicesQuery,
  useFetchServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
