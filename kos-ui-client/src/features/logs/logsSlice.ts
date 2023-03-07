import { apiSlice } from '../api/apiSlice';

export const extendLogs = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLogs: builder.query({
      query: () => ({
        url: '/data/logs',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllLogsQuery } = extendLogs;
