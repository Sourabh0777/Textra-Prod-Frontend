import { IBusiness, IBusinessType } from '@/types';
import { baseApi } from '../baseApi';

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchBusinessTypes: builder.query<IBusinessType[], void>({
      query: () => '/core/business-types',
      providesTags: ['BusinessType'],
    }),
    createBusinessType: builder.mutation<IBusinessType, void>({
      query: (body) => ({
        url: '/core/business-types',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BusinessType'],
    }),
    updateBusinessType: builder.mutation<IBusinessType, { id: string; data: IBusinessType }>({
      query: ({ id, data }) => ({
        url: `/core/business-types/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BusinessType'],
    }),
    deleteBusinessType: builder.mutation<IBusinessType, string>({
      query: (id) => ({
        url: `/core/business-types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BusinessType'],
    }),

    // Businesses
    fetchBusinesses: builder.query<IBusiness[], void>({
      query: () => '/core/businesses',
      providesTags: ['Business'],
    }),
    fetchBusiness: builder.query<IBusiness, string>({
      query: (id) => `/core/businesses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Business', id }],
    }),
    createBusiness: builder.mutation<IBusiness, void>({
      query: (body) => ({
        url: '/core/businesses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    updateBusiness: builder.mutation<IBusiness, { id: string; data: IBusiness }>({
      query: ({ id, data }) => ({
        url: `/core/businesses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, 'Business'],
    }),
    deleteBusiness: builder.mutation<IBusiness, string>({
      query: (id) => ({
        url: `/core/businesses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Business'],
    }),

    // Get business details endpoint
    getBusinessDetails: builder.query<IBusiness, void>({
      query: () => '/core/businesses/business',
      providesTags: ['Business'],
    }),

    // Update business details endpoint
    updateBusinessDetails: builder.mutation({
      query: (body) => ({
        url: '/core/businesses/update-business',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Business'],
    }),
    updateBusinessWaba: builder.mutation<IBusiness, { id: string; data: Partial<IBusiness> }>({
      query: ({ id, data }) => ({
        url: `/core/businesses/waba/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }, 'Business', 'User'],
    }),
  }),
});

export const {
  useFetchBusinessTypesQuery,
  useCreateBusinessTypeMutation,
  useUpdateBusinessTypeMutation,
  useDeleteBusinessTypeMutation,
  useFetchBusinessesQuery,
  useFetchBusinessQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useGetBusinessDetailsQuery,
  useUpdateBusinessDetailsMutation,
  useUpdateBusinessWabaMutation,
} = businessApi;
