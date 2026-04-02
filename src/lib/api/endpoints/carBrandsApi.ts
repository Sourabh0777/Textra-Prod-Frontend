import { ICarBrand, ICarModel } from '@/types';
import { baseApi } from '../baseApi';

export const carBrandsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Brands
    fetchBrands: builder.query<ICarBrand[], void>({
      query: () => 'core/cars/brands',
      providesTags: ['CarBrand'],
    }),
    createBrand: builder.mutation<ICarBrand, Partial<ICarBrand>>({
      query: (body) => ({
        url: 'core/cars/brands',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CarBrand'],
    }),
    updateBrand: builder.mutation<ICarBrand, { id: string; data: Partial<ICarBrand> }>({
      query: ({ id, data }) => ({
        url: `core/cars/brands/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'CarBrand', id }, 'CarBrand'],
    }),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `core/cars/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CarBrand'],
    }),

    // Models
    createModel: builder.mutation<ICarModel, { brandId: string; data: Partial<ICarModel> }>({
      query: ({ brandId, data }) => ({
        url: `core/cars/brands/${brandId}/models`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CarBrand'],
    }),
    updateModel: builder.mutation<ICarModel, { brandId: string; modelName: string; newName: string }>({
      query: ({ brandId, modelName, newName }) => ({
        url: `core/cars/brands/${brandId}/models/${encodeURIComponent(modelName)}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { newName },
      }),
      invalidatesTags: ['CarBrand'],
    }),
    deleteModel: builder.mutation<void, { brandId: string; modelName: string }>({
      query: ({ brandId, modelName }) => ({
        url: `core/cars/brands/${brandId}/models/${encodeURIComponent(modelName)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CarBrand'],
    }),
  }),
});

export const {
  useFetchBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = carBrandsApi;
