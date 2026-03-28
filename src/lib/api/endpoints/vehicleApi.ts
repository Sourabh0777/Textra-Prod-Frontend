import { baseApi } from '../baseApi';

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchVehicles: builder.query<any, string | void>({
      query: (customerId) =>
        customerId ? `/vehicle-service/vehicles?customer_id=${customerId}` : '/vehicle-service/vehicles',
      providesTags: ['Vehicle'],
    }),
    fetchVehicle: builder.query<any, string>({
      query: (id) => `/vehicle-service/vehicles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),
    createVehicle: builder.mutation<any, any>({
      query: (body) => ({
        url: '/vehicle-service/vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    updateVehicle: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/vehicle-service/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }, 'Vehicle'],
    }),
    deleteVehicle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vehicle-service/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useFetchVehiclesQuery,
  useFetchVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;
