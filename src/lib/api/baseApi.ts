import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getClientClerkToken } from '../clerk/clerkClientToken';
import { env } from '@/env';
import { ApiResponse } from '@/types';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const token = await getClientClerkToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // If the request succeeded at the network level, check our custom 'success' flag
  if (result.data) {
    const response = result.data as ApiResponse<any>;

    if (response.success === false) {
      return {
        error: {
          status: response.error?.code || 400,
          data: response,
        },
      };
    }
    // Unwrap the data for the component
    return { data: response.data };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Business',
    'BusinessType',
    'Customer',
    'Vehicle',
    'Service',
    'Reminder',
    'WhatsAppLog',
    'WhatsAppTemplate',
    'WhatsAppTemplateConfig',
    'State',
    'Zone',
  ],
  endpoints: () => ({}),
});
