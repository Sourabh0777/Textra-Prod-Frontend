import { baseApi } from '../baseApi';

export const whatsappApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchWhatsAppLogs: builder.query<any, void>({
      query: () => 'core/whatsapp-logs',
      providesTags: ['WhatsAppLog'],
    }),
    fetchWhatsAppLog: builder.query<any, string>({
      query: (id) => `core/whatsapp-logs/${id}`,
      providesTags: (result, error, id) => [{ type: 'WhatsAppLog', id }],
    }),
    fetchWhatsAppTemplates: builder.query<any, void>({
      query: () => '/core/whatsapp/templates',
      providesTags: ['WhatsAppTemplate'],
    }),
    fetchTemplateConfigs: builder.query<any, void>({
      query: () => '/core/template',
      providesTags: ['WhatsAppTemplateConfig' as any],
    }),
    updateTemplateConfig: builder.mutation<any, any>({
      query: (data) => ({
        url: '/core/template',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WhatsAppTemplateConfig' as any],
    }),
  }),
});

export const {
  useFetchWhatsAppLogsQuery,
  useFetchWhatsAppLogQuery,
  useFetchWhatsAppTemplatesQuery,
  useFetchTemplateConfigsQuery,
  useUpdateTemplateConfigMutation,
} = whatsappApi;
