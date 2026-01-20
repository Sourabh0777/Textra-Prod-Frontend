import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      // Add any global headers here if needed
      return headers;
    },
  }),
  tagTypes: ["User", "Business", "BusinessType", "Customer", "Vehicle", "Service", "Reminder", "WhatsAppLog"],
  endpoints: () => ({}),
});
