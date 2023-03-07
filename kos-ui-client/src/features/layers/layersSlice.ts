import { createSlice } from '@reduxjs/toolkit';
import chroma from 'chroma-js';
import { Scale } from 'chroma-js';

import { LayerType } from '../../ts/types/layers';

type LayerSliceState = {
  keySettings: {
    colorSetting: Scale | string;
    activeLayer: 'beams' | 'terminals' | 'gateways' | undefined;
    bins: number;
    extendBins: boolean;
    min: number;
    max: number;
  };
  layersControls: {
    beams: LayerType;
    terminals: LayerType;
    gateways: LayerType;
  };
};

// useGetTerminalLayer from the api slice inside the layer component
// to apply color scales

// Larger slice for accessing and managing the overall layer properties.
export const layerSlice = createSlice({
  name: 'layer',
  initialState: {
    keySettings: {
      colorSetting: chroma.scale(),
      activeLayer: undefined,
      bins: 1,
      extendBins: false,
      min: 0,
      max: 1,
    },
    layersControls: {
      beams: { color: 'gray', visible: false, index: 0 },
      terminals: {
        color: 'orange',
        visible: false,
        index: 0,
      },
      gateways: {
        color: 'blue',
        visible: false,
        index: 0,
      },
    },
  } as LayerSliceState,
  reducers: {
    reorder: (
      state,
      {
        payload,
      }: {
        payload: {
          newLayerOrder: {
            keyName: keyof LayerSliceState['layersControls'];
            index: number;
          }[];
        };
      },
    ) => {
      // Reorder the layers
      // This matters for zIndex so that pointer events work on the top layer
      const newLayers: { beams: LayerType; terminals: LayerType; gateways: LayerType } =
        state.layersControls;
      payload.newLayerOrder.forEach((l) => {
        if (newLayers[l.keyName] !== undefined) {
          newLayers[l.keyName].index = l.index;
        }
      });
      // zIndex: 400 - layer.index
      // return { ...state, layersControls: newLayers };
    },
    toggleVisibility: (
      state,
      { payload }: { payload: { layerName: keyof LayerSliceState['layersControls'] } },
    ) => {
      // From the layers panel DND, toggles the layer's show prop
      return {
        ...state,
        layersControls: {
          ...state.layersControls,
          [payload.layerName]: {
            ...state.layersControls[payload.layerName],
            visible: state.layersControls[payload.layerName].visible === false,
          },
        },
      };
    },
    applyKeyChanges: (
      state,
      {
        payload,
      }: {
        payload: {
          bins: number;
          extendBins: boolean;
          min: number;
          max: number;
          colorSetting: string | Scale;
        };
      },
    ) => {
      // Apply changes made from ediing the key settings
      // After dispatching this, also dispatch applyColorsToLayerElements
      // I'm imagining a button at the bottom of the key settings panel that says "Save" or "Apply"
      // That way all the properties are set at once, with fewer updates...?
      // newMin and newMax prevent comparison failures
      const newMin =
        payload.min == state.keySettings.min ? state.keySettings.min : payload.min;
      const newMax =
        payload.max == state.keySettings.max ? state.keySettings.max : payload.max;
      return {
        ...state,
        keySettings: {
          ...state.keySettings,
          bins:
            payload.bins > 20 || payload.bins < 1 ? state.keySettings.bins : payload.bins,
          extendBins: payload.extendBins,
          max: newMax > newMin ? newMax : state.keySettings.max,
          min: newMin < newMax ? newMin : state.keySettings.min,
          colorSetting: payload.colorSetting,
        },
      };
    },
  },
});
