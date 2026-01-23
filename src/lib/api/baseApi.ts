import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getClientClerkToken } from '../clerk/clerkClientToken';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: async (headers) => {
    const token = await getClientClerkToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    // Convert Headers object to plain object for logging
    const headersObj = Object.fromEntries(headers.entries());
    console.log('🚀 ~ headers:', headersObj);

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Business', 'BusinessType', 'Customer', 'Vehicle', 'Service', 'Reminder', 'WhatsAppLog'],
  endpoints: () => ({}),
});
