import { baseApi } from '../baseApi';

export const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchReminders: builder.query<any, string | void>({
      query: (serviceId) =>
        serviceId ? `/vehicle-service/reminders?service_id=${serviceId}` : '/vehicle-service/reminders',
      providesTags: ['Reminder'],
    }),
    fetchReminder: builder.query<any, string>({
      query: (id) => `/vehicle-service/reminders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reminder', id }, 'Reminder'],
    }),
    markVisited: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vehicle-service/reminders/${id}/mark-visited`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reminder', id }, 'Reminder', { type: 'Service' as any }],
    }),
    createReminder: builder.mutation<any, any>({
      query: (body) => ({
        url: '/vehicle-service/reminders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reminder'],
    }),
    updateReminder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/vehicle-service/reminders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Reminder', id }, 'Reminder'],
    }),
    deleteReminder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/vehicle-service/reminders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reminder'],
    }),
    triggerReminderWorker: builder.mutation<any, { reminder_id: string }>({
      query: (body) => ({
        url: '/vehicle-service/vehicle-service-reminders/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reminder'],
    }),
  }),
});

export const {
  useFetchRemindersQuery,
  useFetchReminderQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useMarkVisitedMutation,
  useTriggerReminderWorkerMutation,
} = reminderApi;
