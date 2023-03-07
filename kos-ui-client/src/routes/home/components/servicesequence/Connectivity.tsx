import {
  Button,
  ButtonIcon,
  Datatable,
  DatatableProps,
  FlexContainer,
  GridContainer,
  Icon,
  Modal,
  theme,
} from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useGetAllSegmentTerminalsQuery } from '../../../../features/segment_process/segment_processSlice';
import { useFileReader } from '../../../../hooks/useFileReader';
import {
  InternalConnectivity,
  Service_segment_connectivity_modcod,
  Service_segment_connectivity_temporal_variation,
  Service_segment_terminal,
} from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const Connectivity = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  if (
    state.service_type === 'DTH' ||
    state.service_type === 'Gateway' ||
    state.service_type === 'Mobile_Grid_Beam' ||
    state.service_type === 'Mobile_Follow_Me'
  ) {
    return <></>;
  }
  const { data, isLoading } = useGetAllSegmentTerminalsQuery();
  const [NonMulticastDataColumns, setNonMulticastDataColumns] = useState<
    DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    {
      header: 'Uplink Terminal',
      type: 'editable_enum',
      key: 'uplink_terminal',
      choices: [],
    },
    {
      header: 'Downlink Terminal',
      type: 'editable_enum',
      key: 'downlink_terminal',
      choices: [],
    },
    { header: 'MIR', type: 'editable_number', key: 'mir' },
    { header: 'CIR', type: 'editable_number', key: 'cir' },
    { header: 'Availability (%)', type: 'editable_number', key: 'availability' },
    {
      header: 'Modcod',
      type: 'editable_enum',
      key: 'modcod_key',
      choices: [{ label: 'none', value: undefined }],
    },
    {
      header: 'Temporal Variation',
      type: 'editable_enum',
      key: 'temporal_variation_key',
      choices: [{ label: 'none', value: undefined }],
    },
  ]);

  const [MulticastGatewayDataColumns, setMulticastGatewayDataColumns] = useState<
    DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    {
      header: 'Downlink Terminals',
      type: 'button',
      key: 'downlink_terminals',
      onClick: (z) => {
        setSubModalOpen(true);
        setSelectedConnectivity(z);
      },
      text: 'View Downlink Terminals',
    },
    { header: 'MIR', type: 'editable_number', key: 'mir' },
    { header: 'CIR', type: 'editable_number', key: 'cir' },
    { header: 'Availability (%)', type: 'editable_number', key: 'availability' },
    {
      header: 'Modcod',
      type: 'editable_enum',
      key: 'modcod_key',
      choices: [{ label: 'none', value: undefined }],
    },
    {
      header: 'Temporal Variation',
      type: 'editable_enum',
      key: 'temporal_variation_key',
      choices: [{ label: 'none', value: undefined }],
    },
  ]);

  const [MulticastTerminalDataColumns, setMulticastTerminalDataColumns] = useState<
    DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    {
      header: 'Uplink Terminal',
      type: 'editable_enum',
      key: 'uplink_terminal',
      choices: [],
    },
    {
      header: 'Downlink Terminals',
      type: 'button',
      key: 'downlink_terminals',
      onClick: (z) => {
        setSubModalOpen(true);
        setSelectedConnectivity(z);
      },
      text: 'View Downlink Terminals',
    },
    { header: 'MIR', type: 'editable_number', key: 'mir' },
    { header: 'CIR', type: 'editable_number', key: 'cir' },
    { header: 'Availability (%)', type: 'editable_number', key: 'availability' },
    { header: 'Modcod', type: 'editable_enum', key: 'modcod_key', choices: [] },
    {
      header: 'Temporal Variation',
      type: 'editable_enum',
      key: 'temporal_variation_key',
      choices: [{ label: 'none', value: undefined }],
    },
  ]);

  const [NonMulticastColumnsBandwidth, setNonMulticastBandwidthColumns] = useState<
    DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    {
      header: 'Uplink Terminal',
      type: 'editable_enum',
      choices: [],
      key: 'uplink_terminal',
    },
    {
      header: 'Downlink Terminal',
      type: 'editable_enum',
      key: 'downlink_terminal',
      choices: [],
    },
    { header: 'Bandwidth', type: 'editable_number', key: 'bandwidth' },
    {
      header: 'Satellite EIRP',
      type: 'editable_number',
      key: 'satellite_eirp',
    },
  ]);

  const [MulticastGatewayColumnsBandwidth, setMulticastGatewayBandwidthColumns] =
    useState<DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']>(
      [
        { header: 'Select', type: 'select', key: 'selected' },
        {
          header: 'Downlink Terminals',
          type: 'button',
          key: 'downlink_terminal',
          onClick: (z) => {
            setSubModalOpen(true);
            setSelectedConnectivity(z);
          },
          text: 'View Downlink Terminals',
        },
        { header: 'Bandwidth', type: 'editable_number', key: 'bandwidth' },
        {
          header: 'Satellite EIRP',
          type: 'editable_number',
          key: 'satellite_eirp',
        },
      ],
    );

  const [MulticastTerminalColumnsBandwidth, setMulticastTerminalColumnsBandwidth] =
    useState<DatatableProps<InternalConnectivity & { selected: boolean }>['dataColumns']>(
      [
        { header: 'Select', type: 'select', key: 'selected' },
        {
          header: 'Uplink Terminal',
          type: 'editable_enum',
          choices: [],
          key: 'uplink_terminal',
        },
        {
          header: 'Downlink Terminals',
          type: 'button',
          key: 'downlink_terminals',
          onClick: (z) => {
            setSubModalOpen(true);
            setSelectedConnectivity(z);
          },
          text: 'View Downlink Terminals',
        },
        { header: 'Bandwidth', type: 'editable_number', key: 'bandwidth' },
        {
          header: 'Satellite EIRP',
          type: 'editable_number',
          key: 'satellite_eirp',
        },
      ],
    );
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [subModalOpen, setSubModalOpen] = useState(false);

  const Mref = useRef<HTMLInputElement>(null);
  const { contents: ModcodContents, name: ModcodName } =
    useFileReader<Service_segment_connectivity_modcod>(Mref.current?.files);
  const [modcodUploads, setModcodUploads] = useState<
    Record<string, Service_segment_connectivity_modcod[]>
  >({});
  useEffect(() => {
    setModcodUploads((tu) => {
      if (ModcodName === '') return { ...tu };
      return { ...tu, [ModcodName]: ModcodContents };
    });
    dispatch({
      type: 'POST_CONNECTIVITIES',
      data: {
        connectivity_modcods: {
          ...state.connectivity_modcods,
          [ModcodName]: ModcodContents,
        },
      },
    });
  }, [ModcodContents]);

  useEffect(() => {
    setNonMulticastDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'modcod_key'),
      {
        header: 'Modcod',
        key: 'modcod_key',
        type: 'editable_enum',
        choices: [
          { value: undefined, label: 'none' },
          ...Object.entries(modcodUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
      },
    ]);
    setMulticastGatewayDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'modcod_key'),
      {
        header: 'Modcod',
        key: 'modcod_key',
        type: 'editable_enum',
        choices: [
          { value: undefined, label: 'none' },
          ...Object.entries(modcodUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
      },
    ]);
    setMulticastTerminalDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'modcod_key'),
      {
        header: 'Modcod',
        key: 'modcod_key',
        type: 'editable_enum',
        choices: [
          { value: 'none', label: 'none' },
          ...Object.entries(modcodUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
      },
    ]);
  }, [modcodUploads]);

  const Tref = useRef<HTMLInputElement>(null);
  const { contents: TemporalContents, name: TemporalName } =
    useFileReader<Service_segment_connectivity_temporal_variation>(Tref.current?.files);
  const [temporalUploads, setTemporalUploads] = useState<
    Record<string, Service_segment_connectivity_temporal_variation[]>
  >({});
  useEffect(() => {
    setTemporalUploads((tu) => {
      if (TemporalName === '') return { ...tu };
      return { ...tu, [TemporalName]: TemporalContents };
    });
    dispatch({
      type: 'POST_CONNECTIVITIES',
      data: {
        connectivity_variations: {
          ...state.connectivity_variations,
          [TemporalName]: TemporalContents,
        },
      },
    });
  }, [TemporalContents]);

  useEffect(() => {
    setMulticastTerminalDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'temporal_variation_key'),
      {
        header: 'Temporal Variation',
        key: 'temporal_variation_key',
        type: 'editable_enum',
        choices: [
          { value: undefined, label: 'none' },
          ...Object.entries(temporalUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
        editable: true,
      },
    ]);
    setNonMulticastDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'temporal_variation_key'),
      {
        header: 'Temporal Variation',
        key: 'temporal_variation_key',
        type: 'editable_enum',
        choices: [
          { value: undefined, label: 'none' },
          ...Object.entries(temporalUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
      },
    ]);
    setMulticastGatewayDataColumns((mt) => [
      ...mt.filter((m) => m.key !== 'temporal_variation_key'),
      {
        header: 'Temporal Variation',
        key: 'temporal_variation_key',
        type: 'editable_enum',
        choices: [
          { value: undefined, label: 'none' },
          ...Object.entries(temporalUploads).map(([a]) => {
            return { value: a, label: a };
          }),
        ],
      },
    ]);
  }, [temporalUploads]);

  useEffect(() => {
    // Apply the terminals to the enums
    if (data !== undefined) {
      setMulticastGatewayDataColumns((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
      setMulticastTerminalDataColumns((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
      setNonMulticastDataColumns((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
      setNonMulticastBandwidthColumns((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
      setMulticastTerminalColumnsBandwidth((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
      setMulticastGatewayBandwidthColumns((mg) =>
        mg.map((c) => {
          if (c.key === 'uplink_terminal' && c.type === 'editable_enum') {
            return {
              ...c,
              choices: [
                ...c.choices,
                ...data.map((t) => {
                  return { value: t.id, label: `${t.id}` };
                }),
              ],
            };
          }
          return c;
        }),
      );
    }
  }, [isLoading]);

  const columns =
    state.service_type === 'Multicast_Gateway' && state.data_type === 'Data'
      ? MulticastGatewayDataColumns
      : state.service_type === 'Multicast_Gateway' && state.data_type === 'Bandwidth'
      ? MulticastGatewayColumnsBandwidth
      : state.service_type === 'Multicast_Terminal' && state.data_type === 'Data'
      ? MulticastTerminalDataColumns
      : state.service_type === 'Multicast_Terminal' && state.data_type === 'Bandwidth'
      ? MulticastTerminalColumnsBandwidth
      : (state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
          state.service_type === 'Multicast_Terminal') &&
        state.data_type === 'Bandwidth'
      ? NonMulticastColumnsBandwidth
      : NonMulticastDataColumns;
  const [rows, setRows] = useState(
    state.service_type === 'Point_to_Point' ||
      state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
      state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
      state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
      state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
      state.service_type === 'Multicast_Gateway' ||
      state.service_type === 'Multicast_Terminal'
      ? state.connectivities.map((c) => {
          return { ...c, selected: false };
        }) ?? []
      : [],
  );
  const [selectedConnectivity, setSelectedConnectivity] = useState<
    InternalConnectivity & { selected: boolean }
  >();
  return (
    <IntramodalBlock>
      <span
        style={{
          ...theme.typoGraphy.heading['T4-bold'],
          color: 'white',
        }}
      >
        {'Define Connectivity'}
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            // Choose a Terminal ID from step_7?
            setRows((rws) => [
              ...rws,
              {
                availability: 0,
                bandwidth: 0,
                cir: 0,
                downlink_terminals: [state.terminals.at(0)?.id ?? 0],
                downlink_terminal: state.terminals.at(0)?.id ?? 0,
                mir: 0,
                modcod_key: undefined,
                satellite_eirp: 0,
                selected: false,
                temporal_variation_key: undefined,
                uplink_terminals: [state.terminals.at(0)?.id ?? 0],
                uplink_terminal: state.terminals.at(0)?.id ?? 0,
                temporal_variations: [],
                modcods: [],
              },
            ]);
          }}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Connectivity'}
        </Button>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => Tref.current?.click()}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Assign Temporal Variation'}
        </Button>
        <input
          type="file"
          ref={Tref}
          style={{ visibility: 'hidden', position: 'absolute' }}
        />
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => Mref.current?.click()}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Assign Modcod'}
        </Button>
        <input
          type="file"
          ref={Mref}
          style={{ visibility: 'hidden', position: 'absolute' }}
          accept=".csv"
        />
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            // Remove selected beams from wherever they are stored.
            setRows((rws) => rws.filter((r) => !r.selected));
          }}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <Datatable
        data={rows}
        setData={setRows}
        dataColumns={columns}
        noRowsMessage={'No Connectivities defined.'}
      />
      <ConnectivitySubModal
        subModalOpen={subModalOpen}
        setSubModalOpen={setSubModalOpen}
        selectedConnectivity={selectedConnectivity}
        setSelectedConnectivity={setSelectedConnectivity}
        data={data}
      />
    </IntramodalBlock>
  );
};

const ConnectivitySubModal = ({
  subModalOpen,
  setSubModalOpen,
  selectedConnectivity,
  setSelectedConnectivity,
  data,
}: {
  subModalOpen: boolean;
  setSubModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedConnectivity: (InternalConnectivity & { selected: boolean }) | undefined;
  setSelectedConnectivity: React.Dispatch<
    React.SetStateAction<(InternalConnectivity & { selected: boolean }) | undefined>
  >;
  data: Service_segment_terminal[] | undefined;
}) => {
  // Grab the terminals from the API and match them to the ones from the connectivity
  const [stateDownlinkTerminals, setSelectedDownlinkTerminals] = useState<
    (Service_segment_terminal & { selected: boolean })[]
  >(
    data
      ?.map((d) => ({ ...d, selected: false }))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .filter((t) => selectedConnectivity?.downlink_terminals.includes(t.id!)) ?? [],
  );
  useEffect(() => {
    // Just choosing a new terminal from the dropdowns won't cause the other entries in that row to update.
    // Want this to force a rerender, causing this datatable to update with the values of the new terminal.
    setSelectedConnectivity((c) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return { ...c!, downlink_terminals: stateDownlinkTerminals.map((t) => t.id!) };
    });
  }, [stateDownlinkTerminals]);
  // This will update on a rerender, fired by setSelectedConnectivity, right?
  const selectedDownlinkTerminals =
    data
      ?.map((d) => ({
        ...d,
        selected: stateDownlinkTerminals.find((t) => t.id === d.id)?.selected ?? false,
      }))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .filter((t) => selectedConnectivity?.downlink_terminals.includes(t.id!)) ?? [];
  // Order is:
  // render static_terminals load from props and data into datatable
  // update to state_terminals causes update to connectivity
  // update to connectivity causes rerender
  // rerender causes static_terminals to load from props and data into datatable
  return (
    <Modal open={subModalOpen}>
      <GridContainer
        style={{
          backgroundColor: theme.colors.greyScale[900],
          borderRadius: '8px',
          display: 'grid',
          placeItems: 'center',
          gridTemplateAreas: `"header" "body"`,
          gridTemplateRows: 'max-content auto',
        }}
      >
        <FlexContainer
          flexDirection="row"
          style={{
            gridArea: 'header',
            width: '100%',
            padding: '16px 16px',
            alignContent: 'center',
            borderRadius: '8px 8px 0 0',
            border: `1px solid ${theme.colors.greyScale[700]}`,
          }}
        >
          <span
            style={{
              ...theme.typoGraphy.heading['T4-bold'],
              color: theme.colors.greyScale[200],
            }}
          >
            {'title'}
          </span>
          <ButtonIcon
            onClick={() => setSubModalOpen(false)}
            iconTitle="close"
            variant="tertiary"
          />
        </FlexContainer>
        <FlexContainer
          flexDirection="column"
          justifyContent="start"
          style={{
            width: 'auto',
            border: `solid ${theme.colors.greyScale[700]}`,
            borderWidth: '0px 1px 0px 1px',
            borderRadius: '0px 0px 8px 8px',
          }}
        >
          <FlexContainer flexDirection="row" gap="8px">
            <Button
              size="medium"
              variant="tertiary-white"
              onClick={() =>
                setSelectedDownlinkTerminals((sr) => {
                  if (sr.at(0) !== undefined) return [...(sr ?? []), sr[0]];
                  return sr;
                })
              }
            >
              {'Add'}
            </Button>
            <Button
              size="medium"
              variant="tertiary-white"
              onClick={() =>
                setSelectedDownlinkTerminals((sr) => {
                  return sr.filter((s) => !s.selected);
                })
              }
            >
              {'Delete'}
            </Button>
          </FlexContainer>
          <Datatable
            data={selectedDownlinkTerminals}
            setData={setSelectedDownlinkTerminals}
            dataColumns={[
              { key: 'selected', header: 'Select', type: 'select' },
              {
                key: 'id',
                header: 'Terminal ID',
                type: 'editable_enum',
                choices:
                  data?.map((t) => {
                    return { value: t.id, label: `${t.id}` };
                  }) ?? [],
              },
              { key: 'latitude', header: 'Latitude (deg N)', type: 'number' },
              { key: 'longitude', header: 'Longitude (deg E)', type: 'number' },
            ]}
            noRowsMessage={'No downlink terminals defined.'}
          />
        </FlexContainer>
      </GridContainer>
    </Modal>
  );
};
