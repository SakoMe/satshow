import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { Plan } from '../../ts/types/plan';

const planEntityAdapter = createEntityAdapter<Plan>();

// Need to identify active/selected plan
export const planSlice = createSlice({
  name: 'plan',
  initialState: planEntityAdapter.getInitialState(),
  reducers: {
    reset: (state) => planEntityAdapter.removeAll(state),
    addPlan: planEntityAdapter.addOne, // store.dispatch(addPlan({} as Plan));
    updatePlan: planEntityAdapter.updateOne,
  },
});

export const reset = planSlice.actions.reset;
export const addPlan = planSlice.actions.addPlan;
export const updatePlan = planSlice.actions.updatePlan;

export const {
  selectAll: selectPlans,
  selectById: selectPlanById,
  selectEntities: selectPlanEntities,
  selectIds: selectPlanIds,
  selectTotal: selectPlanTotal,
} = planEntityAdapter.getSelectors((state: RootState) => state.plan);
