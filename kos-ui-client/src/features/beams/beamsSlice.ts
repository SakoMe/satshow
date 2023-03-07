import { apiSlice } from '../api/apiSlice';

export const extendBeams = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBeams: builder.query({
      query: () => ({
        url: '/data/beams',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllBeamsQuery } = extendBeams;
