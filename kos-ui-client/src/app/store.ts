import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '../features/api/apiSlice';
import { layerSlice } from '../features/layers/layersSlice';
import { BeamsSlice } from '../features/new_layers/beamsLayerSlice';
import { GatewaysSlice } from '../features/new_layers/gatewaysLayerSlice';
import { TerminalsSlice } from '../features/new_layers/terminalsLayerSlice';
import { planSlice } from '../features/plan/planSlice';
import { servicesSlice } from '../features/services/servicesSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    layers: layerSlice.reducer,
    plan: planSlice.reducer,
    services: servicesSlice.reducer,
    beams: BeamsSlice.reducer,
    gateways: GatewaysSlice.reducer,
    terminals: TerminalsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
