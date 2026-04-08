import { IQRCode } from '@/types';
import { baseApi } from '../baseApi';

export const qrCodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchQRCodes: builder.query<IQRCode[], void>({
      query: () => '/core/qrcodes',
      providesTags: ['QRCode'],
    }),
    fetchQRCode: builder.query<IQRCode, string>({
      query: (id) => `/core/qrcodes/${id}`,
      providesTags: (result, error, id) => [{ type: 'QRCode', id }],
    }),
    createQRCode: builder.mutation<IQRCode, Partial<IQRCode>>({
      query: (body) => ({
        url: '/core/qrcodes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['QRCode'],
    }),
    updateQRCode: builder.mutation<IQRCode, { id: string; data: Partial<IQRCode> }>({
      query: ({ id, data }) => ({
        url: `/core/qrcodes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'QRCode', id }, 'QRCode'],
    }),
    deleteQRCode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/core/qrcodes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QRCode'],
    }),
    fetchBusinessesWithoutQR: builder.query<any[], void>({
      query: () => '/core/qrcodes/without-qr',
      providesTags: ['Business'],
    }),
    assignQRCode: builder.mutation<IQRCode, { business_id: string; qr_code_id: string }>({
      query: (body) => ({
        url: '/core/qrcodes/assign',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['QRCode', 'Business'],
    }),
  }),
});

export const {
  useFetchQRCodesQuery,
  useFetchQRCodeQuery,
  useCreateQRCodeMutation,
  useUpdateQRCodeMutation,
  useDeleteQRCodeMutation,
  useFetchBusinessesWithoutQRQuery,
  useAssignQRCodeMutation,
} = qrCodeApi;
