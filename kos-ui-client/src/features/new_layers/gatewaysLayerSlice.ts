import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import {
  Feature,
  feature,
  FeatureCollection,
  featureCollection,
  Point,
} from '@turf/turf';

import { apiSlice } from '../api/apiSlice';
import { extendKPI } from '../kpi/kpiSlice';

export const GatewaysAdapter = createEntityAdapter<Feature<Point>>({
  selectId: (p) => p.properties?.gateway_id,
});
export const extendGatewaysLayer = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllGatewaysLayer: builder.query<EntityState<Feature<Point>>, void>({
      query: () => ({
        url: '/layers/gateways',
        credentials: 'include',
        method: 'GET',
      }),
      transformResponse: (
        response: {
          gateway_id: string;
          location: number[];
        }[],
      ) => {
        return GatewaysAdapter.addMany(
          GatewaysAdapter.getInitialState(),
          Object.fromEntries(
            response.map((g) => [
              g.gateway_id,
              feature(
                {
                  type: 'Point',
                  coordinates: [g.location[1], g.location[0], g.location[2]], // [g.location.at(0)?.lon ?? 0, g.location.at(0)?.lat ?? 0],
                },
                { gateway_id: g.gateway_id },
              ),
            ]),
          ),
        );
      },
    }),
  }),
});
export const GatewaysSlice = createSlice({
  name: 'gateways',
  initialState: GatewaysAdapter.getInitialState(),
  reducers: {
    highlightRow: (state, action: { payload: string; type: string }) => {
      // Set all rows to highlighted: undefined
      // Set beam[action.payload.id] to highlighted: true
      state.ids.map((id) => {
        state.entities[id] = {
          ...state.entities[id]!,
          properties: {
            ...state.entities[id]?.properties,
            highlighted:
              id === action.payload
                ? !state.entities[id]?.properties?.highlighted ?? true
                : undefined,
          },
        };
      });
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      extendGatewaysLayer.endpoints.getAllGatewaysLayer.matchFulfilled,
      (state, action) => {
        GatewaysAdapter.upsertMany(
          state,
          Object.fromEntries(
            action.payload.ids.map((i) => {
              const { geometry, properties, type, id, bbox } =
                action.payload.entities[i]!;
              const {
                properties: StateProperties,
                id: StateId,
                bbox: StateBbox,
              } = state.entities[i] ?? {};
              // Maintain additional properties from state such as highlighted.
              // Whiffing getting state is A-OK.
              return [
                i,
                {
                  geometry,
                  properties: { ...properties, ...StateProperties },
                  type,
                  id: id ?? StateId,
                  bbox: bbox ?? StateBbox,
                },
              ];
            }),
          ) as Record<string, Feature<Point>>,
        );
      },
    );
    builder.addMatcher(extendKPI.endpoints.getKPI.matchFulfilled, (state, action) => {
      GatewaysAdapter.updateMany(
        state,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        action.payload.gateways.reduce((aggregator, element) => {
          if (!state.ids.includes(element.gateway_id)) {
            return aggregator;
          }
          const prevState = state.entities[element.gateway_id]!;
          return [
            ...aggregator,
            {
              id: [element.gateway_id],
              changes: {
                ...prevState,
                properties: { ...prevState.properties, ...element },
              },
            },
          ];
        }, []),
      );
    });
  },
});

export const { useGetAllGatewaysLayerQuery } = extendGatewaysLayer;
export const {
  selectAll: SelectAllGateways,
  selectById: SelectGatewaysByID,
  selectEntities: SelectGatewaysEntities,
  selectIds: SelectGatewayIds,
  selectTotal: SelectGatewayTotal,
} = GatewaysAdapter.getSelectors();
export const { highlightRow } = GatewaysSlice.actions;
