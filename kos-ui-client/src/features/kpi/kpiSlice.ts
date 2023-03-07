import { KpiBeam, KpiGateway, KpiRegion, KpiTerminal } from '../../ts/types/kpi';
import { apiSlice } from '../api/apiSlice';

export const extendKPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKPI: builder.query<
      {
        regions: KpiRegion[];
        gateways: KpiGateway[];
        beams: KpiBeam[];
        terminals: KpiTerminal[];
      },
      void
    >({
      query: () => ({
        url: '/data/kpi',
        credentials: 'include',
        method: 'get',
      }),
    }),
  }),
});

export const { useGetKPIQuery } = extendKPI;
