import { LayerElement } from '../../ts/types/layers';
import { apiSlice } from '../api/apiSlice';

export const extendLayers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTerminalLayer: builder.query<LayerElement[], void>({
      providesTags: ['Layers/Terminal'],
      query: () => ({ url: '/layers/terminals', credentials: 'include', method: 'GET' }),
    }),
    getGatewayLayer: builder.query<LayerElement[], void>({
      providesTags: ['Layers/Gateway'],
      query: () => ({ url: '/layers/gateways', credentials: 'include', method: 'GET' }),
    }),
    getBeamLayer: builder.query<LayerElement[], void>({
      providesTags: ['Layers/Beam'],
      query: () => ({ url: '/layers/beams', credentials: 'include', method: 'GET' }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetTerminalLayerQuery, useGetGatewayLayerQuery, useGetBeamLayerQuery } =
  extendLayers;
