import { store } from '../../../app/store';
import { layerSlice } from '../layersSlice';

describe('toggleVisibility', () => {
  it('toggles a layer in the state', () => {
    store.dispatch(
      layerSlice.actions.toggleVisibility({
        layerName: 'beams',
      }),
    );
    const state = store.getState().layers;
    expect(state.layersControls.beams.visible).toEqual(true);
    return;
  });
});

describe('applyKeyChanges invalid max', () => {
  it('attempts to set a key change that should be rejected', () => {
    store.dispatch(
      layerSlice.actions.applyKeyChanges({
        bins: 0,
        extendBins: false,
        min: 0,
        max: 0,
        colorSetting: 'black',
      }),
    );
    const state = store.getState().layers;
    expect(state.keySettings.bins).toEqual(1);
    expect(state.keySettings.max).toEqual(1);
  });
});

describe('applyKeyChanges invalid min', () => {
  it('attempts to set a key change that should be rejected', () => {
    store.dispatch(
      layerSlice.actions.applyKeyChanges({
        bins: 0,
        extendBins: false,
        min: 1,
        max: -1,
        colorSetting: 'black',
      }),
    );
    const state = store.getState().layers;
    expect(state.keySettings.bins).toEqual(1);
    expect(state.keySettings.min).toEqual(0);
    expect(state.keySettings.max).toEqual(1);
  });
});

describe('reorder', () => {
  it('reorders the layers', () => {
    store.dispatch(
      layerSlice.actions.reorder({
        newLayerOrder: [
          { keyName: 'beams', index: 0 },
          { keyName: 'gateways', index: 1 },
          { keyName: 'terminals', index: 2 },
        ],
      }),
    );
    const state = store.getState();
    expect(state.layers.layersControls.beams).toEqual({
      color: 'gray',
      visible: true,
      index: 0,
    });
    expect(state.layers.layersControls.terminals).toEqual({
      color: 'orange',
      visible: false,
      index: 2,
    });
    expect(state.layers.layersControls.gateways).toEqual({
      color: 'blue',
      visible: false,
      index: 1,
    });
    return;
  });
});

export {};
