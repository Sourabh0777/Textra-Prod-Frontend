import { baseApi } from "../baseApi";

export const opticalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customers
    fetchOpticalCustomers: builder.query<any, string | void>({
      query: (search) =>
        search ? `/optical-service/customers?search=${search}` : "/optical-service/customers",
      providesTags: ["OpticalCustomer"],
    }),
    fetchOpticalCustomer: builder.query<any, string>({
      query: (id) => `/optical-service/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "OpticalCustomer", id }, "OpticalCustomer"],
    }),
    createOpticalCustomer: builder.mutation<any, any>({
      query: (body) => ({
        url: "/optical-service/customers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OpticalCustomer"],
    }),
    updateOpticalCustomer: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "OpticalCustomer", id }, "OpticalCustomer"],
    }),
    deleteOpticalCustomer: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OpticalCustomer"],
    }),

    // Prescriptions
    fetchPrescriptions: builder.query<any, string | void>({
      query: (customerId) =>
        customerId ? `/optical-service/prescriptions?customer_id=${customerId}` : "/optical-service/prescriptions",
      providesTags: ["Prescription"],
    }),
    fetchPrescription: builder.query<any, string>({
      query: (id) => `/optical-service/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Prescription", id }],
    }),
    createPrescription: builder.mutation<any, any>({
      query: (body) => ({
        url: "/optical-service/prescriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Prescription", "OpticalCustomer"],
    }),
    updatePrescription: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/prescriptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Prescription", id }, "Prescription"],
    }),
    deletePrescription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/prescriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescription"],
    }),

    // Lens Orders
    fetchLensOrders: builder.query<any, { customerId?: string; billId?: string } | void>({
      query: (params) => {
        let url = "/optical-service/lens-orders";
        const queryParams = new URLSearchParams();
        if (params?.customerId) queryParams.append("customer_id", params.customerId);
        if (params?.billId) queryParams.append("bill_id", params.billId);
        const queryStr = queryParams.toString();
        return queryStr ? `${url}?${queryStr}` : url;
      },
      providesTags: ["LensOrder"],
    }),
    fetchLensOrder: builder.query<any, string>({
      query: (id) => `/optical-service/lens-orders/${id}`,
      providesTags: (result, error, id) => [{ type: "LensOrder", id }],
    }),
    createLensOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/optical-service/lens-orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LensOrder"],
    }),
    updateLensOrder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/lens-orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "LensOrder", id }, "LensOrder"],
    }),
    deleteLensOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/lens-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LensOrder"],
    }),

    // Frame Orders
    fetchFrameOrders: builder.query<any, { customerId?: string; billId?: string } | void>({
      query: (params) => {
        let url = "/optical-service/frame-orders";
        const queryParams = new URLSearchParams();
        if (params?.customerId) queryParams.append("customer_id", params.customerId);
        if (params?.billId) queryParams.append("bill_id", params.billId);
        const queryStr = queryParams.toString();
        return queryStr ? `${url}?${queryStr}` : url;
      },
      providesTags: ["FrameOrder"],
    }),
    fetchFrameOrder: builder.query<any, string>({
      query: (id) => `/optical-service/frame-orders/${id}`,
      providesTags: (result, error, id) => [{ type: "FrameOrder", id }],
    }),
    createFrameOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/optical-service/frame-orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FrameOrder"],
    }),
    updateFrameOrder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/frame-orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "FrameOrder", id }, "FrameOrder"],
    }),
    deleteFrameOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/optical-service/frame-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FrameOrder"],
    }),

    // Bills
    fetchBills: builder.query<any, { customerId?: string; paymentStatus?: string; startDate?: string; endDate?: string } | void>({
      query: (params) => {
        let url = "/optical-service/bills";
        const queryParams = new URLSearchParams();
        if (params?.customerId) queryParams.append("customer_id", params.customerId);
        if (params?.paymentStatus) queryParams.append("payment_status", params.paymentStatus);
        if (params?.startDate) queryParams.append("start_date", params.startDate);
        if (params?.endDate) queryParams.append("end_date", params.endDate);
        const queryStr = queryParams.toString();
        return queryStr ? `${url}?${queryStr}` : url;
      },
      providesTags: ["Bill"],
    }),
    fetchBill: builder.query<any, string>({
      query: (id) => `/optical-service/bills/${id}`,
      providesTags: (result, error, id) => [{ type: "Bill", id }, "Bill"],
    }),
    createBill: builder.mutation<any, any>({
      query: (body) => ({
        url: "/optical-service/bills",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bill", "LensOrder", "FrameOrder", "OpticalCustomer"],
    }),
    updateBill: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/optical-service/bills/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Bill", id }, "Bill"],
    }),
    recordPayment: builder.mutation<any, { id: string; data: { amount: number; payment_method: string } }>({
      query: ({ id, data }) => ({
        url: `/optical-service/bills/${id}/payment`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Bill", id }, "Bill", "OpticalCustomer"],
    }),

    // Analytics
    fetchOpticalSummary: builder.query<any, void>({
      query: () => "/optical-service/analytics/summary",
      providesTags: ["Bill", "OpticalCustomer"],
    }),
    fetchOpticalRevenue: builder.query<any, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => `/optical-service/analytics/revenue?start_date=${startDate}&end_date=${endDate}`,
      providesTags: ["Bill"],
    }),
    fetchOpticalTopItems: builder.query<any, void>({
      query: () => "/optical-service/analytics/top-items",
      providesTags: ["Bill", "LensOrder", "FrameOrder"],
    }),
  }),
});

export const {
  useFetchOpticalCustomersQuery,
  useFetchOpticalCustomerQuery,
  useCreateOpticalCustomerMutation,
  useUpdateOpticalCustomerMutation,
  useDeleteOpticalCustomerMutation,

  useFetchPrescriptionsQuery,
  useFetchPrescriptionQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,

  useFetchLensOrdersQuery,
  useFetchLensOrderQuery,
  useCreateLensOrderMutation,
  useUpdateLensOrderMutation,
  useDeleteLensOrderMutation,

  useFetchFrameOrdersQuery,
  useFetchFrameOrderQuery,
  useCreateFrameOrderMutation,
  useUpdateFrameOrderMutation,
  useDeleteFrameOrderMutation,

  useFetchBillsQuery,
  useFetchBillQuery,
  useCreateBillMutation,
  useUpdateBillMutation,
  useRecordPaymentMutation,

  useFetchOpticalSummaryQuery,
  useFetchOpticalRevenueQuery,
  useFetchOpticalTopItemsQuery,
} = opticalApi;
