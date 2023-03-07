/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Button,
  Datatable,
  FlexContainer,
  GridContainer,
  Icon,
  Text,
  theme,
} from '@kythera/kui-components';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { Polygon } from '@turf/turf';
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Popup } from 'react-map-gl';

import { useFileReader } from '../../../../hooks/useFileReader';
import { useGXTFileReader } from '../../../../hooks/useGXTFileReader';
import { DrawControl, MapContainer } from '../../../../styled/mapboxmap';
import { Service_segment_region } from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const AddRegions = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [drawMode, setDrawMode] = useState<
    | 'draw_polygon'
    | 'draw_point'
    | 'draw_line_string'
    | 'simple_select'
    | 'static'
    | undefined
  >();

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const { contents: fileContents, name } = useFileReader<{ lat: number; long: number }>(
    fileUploadRef.current?.files,
  );
  const { region } = useGXTFileReader(fileUploadRef.current?.files);
  useEffect(() => {
    if (
      fileUploadRef.current?.files?.item(0)?.name.endsWith('.gxt') &&
      region !== undefined
    ) {
      setFeatures((fts) => ({ ...fts, region }));
    } else {
      if (fileContents.length < 3) return;
      setFeatures((fts) => {
        // This might work, but the state is disconnected from the map. Record could be duplicated.
        const newPolygon = turf.polygon([fileContents.map((z) => [z.lat, z.long])], {
          region_name: 'New Region',
        });
        return { ...fts, [name]: newPolygon };
      });
    }
  }, [fileContents, region]);

  const [rows, setRows] = useState<Array<Service_segment_region & { selected: boolean }>>(
    state.regions.map((r) => ({
      ...r,
      selected: false,
    })),
  );
  // Add previously drawn regions to the map.
  const [features, setFeatures] = useState<Record<string, turf.Feature>>(
    // {},
    Object.fromEntries(
      state.regions.map((r) => {
        console.log(r.region_name);
        return [
          r.id,
          turf.feature(
            { coordinates: r.coordinates, type: 'Polygon' },
            { region_name: r.region_name },
            { id: r.id }, // Id conflicts from database and map are resolved here. It'd be a lot nicer typewise if the region ids were strings.
          ),
        ];
      }),
    ),
  );

  const onUpdate = useCallback(
    (e: MapboxDraw.DrawCreateEvent) => {
      setFeatures((oldFeatures) => {
        const newFeatures = {
          ...oldFeatures,
          ...(Object.fromEntries(
            e.features.map((f) => {
              return [
                f.id,
                {
                  ...f,
                  properties: { region_name: f.properties?.region_name ?? 'New Region' },
                },
              ];
            }),
          ) as typeof features),
        };
        setRows(
          // @ts-ignore
          Object.entries(newFeatures).map(([k, v]) => ({
            // @ts-ignore
            coordinates: v.geometry.coordinates,
            region_name: newFeatures[k].properties?.region_name,
            selected: false,
            id: k,
            service_segment_id: state.service_segment_id,
          })),
        );
        return newFeatures;
      });
    },
    [features],
  );

  const onDelete = useCallback(
    (e: MapboxDraw.DrawDeleteEvent) => {
      setFeatures((currFeatures) => {
        e.features.map((f) => {
          delete currFeatures[f.id!];
        });
        return currFeatures;
      });
    },
    [features],
  );

  useEffect(() => {
    dispatch({
      type: 'POST_REGIONS',
      data: {
        regions: Object.entries(features).map<Service_segment_region>(
          // @ts-ignore
          ([k, r]: [string, turf.Feature<Polygon>]) => {
            return {
              coordinates: r.geometry.coordinates,
              region_name:
                rows.find((row) => `${row.id}` === `${k}`)?.region_name ??
                r.properties?.region_name ??
                'New Region',
              service_segment_id: state.service_segment_id,
              id: k,
            };
          },
        ),
      },
    });
  }, [features]);

  useEffect(() => {
    setFeatures((fts) => {
      return Object.fromEntries(
        rows.map((r) => [
          r.id,
          { ...fts[r.id!], properties: { region_name: r.region_name } },
        ]),
      );
    });
  }, [rows]);

  return (
    <IntramodalBlock>
      <Text
        variant="T4"
        weight="bold"
        tag="heading"
        style={{
          color: 'white',
        }}
      >
        {'Define Regions '}
        <span
          style={{
            ...theme.typoGraphy.heading['T3-medium'],
            color: theme.colors.greyScale[500],
            fontStyle: 'italic',
          }}
        >
          ({'Import through CSV files, or manually draw regions through '}
          <span style={{ color: 'white' }}>{'clicking on the map'}</span>
          {'.)'}
        </span>
      </Text>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => fileUploadRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={fileUploadRef}
          accept={'.gxt,.csv'}
          style={{ appearance: 'none', visibility: 'hidden', position: 'absolute' }}
        />
        <Button size="medium" variant="tertiary-white" onClick={() => null}>
          <Icon iconTitle={'upload'} fill={'#fff'} size={1.8} />
          {'Export'}
        </Button>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => setDrawMode('draw_polygon')}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Region'}
        </Button>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => setRows((oldRows) => oldRows.filter((r) => !r.selected))}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <GridContainer gridTemplateColumns="1fr 1fr" gap="16px" height="486px">
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={[
            { type: 'select', header: 'Select', key: 'selected' },
            { type: 'editable_string', header: 'Polygon Name', key: 'region_name' },
          ]}
          noRowsMessage={'No regions to display.'}
        />
        {/* Map with drawing section. */}
        <MapContainer
          style={{
            border: `0 0 2px ${theme.colors.greyScale[700]}`,
            borderRadius: '8px',
          }}
        >
          <DrawControl
            onCreate={onUpdate}
            // @ts-ignore
            onUpdate={onUpdate}
            onDelete={onDelete}
            position="top-left"
            drawProps={{
              displayControlsDefault: false,
              controls: {
                polygon: true,
                trash: true,
              },
            }}
            mode={drawMode}
            features={features}
            updateFeatures={setFeatures}
          />
          {Object.entries(features).map(([k, region]) => {
            const center = turf.center(region);
            return (
              <Popup
                key={k}
                latitude={center.geometry.coordinates[1]}
                longitude={center.geometry.coordinates[0]}
                anchor="bottom"
                closeOnMove={false}
                closeOnClick={false}
                closeButton={false}
              >
                {region.properties?.region_name}
              </Popup>
            );
          })}
        </MapContainer>
      </GridContainer>
    </IntramodalBlock>
  );
};
