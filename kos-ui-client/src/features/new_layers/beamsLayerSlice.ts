import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import { Feature, feature, Polygon } from '@turf/turf';

import { apiSlice } from '../api/apiSlice';
import { extendKPI } from '../kpi/kpiSlice';

export const BeamsAdapter = createEntityAdapter<Feature<Polygon>>({
  selectId: (p) => p.properties?.cell_id,
});
export const extendBeamsLayer = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBeamsLayer: builder.query<EntityState<Feature<Polygon>>, void>({
      query: () => ({
        url: '/layers/beams',
        credentials: 'include',
        method: 'GET',
      }),
      transformResponse: (
        baseQueryReturnValue: {
          cell_id: string;
          polygon_coordinates: { alt: number; lat: number; lng: number }[];
        }[],
      ) => {
        return BeamsAdapter.addMany(
          BeamsAdapter.getInitialState(),
          Object.fromEntries(
            baseQueryReturnValue.map((v) => [
              v.cell_id,
              feature(
                {
                  coordinates: [
                    v.polygon_coordinates.map(({ lng, lat, alt }) => [lng, lat, alt]),
                  ],
                  type: 'Polygon',
                },
                { cell_id: v.cell_id },
              ) as Feature<Polygon>,
            ]),
          ),
        );
      },
    }),
  }),
});
export const BeamsSlice = createSlice({
  name: 'beams',
  initialState: BeamsAdapter.getInitialState(),
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
      extendBeamsLayer.endpoints.getAllBeamsLayer.matchFulfilled,
      (state, action) => {
        BeamsAdapter.upsertMany(
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
          ) as Record<string, Feature<Polygon>>,
        );
      },
    );
    builder.addMatcher(
      extendKPI.endpoints.getKPI.matchFulfilled,
      (state, { payload: { beams } }) => {
        BeamsAdapter.updateMany(
          state,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          beams.reduce((aggregator, element) => {
            if (!state.ids.includes(element.beam_id)) {
              return aggregator;
            }
            const prevState = state.entities[element.beam_id]!;
            return [
              ...aggregator,
              {
                id: [element.beam_id],
                changes: {
                  ...prevState,
                  properties: {
                    ...prevState.properties,
                    ...element,
                    cell_id: prevState?.properties?.cell_id ?? element.beam_id,
                  },
                },
              },
            ];
          }, []),
        );
      },
    );
  },
});

export const { useGetAllBeamsLayerQuery } = extendBeamsLayer;
export const {
  selectAll: SelectAllBeams,
  selectById: SelectBeamsByID,
  selectEntities: SelectBeamEntities,
  selectIds: SelectBeamIds,
  selectTotal: SelectBeamTotal,
} = BeamsAdapter.getSelectors();
export const { highlightRow } = BeamsSlice.actions;
