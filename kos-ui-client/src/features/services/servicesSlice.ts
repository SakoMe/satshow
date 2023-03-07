import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { Service_segment } from '../../ts/types/fromPrisma';

const serviceEntityAdapter = createEntityAdapter<Service_segment>();

export const servicesSlice = createSlice({
  name: 'services',
  initialState: serviceEntityAdapter.getInitialState(),
  reducers: {
    addService: serviceEntityAdapter.addOne,
    updateService: serviceEntityAdapter.updateOne,
  },
});

export const addService = servicesSlice.actions.addService;
export const updateService = servicesSlice.actions.updateService;

export const {
  selectAll: selectAllSerivces,
  selectById: SelectServiceById,
  selectEntities: selectServicesEntities,
  selectIds: selectServicesIds,
  selectTotal: selectServicesTotal,
} = serviceEntityAdapter.getSelectors((state: RootState) => state.services);
