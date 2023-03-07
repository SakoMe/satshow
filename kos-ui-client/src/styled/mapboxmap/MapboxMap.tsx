import { theme } from '@kythera/kui-components';
import { CSSProperties, ReactNode } from 'react';
import Map, { AttributionControl, ScaleControl } from 'react-map-gl';

import { ZoomControls } from './ZoomContext';

export const MapContainer = ({
  children,
  style,
  interactiveLayerIds,
  onClick,
  clickTolerance,
  projection,
  terrain,
}: {
  children?: ReactNode;
  style?: CSSProperties;
  interactiveLayerIds?: string[]; // Layers whose ids are not specified here will not appear in onClick's features array.
  onClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
  clickTolerance?: number;
  projection?:
    | {
        name:
          | 'mercator'
          | 'albers'
          | 'equalEarth'
          | 'equirectangular'
          | 'lambertConformalConic'
          | 'winkelTripel'
          | 'naturalEarth';
        center?: [number, number];
        parallels?: [number, number];
      }
    | 'mercator'
    | 'albers'
    | 'equalEarth'
    | 'equirectangular'
    | 'lambertConformalConic'
    | 'winkelTripel'
    | 'naturalEarth'
    | 'globe';
  terrain?: boolean;
}) => {
  return (
    <Map
      styleDiffing
      mapStyle={'mapbox://styles/nisanth98/cl8mo6svp000a15k1iofstk72'}
      mapboxAccessToken={
        'pk.eyJ1IjoiZXJpa2gyMDQ4IiwiYSI6ImNrMmRjczkwNDJ2YzIzbXBlamZqbDh5cHEifQ.MXZWOih1i1NyV3CAVOrnSA'
      }
      attributionControl={false}
      initialViewState={{
        longitude: -97.056,
        latitude: 39.817,
        zoom: 2,
      }}
      style={{ ...style, boxShadow: `0px 0px 1px 1px ${theme.colors.greyScale[700]}` }}
      interactiveLayerIds={interactiveLayerIds}
      onClick={onClick}
      clickTolerance={clickTolerance}
      projection={projection}
      terrain={terrain ? { source: 'mapbox-dem', exaggeration: 50 } : undefined}
      onLoad={(map) => {
        map.target.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
      }}
    >
      <AttributionControl position="top-right" />
      <ZoomControls />
      <ScaleControl />
      {children}
    </Map>
  );
};
