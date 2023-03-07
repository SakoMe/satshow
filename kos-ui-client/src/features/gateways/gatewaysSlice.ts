import { Service_segment_gateway } from '../../ts/types/fromPrisma';
import { apiSlice } from '../api/apiSlice';

export const extendGateways = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGateways: builder.query<Required<Service_segment_gateway>[], void>({
      query: () => ({
        url: '/segment-gateway',
        credentials: 'include',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllGatewaysQuery } = extendGateways;
