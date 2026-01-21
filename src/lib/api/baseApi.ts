import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientClerkToken } from '../clerk/clerkClientToken';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: async (headers) => {
      const token = await getClientClerkToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Add any global headers here if needed
      return headers;
    },
  }),
  tagTypes: ['User', 'Business', 'BusinessType', 'Customer', 'Vehicle', 'Service', 'Reminder', 'WhatsAppLog'],
  endpoints: () => ({}),
});
