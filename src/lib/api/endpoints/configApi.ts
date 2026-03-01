import { IState, IZone } from '@/types';
import { baseApi } from '../baseApi';

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // States
    fetchStates: builder.query<IState[], void>({
      query: () => '/core/states',
      providesTags: ['State'],
    }),
    createState: builder.mutation<IState, Partial<IState>>({
      query: (body) => ({
        url: '/core/states',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['State'],
    }),
    updateState: builder.mutation<IState, { id: string; data: Partial<IState> }>({
      query: ({ id, data }) => ({
        url: `/core/states/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'State', id }, 'State'],
    }),
    deleteState: builder.mutation<void, string>({
      query: (id) => ({
        url: `/core/states/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['State'],
    }),

    // Zones
    fetchZones: builder.query<IZone[], { state_id?: string } | void>({
      query: (params) => {
        let url = '/core/zones';
        if (params?.state_id) {
          url += `?state_id=${params.state_id}`;
        }
        return url;
      },
      providesTags: ['Zone'],
    }),
    createZone: builder.mutation<IZone, Partial<IZone>>({
      query: (body) => ({
        url: '/core/zones',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Zone'],
    }),
    updateZone: builder.mutation<IZone, { id: string; data: Partial<IZone> }>({
      query: ({ id, data }) => ({
        url: `/core/zones/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Zone', id }, 'Zone'],
    }),
    deleteZone: builder.mutation<void, string>({
      query: (id) => ({
        url: `/core/zones/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Zone'],
    }),
  }),
});

export const {
  useFetchStatesQuery,
  useCreateStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
  useFetchZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} = configApi;
