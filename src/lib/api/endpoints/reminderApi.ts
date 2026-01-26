import { baseApi } from '../baseApi';

export const reminderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchReminders: builder.query<any, string | void>({
      query: (serviceId) => (serviceId ? `/reminders?service_id=${serviceId}` : '/reminders'),
      providesTags: ['Reminder'],
    }),
    fetchReminder: builder.query<any, string>({
      query: (id) => `/reminders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reminder', id }, 'Reminder'],
    }),
    markVisited: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reminders/${id}/mark-visited`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Reminder', id }, 'Reminder', { type: 'Service' as any }],
    }),
    createReminder: builder.mutation<any, any>({
      query: (body) => ({
        url: '/reminders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reminder'],
    }),
    updateReminder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/reminders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Reminder', id }, 'Reminder'],
    }),
    deleteReminder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reminders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reminder'],
    }),
    triggerReminderWorker: builder.mutation<any, { reminder_id: string }>({
      query: (body) => ({
        url: '/reminders/trigger-worker',
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
