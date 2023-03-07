import { GeoBoundingBox } from '@deck.gl/geo-layers/src/tile-layer/types';
import { BitmapLayer, TileLayer } from 'deck.gl/typed';

import { apiSlice } from '../api/apiSlice';

declare type RainViewerResponse = {
  version: string;
  generated: number;
  host: string;
  radar: {
    past: {
      time: string;
      path: string;
    }[];
    nowcast: {
      time: string;
      path: string;
    }[];
  };
  satellite: {
    infrared: {
      time: string;
      path: string;
    }[];
  };
};

export const extendRainViewer = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRainViewerLayer: builder.query<TileLayer, void>({
      query: () => ({
        url: '/rainviewer',
        credentials: 'include',
        method: 'GET',
      }),
      transformResponse: (response: RainViewerResponse) => {
        return new TileLayer({
          id: 'rainviewer',
          data:
            response.host +
            response.radar.past.at(-1)?.path +
            '/256/{z}/{x}/{y}/3/1_1.png',

          maxZoom: 14,
          tileSize: 256,

          renderSubLayers: (props) => {
            const { west, south, east, north } = props.tile.bbox as GeoBoundingBox;

            return new BitmapLayer(props, {
              data: null,
              image: props.data,
              bounds: [west, south, east, north],
              opacity: 0.7,
            });
          },
        });
      },
    }),
  }),
});

export const { useGetRainViewerLayerQuery } = extendRainViewer;
