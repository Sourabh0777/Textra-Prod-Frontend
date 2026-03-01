import { baseApi } from '../baseApi';

export const whatsappApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchWhatsAppLogs: builder.query<any, void>({
      query: () => '/bike-service/whatsapp-logs',
      providesTags: ['WhatsAppLog'],
    }),
    fetchWhatsAppLog: builder.query<any, string>({
      query: (id) => `/bike-service/whatsapp-logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'WhatsAppLog', id }],
    }),
  }),
});

export const { useFetchWhatsAppLogsQuery, useFetchWhatsAppLogQuery } = whatsappApi;
