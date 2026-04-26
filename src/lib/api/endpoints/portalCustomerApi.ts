/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../baseApi';

export const portalCustomerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchPortalData: builder.query<any, string>({
      query: (uid) => `/vehicle-service/portal/${uid}`,
      providesTags: (result, error, uid) => [
        { type: 'Customer', id: uid },
        { type: 'Vehicle' },
        { type: 'Service' },
        { type: 'Reminder' },
      ],
    }),
    updatePortalProfile: builder.mutation<any, { uid: string; data: any }>({
      query: ({ uid, data }) => ({
        url: `/portal/${uid}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { uid }) => [{ type: 'Customer', id: uid }],
    }),
    addPortalVehicle: builder.mutation<any, { uid: string; data: any }>({
      query: ({ uid, data }) => ({
        url: `/portal/${uid}/vehicles`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicle', 'Customer'],
    }),
    updatePortalVehicle: builder.mutation<any, { uid: string; vehicleId: string; data: any }>({
      query: ({ uid, vehicleId, data }) => ({
        url: `/portal/${uid}/vehicles/${vehicleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    deletePortalVehicle: builder.mutation<any, { uid: string; vehicleId: string }>({
      query: ({ uid, vehicleId }) => ({
        url: `/portal/${uid}/vehicles/${vehicleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useFetchPortalDataQuery,
  useUpdatePortalProfileMutation,
  useAddPortalVehicleMutation,
  useUpdatePortalVehicleMutation,
  useDeletePortalVehicleMutation,
} = portalCustomerApi;
