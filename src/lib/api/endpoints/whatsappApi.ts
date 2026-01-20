import { baseApi } from "../baseApi";

export const whatsappApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchWhatsAppLogs: builder.query<any, void>({
      query: () => "/whatsapp-logs",
      providesTags: ["WhatsAppLog"],
    }),
    fetchWhatsAppLog: builder.query<any, string>({
      query: (id) => `/whatsapp-logs/${id}`,
      providesTags: (result, error, id) => [{ type: "WhatsAppLog", id }],
    }),
  }),
});

export const { useFetchWhatsAppLogsQuery, useFetchWhatsAppLogQuery } = whatsappApi;
