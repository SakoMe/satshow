import { createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';
import { Feature, feature, LineString, Point } from '@turf/turf';

import { apiSlice } from '../api/apiSlice';
import { extendKPI } from '../kpi/kpiSlice';

export const TerminalsAdapter = createEntityAdapter<Feature<Point>>({
  selectId: (p) => p.properties?.terminal_id,
});
// export const TerminalPathsAdapter = createEntityAdapter<Feature<LineString>>({
//   selectId: (p) => p.properties?.terminal_id,
// });
export const extendTerminalsLayer = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTerminalsLayer: builder.query<EntityState<Feature<Point>>, void>({
      query: () => ({
        url: '/layers/terminals',
        credentials: 'include',
        method: 'GET',
      }),
      transformResponse: (
        response: {
          terminal_id: string;
          location: number[];
          mobile_user: boolean;
          placement_id: string;
          mobility_histories: {
            alt: number;
            lat: number;
            lon: number;
          }[];
        }[],
      ) => {
        // TerminalPathsAdapter.addMany(
        //   TerminalPathsAdapter.getInitialState(),
        //   Object.fromEntries(
        //     response.map((t) => [
        //       t.terminal_id,
        //       feature(
        //         {
        //           type: 'LineString',
        //           coordinates: t.mobility_histories.map((h) => [h.lon, h.lat, h.alt]),
        //         },
        //         {
        //           mobile_user: t.mobile_user,
        //           placement_id: t.placement_id,
        //           // mobility_histories: t.mobility_histories,
        //           terminal_id: t.terminal_id,
        //         },
        //       ),
        //     ]),
        //   ),
        // );
        return TerminalsAdapter.addMany(
          TerminalsAdapter.getInitialState(),
          Object.fromEntries(
            response.map((t) => [
              t.terminal_id,
              feature(
                {
                  type: 'Point',
                  coordinates: [t.location[1], t.location[0], t.location[2]], // [t.location.at(0)?.lon ?? 0, t.location.at(0)?.lat ?? 0],
                },
                {
                  mobile_user: t.mobile_user,
                  placement_id: t.placement_id,
                  // mobility_histories: t.mobility_histories,
                  terminal_id: t.terminal_id,
                },
              ),
            ]),
          ),
        );
      },
    }),
  }),
});
export const TerminalsSlice = createSlice({
  name: 'terminals',
  initialState: TerminalsAdapter.getInitialState(),
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
      extendTerminalsLayer.endpoints.getAllTerminalsLayer.matchFulfilled,
      (state, action) => {
        TerminalsAdapter.upsertMany(
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
      TerminalsAdapter.updateMany(
        state,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        action.payload.terminals.reduce((aggregator, element) => {
          if (!state.ids.includes(element.terminal_id)) {
            return aggregator;
          }
          const prevState = state.entities[element.terminal_id]!;
          return [
            ...aggregator,
            {
              id: [element.terminal_id],
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
// export const TerminalPathsSlice = createSlice({
//   name: 'terminal_paths',
//   initialState: TerminalPathsAdapter.getInitialState(),
//   reducers: {
//     highlightRow: (state, action: { payload: string; type: string }) => {
//       // Set all rows to highlighted: undefined
//       // Set beam[action.payload.id] to highlighted: true
//       state.ids.map((id) => {
//         state.entities[id] = {
//           ...state.entities[id]!,
//           properties: {
//             ...state.entities[id]?.properties,
//             highlighted:
//               id === action.payload
//                 ? !state.entities[id]?.properties?.highlighted ?? true
//                 : undefined,
//           },
//         };
//       });
//     },
//   },
//   extraReducers(builder) {
//     builder.addMatcher(
//       extendTerminalsLayer.endpoints.getAllTerminalsLayer.matchFulfilled,
//       (state, action) => {
//         TerminalPathsAdapter.upsertMany(
//           state,
//           Object.fromEntries(
//             action.payload.ids.map((i) => {
//               const { geometry, properties, type, id, bbox } =
//                 action.payload.entities[i]!;
//               const {
//                 properties: StateProperties,
//                 geometry: StateGeometry,
//                 id: StateId,
//                 bbox: StateBbox,
//               } = state.entities[i] ?? {};
//               // Maintain additional properties from state such as highlighted.
//               // Whiffing getting state is A-OK.
//               return [
//                 i,
//                 {
//                   // geometry: StateGeometry,
//                   properties: { ...properties, ...StateProperties },
//                   type,
//                   id: id ?? StateId,
//                   bbox: bbox ?? StateBbox,
//                 },
//               ];
//             }),
//           ) as Record<string, Feature<LineString>>,
//         );
//       },
//     );
//     // builder.addMatcher(extendKPI.endpoints.getKPI.matchFulfilled, (state, action) => {
//     //   TerminalsAdapter.updateMany(
//     //     state,
//     //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     //     // @ts-ignore
//     //     action.payload.terminals.reduce((aggregator, element) => {
//     //       if (!state.ids.includes(element.terminal_id)) {
//     //         return aggregator;
//     //       }
//     //       const prevState = state.entities[element.terminal_id]!;
//     //       return [
//     //         ...aggregator,
//     //         {
//     //           id: [element.terminal_id],
//     //           changes: {
//     //             ...prevState,
//     //             properties: { ...prevState.properties, ...element },
//     //           },
//     //         },
//     //       ];
//     //     }, []),
//     //   );
//     // });
//   },
// });

export const { useGetAllTerminalsLayerQuery } = extendTerminalsLayer;
export const {
  selectAll: SelectAllTerminals,
  selectById: SelectTerminalsByID,
  selectEntities: SelectTerminalEntities,
  selectIds: SelectTerminalIds,
  selectTotal: SelectTerminalTotal,
} = TerminalsAdapter.getSelectors();
export const { highlightRow } = TerminalsSlice.actions;
