import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientClerkToken } from '../clerk/clerkClientToken';
import { env } from '@/env';

const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const token = await getClientClerkToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Business', 'BusinessType', 'Customer', 'Vehicle', 'Service', 'Reminder', 'WhatsAppLog'],
  endpoints: () => ({}),
});
