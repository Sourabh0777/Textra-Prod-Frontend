import { ITwoWheelerBrand, ITwoWheelerModel } from '@/types';
import { baseApi } from '../baseApi';

export const twoWheelerBrandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Brands
    fetchTwoWheelerBrands: builder.query<ITwoWheelerBrand[], void>({
      query: () => 'core/two-wheeler/brands',
      providesTags: ['TwoWheelerBrand'],
    }),
    createTwoWheelerBrand: builder.mutation<ITwoWheelerBrand, Partial<ITwoWheelerBrand>>({
      query: (body) => ({
        url: 'core/two-wheeler/brands',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TwoWheelerBrand'],
    }),
    updateTwoWheelerBrand: builder.mutation<ITwoWheelerBrand, { id: string; data: Partial<ITwoWheelerBrand> }>({
      query: ({ id, data }) => ({
        url: `core/two-wheeler/brands/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'TwoWheelerBrand', id }, 'TwoWheelerBrand'],
    }),
    deleteTwoWheelerBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `core/two-wheeler/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TwoWheelerBrand'],
    }),

    // Models
    createTwoWheelerModel: builder.mutation<ITwoWheelerBrand, { brandId: string; data: Partial<ITwoWheelerModel> }>({
      query: ({ brandId, data }) => ({
        url: `core/two-wheeler/brands/${brandId}/models`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TwoWheelerBrand'],
    }),
    updateTwoWheelerModel: builder.mutation<ITwoWheelerBrand, { brandId: string; modelName: string; newName: string }>({
      query: ({ brandId, modelName, newName }) => ({
        url: `core/two-wheeler/brands/${brandId}/models/${encodeURIComponent(modelName)}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { newName },
      }),
      invalidatesTags: ['TwoWheelerBrand'],
    }),
    deleteTwoWheelerModel: builder.mutation<void, { brandId: string; modelName: string }>({
      query: ({ brandId, modelName }) => ({
        url: `core/two-wheeler/brands/${brandId}/models/${encodeURIComponent(modelName)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TwoWheelerBrand'],
    }),
  }),
});

export const {
  useFetchTwoWheelerBrandsQuery,
  useCreateTwoWheelerBrandMutation,
  useUpdateTwoWheelerBrandMutation,
  useDeleteTwoWheelerBrandMutation,
  useCreateTwoWheelerModelMutation,
  useUpdateTwoWheelerModelMutation,
  useDeleteTwoWheelerModelMutation,
} = twoWheelerBrandsApi;
