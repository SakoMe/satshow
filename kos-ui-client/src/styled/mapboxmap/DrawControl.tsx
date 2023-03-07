/* eslint-disable @typescript-eslint/ban-ts-comment */
import { theme } from '@kythera/kui-components';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { ControlPosition, MapRef } from 'react-map-gl';
import { useControl } from 'react-map-gl';

export interface Coordinates {
  lat: number;
  lng: number;
}

type DrawControlProps = {
  position?: ControlPosition;
  onCreate?: (e: MapboxDraw.DrawCreateEvent) => void;
  onUpdate?: (e: MapboxDraw.DrawUpdateEvent) => void;
  onDelete?: (e: MapboxDraw.DrawDeleteEvent) => void;
  features: Record<string, turf.Feature>;
  updateFeatures: Dispatch<SetStateAction<Record<string, turf.Feature>>>;
  drawProps?: ConstructorParameters<typeof MapboxDraw>[0];
  mode?: 'draw_polygon' | 'draw_point' | 'draw_line_string' | 'simple_select' | 'static';
};

export function DrawControl(props: DrawControlProps) {
  const [drawMode, setDrawMode] = useState(props.drawProps?.defaultMode ?? '');
  const draw: MapboxDraw = useControl<MapboxDraw>(
    () => new MapboxDraw(props.drawProps),
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', props.onCreate ?? (() => null));
      map.on('draw.update', props.onUpdate ?? (() => null));
      map.on('draw.delete', props.onDelete ?? (() => null));
      map.on('draw.modechange', (event) => setDrawMode(event.mode));
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', props.onCreate ?? (() => null));
      map.off('draw.update', props.onUpdate ?? (() => null));
      map.off('draw.delete', props.onDelete ?? (() => null));
    },
    {
      position: props.position,
    },
  );

  useEffect(() => {
    const newFeatures: typeof props.features = {};
    Object.entries(props.features).forEach(([k, v]) => {
      if (draw.get(k) === undefined) {
        console.log(`Adding feature: ${k}`);
        // @ts-ignore The type name is a string in turf but a literal in Mapbox
        const [x] = draw.add({
          ...v,
          id: k,
        });
        newFeatures[x] = { ...v, id: x };
      } else {
        if (v !== undefined) {
          console.log(draw.get(k)?.properties, v.properties?.region_name);
          if (draw.get(k)?.properties?.region_name !== v.properties?.region_name) {
            draw.setFeatureProperty(
              k,
              'region_name',
              v.properties?.region_name ?? 'New Region',
            );
          }
        }
      }
    });
    draw.getAll().features.forEach((feature) => {
      if (
        Object.entries({ ...props.features, ...newFeatures }).find(
          ([key, value]) => key === feature.id || value.id === feature.id,
        ) === undefined
      ) {
        draw.delete(`${feature.id!}`);
      }
    });
    if (Object.entries(newFeatures).length > 0) {
      // console.log('UPDATE FEATURES');
      props.updateFeatures({ ...props.features, ...newFeatures });
    }
  }, [props.features]);

  useEffect(() => {
    if (props.mode === 'draw_polygon') draw.changeMode(draw.modes.DRAW_POLYGON);
    if (props.mode === 'simple_select') draw.changeMode(draw.modes.SIMPLE_SELECT);
    setDrawMode(props.mode ?? '');
  }, [props.mode]);
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '16px',
        zIndex: 9999,
        backgroundColor: theme.colors.purple[200],
        border: `1px solid ${theme.colors.greyScale[700]}`,
        padding: '8px 16px',
        left: '50px',
        top: '10px',
        lineHeight: '1rem',
        visibility: drawMode === 'draw_polygon' ? 'visible' : 'hidden',
      }}
    >
      {'DRAWING MODE ON'}
    </div>
  );
}
