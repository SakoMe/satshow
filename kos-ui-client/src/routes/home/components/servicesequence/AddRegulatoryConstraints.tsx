import {
  Button,
  Datatable,
  DatatableProps,
  Dropdown,
  FlexContainer,
  GridContainer,
  Icon,
  Modal,
  TextField,
  theme,
} from '@kythera/kui-components';
import * as turf from '@turf/turf';
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useFileReader } from '../../../../hooks/useFileReader';
import { useGXTFileReader } from '../../../../hooks/useGXTFileReader';
import { DrawControl, MapContainer } from '../../../../styled/mapboxmap';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

type InternalConstraint = {
  polygon_id: string;
  direction: 'UpLink' | 'DownLink';
  polarization: 'LHCP' | 'RHCP' | 'VLP' | 'HLP';
  min_frequency: number;
  max_frequency: number;
  max_copol_directivity: number;
  min_crosspol_discrimination: number;
  pfd_level: number;
};

export const AddConstraints = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [newConstraintOpen, setNewConstraintOpen] = useState<boolean>(false);
  const [newRowOpen, setNewRowOpen] = useState<boolean>(false);
  const [constraintName, setConstraintName] = useState('');
  const [drawMode, setDrawMode] = useState<
    'draw_polygon' | 'draw_point' | 'simple_select'
  >('simple_select');
  // Apply the features to the rows on delete and update. Match the ids to rows.
  // May need to separate region definitions and constraints, putting the regions into an enum instead.
  const [features, setFeatures] = useState<Record<string, turf.Feature>>(
    Object.fromEntries(
      state.constraints.map((c) => {
        return [
          c.id,
          turf.feature(
            { coordinates: c.coordinates, type: 'Polygon' },
            { region_name: c.regulatory_constraint_name },
            { id: c.id },
          ),
        ];
      }),
    ),
  );
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
      setFeatures((fts) => {
        return { ...fts, region };
      });
    } else {
      if (fileContents.length < 3) return;
      setFeatures((fts) => {
        const newPolygon = turf.polygon([fileContents.map((z) => [z.lat, z.long])]);
        return {
          ...fts,
          [name]: newPolygon,
        };
      });
    }
  }, [fileContents, region]);
  const [rows, setRows] = useState<Array<InternalConstraint & { selected: boolean }>>(
    state.constraints.map((c) => {
      return {
        selected: false,
        direction: c.direction as 'UpLink' | 'DownLink',
        max_frequency: c.max_frequency,
        min_frequency: c.min_frequency,
        polarization: c.polarization as 'LHCP' | 'RHCP' | 'VLP' | 'HLP',
        polygon_id: `${c.id}`, // This is getting decoupled.
        max_copol_directivity: c.max_copol_directivity,
        min_crosspol_discrimination: c.min_crosspol_discrimination,
        pfd_level: c.pfd_level,
      };
    }) ?? [],
  );
  const [columns, setColumns] = useState<
    DatatableProps<InternalConstraint & { selected: boolean }>['dataColumns']
  >([
    { key: 'selected', type: 'select', header: 'Select' },
    {
      key: 'polygon_id',
      type: 'editable_enum',
      header: 'Polygon',
      choices: [],
    },
    {
      key: 'direction',
      type: 'editable_enum',
      header: 'Direction',
      choices: [
        { value: 'UpLink', label: 'UpLink' },
        { value: 'DownLink', label: 'DownLink' },
      ],
    },
    {
      key: 'min_frequency',
      type: 'editable_number',
      header: 'Min Frequency (GHz)',
    },
    {
      key: 'max_frequency',
      type: 'editable_number',
      header: 'Max Frequency (GHz)',
    },
    {
      key: 'polarization',
      type: 'editable_enum',
      header: 'Polarization',
      choices: [
        { value: 'LHCP', label: 'LHCP' },
        { value: 'RHCP', label: 'RHCP' },
        { value: 'VLP', label: 'VLP' },
        { value: 'HLP', label: 'HLP' },
      ],
    },
    { key: 'pfd_level', type: 'editable_number', header: 'PFD Level' },
  ]);

  const onSubmit = useCallback(() => {
    setNewConstraintOpen(false);
    setFeatures((oldFeatures) => {
      return Object.fromEntries(
        Object.entries(oldFeatures).map(([k, v]) => {
          return [
            k,
            {
              ...v,
              properties: {
                ...v.properties,
                region_name:
                  v.properties?.region_name ??
                  (constraintName === '' ? 'New Region' : `${constraintName}`),
              },
            },
          ];
        }),
      );
    });
    setColumns((oldColumns) =>
      oldColumns.map((oc) =>
        oc.key === 'polygon_id'
          ? {
              key: 'polygon_id',
              type: 'editable_enum',
              header: 'Polygon',
              choices: [
                ...Object.entries(features).map((f) => {
                  return {
                    value: f[0],
                    label: f[1].properties?.region_name ?? `${constraintName}`,
                  };
                }),
              ],
            }
          : oc,
      ),
    );
    setRows((rws) => {
      return [
        ...rws,
        {
          direction: 'DownLink',
          max_copol_directivity: 0,
          max_frequency: 0,
          min_crosspol_discrimination: 0,
          min_frequency: 0,
          pfd_level: 0,
          polarization: 'HLP',
          polygon_id: Object.entries(features).at(-1)?.[0] ?? '',
          selected: false,
        },
      ];
    });
  }, [constraintName, rows, features, columns]);

  const onCreate = useCallback(
    (e: MapboxDraw.DrawCreateEvent) => {
      setDrawMode('simple_select');
      setNewConstraintOpen(true);
      setConstraintName('');
      setFeatures((currFeatures) => {
        return {
          ...currFeatures,
          ...Object.fromEntries(
            e.features.map((f) => [
              f.id,
              { ...f, properties: { region_name: undefined } },
            ]),
          ),
        };
      });
    },
    [features],
  );

  const onUpdate = useCallback(
    (e: MapboxDraw.DrawUpdateEvent) => {
      setFeatures((currFeatures) => {
        return {
          ...currFeatures,
          ...Object.fromEntries(e.features.map((f) => [f.id, f])),
        };
      });
    },
    [features],
  );

  const onDelete = useCallback(
    (e: MapboxDraw.DrawDeleteEvent) => {
      setFeatures((currFeatures) => {
        const newFeatures = { ...currFeatures };
        for (const f of e.features) {
          delete newFeatures[f.id!];
        }
        setColumns((oldColumns) =>
          oldColumns.map((oc) =>
            oc.key === 'polygon_id'
              ? {
                  key: 'polygon_id',
                  type: 'editable_enum',
                  header: 'Polygon',
                  choices: [
                    ...Object.entries(newFeatures).map((f) => {
                      return { value: f[0], label: f[1].properties?.region_name };
                    }),
                  ],
                }
              : oc,
          ),
        );
        return newFeatures;
      });
    },
    [features, columns],
  );

  useEffect(() => {
    dispatch({
      type: 'POST_CONSTRAINTS',
      data: {
        constraints: rows.map((r) => {
          return {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            coordinates: features[r.polygon_id]?.geometry.coordinates ?? [],
            direction: r.direction,
            max_frequency: r.max_frequency,
            min_frequency: r.min_frequency,
            max_copol_directivity: r.max_copol_directivity,
            min_crosspol_discrimination: r.min_crosspol_discrimination,
            pfd_level: r.pfd_level,
            polarization: r.polarization,
            regulatory_constraint_name:
              features?.[r.polygon_id]?.properties?.region_name ?? 'New Constraint',
            service_segment_id: state.service_segment_id,
            service_segment_regulatory_constraint_id: undefined,
          };
        }),
      },
    });
  }, [rows]);

  return (
    <IntramodalBlock>
      <span
        style={{
          ...theme.typoGraphy.heading['T4-bold'],
          color: 'white',
        }}
      >
        {'Define Regulatory Constraints'}
        <span
          style={{
            ...theme.typoGraphy.heading['T3-medium'],
            color: theme.colors.greyScale[500],
            fontStyle: 'italic',
          }}
        >
          {'(Import through CSV files, or manually draw regions by '}
          <span style={{ color: 'white' }}>{'clicking on the map'}</span>
          {'.)'}
        </span>
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => fileUploadRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={fileUploadRef}
          style={{ appearance: 'none', visibility: 'hidden', position: 'absolute' }}
          accept=".csv"
        />
        <Button size="small" variant="tertiary-white" onClick={() => null}>
          <Icon iconTitle={'upload'} fill={'#fff'} size={1.8} />
          {'Export'}
        </Button>
        <Dropdown
          placeholder="Add Constraint"
          items={[
            { label: 'With Existing Polygon', value: 'exist' },
            { label: 'With New Constraint Polygon', value: 'new' },
          ]}
          postReturnValue={(x) => {
            if (x.value === 'new') setDrawMode('draw_polygon');
            if (x.value === 'exist') {
              setRows((rws) => {
                const newRows = [...rws];
                if (newRows.length === rws.length) {
                  newRows.push({
                    direction: 'DownLink',
                    max_frequency: 70,
                    min_frequency: 0,
                    polarization: 'HLP',
                    polygon_id: Object.entries(features).at(0)?.[0] ?? '',
                    selected: false,
                    max_copol_directivity: 0,
                    min_crosspol_discrimination: 0,
                    pfd_level: 0,
                  });
                }
                return newRows.map((r) => {
                  return { ...r, selected: false };
                });
              });
            }
          }}
          open={[newRowOpen, setNewRowOpen]}
          altButton={
            <Button
              size="small"
              variant="tertiary-white"
              onClick={() => setNewRowOpen(!newRowOpen)}
            >
              <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
              {'Add Constraint'}
            </Button>
          }
        />
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            setRows((rws) => {
              return rws.filter((row) => !row.selected);
            });
            // If none of the rows have that shape_id, delete it.
            for (const x of [...Object.entries(features)]) {
              if (rows.find((row) => row.polygon_id === x[0]) === undefined)
                delete features[x[0]];
            }
          }}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <GridContainer
        gap="16px"
        gridTemplateColumns="1fr 1fr"
        height="486px"
        style={{ isolation: 'isolate' }}
      >
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={columns}
          noRowsMessage={'No constraints to display.'}
        />
        {/* Map with drawing section. */}
        <MapContainer
          style={{
            border: `0 0 1px ${theme.colors.greyScale[700]}`,
            borderRadius: '8px',
          }}
        >
          <DrawControl
            onCreate={onCreate}
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
            features={features}
            updateFeatures={setFeatures}
            mode={drawMode}
          />
        </MapContainer>
      </GridContainer>
      <Modal open={newConstraintOpen}>
        <GridContainer
          gridTemplateRows="58px auto 54px"
          gridTemplateColumns="400px"
          placeItems="center center"
          style={{
            backgroundColor: theme.colors.greyScale[900],
            borderRadius: '8px',
          }}
        >
          <FlexContainer
            flexDirection="row"
            justifyContent="space-between"
            alignContent="center"
            padding="16px 16px"
            style={{
              width: '100%',
              borderRadius: '8px 8px 0 0',
              border: `1px solid ${theme.colors.greyScale[700]}`,
            }}
          >
            <span
              style={{
                ...theme.typoGraphy.heading['T4-bold'],
                color: 'white',
              }}
            >
              {'New Constraint Polygon'}
            </span>
          </FlexContainer>
          <GridContainer
            placeItems="center"
            style={{
              width: '100%',
              border: `1px solid ${theme.colors.greyScale[700]}`,
              height: '94px',
              padding: '16px',
            }}
          >
            <TextField
              title="Enter constraint polygon name..."
              inputProps={{
                onChange: (event) => setConstraintName(event.currentTarget.value),
                style: { width: '368px' },
              }}
            />
          </GridContainer>
          <FlexContainer
            alignContent={'center'}
            flexDirection={'row'}
            alignItems={'center'}
            flexWrap={'nowrap'}
            justifyContent={'end'}
            padding={'8px 16px'}
            style={{
              border: `1px solid ${theme.colors.greyScale[700]}`,
              borderWidth: '1px',
              borderRadius: '0 0 8px 8px',
              width: '100%',
            }}
          >
            <Button size="medium" variant="primary" onClick={onSubmit}>
              {'Done'}
            </Button>
          </FlexContainer>
        </GridContainer>
      </Modal>
    </IntramodalBlock>
  );
};
