import { baseApi } from "../baseApi";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchServices: builder.query<any, string | void>({
      query: (vehicleId) => (vehicleId ? `/services?vehicle_id=${vehicleId}` : "/services"),
      providesTags: ["Service"],
    }),
    fetchService: builder.query<any, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation<any, any>({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }, "Service"],
    }),
    deleteService: builder.mutation<any, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const { useFetchServicesQuery, useFetchServiceQuery, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } = serviceApi;
