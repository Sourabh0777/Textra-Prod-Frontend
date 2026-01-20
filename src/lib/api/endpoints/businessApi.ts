import { baseApi } from "../baseApi";

export const businessApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchBusinessTypes: builder.query<any, void>({
      query: () => "/business-types",
      providesTags: ["BusinessType"],
    }),
    createBusinessType: builder.mutation<any, any>({
      query: (body) => ({
        url: "/business-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BusinessType"],
    }),
    updateBusinessType: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/business-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BusinessType"],
    }),
    deleteBusinessType: builder.mutation<any, string>({
      query: (id) => ({
        url: `/business-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BusinessType"],
    }),

    // Businesses
    fetchBusinesses: builder.query<any, void>({
      query: () => "/businesses",
      providesTags: ["Business"],
    }),
    fetchBusiness: builder.query<any, string>({
      query: (id) => `/businesses/${id}`,
      providesTags: (result, error, id) => [{ type: "Business", id }],
    }),
    createBusiness: builder.mutation<any, any>({
      query: (body) => ({
        url: "/businesses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Business"],
    }),
    updateBusiness: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/businesses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Business", id }, "Business"],
    }),
    deleteBusiness: builder.mutation<any, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Business"],
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
} = businessApi;
