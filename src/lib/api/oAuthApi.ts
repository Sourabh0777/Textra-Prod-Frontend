import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const oAuthApi = createApi({
  reducerPath: 'oAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/api`,
  }),
  endpoints: (builder) => ({
    facebookOAuth: builder.mutation<any, { code: string; userID: string }>({
      query: (credentials) => ({
        url: `/oauth`,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useFacebookOAuthMutation } = oAuthApi;
