import { apiSlice } from '../api/apiSlice';

export const extendTerminals = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTerminals: builder.query<unknown, void>({
      query: () => ({
        url: '/data/terminals',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllTerminalsQuery } = extendTerminals;
