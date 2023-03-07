import {
  Button,
  ButtonIcon,
  Datatable,
  DatatableProps,
  Dropdown,
  FlexContainer,
  FormattedInput,
  GridContainer,
  Icon,
  Modal,
  theme,
  ValueItem,
} from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useFileReader } from '../../../../hooks/useFileReader';
import {
  InternalTerminal,
  Service_segment_terminal_flight_path,
  Service_segment_terminal_modcod_forward,
  Service_segment_terminal_modcod_return,
  Service_segment_terminal_temporal_variation_forward,
  Service_segment_terminal_temporal_variation_return,
} from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const AddTerminals = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  // Put file names as choices in enum, column definitions in state
  const [GatewayDataColumns, setGatewayDataColumns] = useState<
    DatatableProps<InternalTerminal & { selected: boolean }>['dataColumns']
  >([
    { key: 'selected', type: 'select', header: 'Select' },
    // { key: 'id', type: 'number', header: 'Terminal ID' },
    { key: 'latitude', type: 'editable_number', header: 'Latitude (deg N)' },
    { key: 'longitude', type: 'editable_number', header: 'Longitude (deg E)' },
    { key: 'cir_forward', type: 'editable_number', header: 'CIR Forward' },
    { key: 'cir_return', type: 'editable_number', header: 'CIR Return' },
    { key: 'mir_forward', type: 'editable_number', header: 'MIR Forward' },
    { key: 'mir_return', type: 'editable_number', header: 'MIR Return' },
    { key: 'eirp', type: 'editable_number', header: 'EIRP' },
    { key: 'gt', type: 'editable_number', header: 'G/T' },
    {
      key: 'modcod_forward_key',
      type: 'editable_enum',
      header: 'Modcod Forward',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      key: 'modcod_return_key',
      type: 'editable_enum',
      header: 'Modcod Return',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      key: 'variation_forward_key',
      type: 'editable_enum',
      header: 'Variation Forward',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      key: 'variation_return_key',
      type: 'editable_enum',
      header: 'Variation Return',
      choices: [{ value: undefined, label: 'none' }],
    },
  ]);

  const [GatewayBandwidthColumns, setGatewayBandwidthColumns] = useState<
    DatatableProps<InternalTerminal & { selected: boolean }>['dataColumns']
  >([
    { key: 'selected', type: 'select', header: 'Select' },
    // { key: 'id', type: 'number', header: 'Terminal ID' },
    { key: 'latitude', type: 'editable_number', header: 'Latitude (deg N)' },
    { key: 'longitude', type: 'editable_number', header: 'Longitude (deg E)' },
    { key: 'eirp', type: 'editable_number', header: 'EIRP' },
    { key: 'gt', type: 'editable_number', header: 'G/T' },
    {
      key: 'variation_forward_key',
      type: 'editable_enum',
      header: 'Variation Forward',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      key: 'variation_return_key',
      type: 'editable_enum',
      header: 'Variation Return',
      choices: [{ value: undefined, label: 'none' }],
    },
  ]);

  const [MobilityBandwidthColumns, setMobilityBandwidthColumns] = useState<
    DatatableProps<
      // Mobile grid, Mobile follow
      InternalTerminal & {
        selected: boolean;
      }
    >['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
    { header: 'Bandwidth FWD', type: 'editable_number', key: 'bandwidth_forward' },
    { header: 'Bandwidth RTN', type: 'editable_number', key: 'bandwidth_return' },
    { header: 'Satellite EIRP', type: 'editable_number', key: 'satellite_eirp' },
    {
      header: 'Path',
      type: 'editable_enum',
      key: 'mobility_path_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Variation FWD',
      type: 'editable_enum',
      key: 'variation_forward_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Variation RTN',
      type: 'editable_enum',
      key: 'variation_return_key',
      choices: [{ value: undefined, label: 'none' }],
    },
  ]);
  const [MobilityDataColumns, setMobilityDataColumns] = useState<
    DatatableProps<
      // Mobile grid, Mobile follow
      InternalTerminal & {
        selected: boolean;
      }
    >['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
    { header: 'CIR FWD', type: 'editable_number', key: 'cir_forward' },
    { header: 'MIR FWD', type: 'editable_number', key: 'mir_forward' },
    { header: 'CIR RTN', type: 'editable_number', key: 'cir_return' },
    { header: 'MIR RTN', type: 'editable_number', key: 'mir_return' },
    {
      header: 'Path',
      type: 'editable_enum',
      key: 'mobility_path_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Variation FWD',
      type: 'editable_enum',
      key: 'variation_forward_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Variation RTN',
      type: 'editable_enum',
      key: 'variation_return_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Modcod FWD',
      type: 'editable_enum',
      key: 'modcod_forward_key',
      choices: [{ value: undefined, label: 'none' }],
    },
    {
      header: 'Modcod RTN',
      type: 'editable_enum',
      key: 'modcod_return_key',
      choices: [{ value: undefined, label: 'none' }],
    },
  ]);
  const TrunkingDColumnsConst: DatatableProps<
    // Trunking, Multicast Terminal, Point to Single Point
    InternalTerminal & {
      selected: boolean;
    }
  >['dataColumns'] = [
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
  ];
  const TrunkingBandwidthColumns: DatatableProps<
    // Trunking, Multicast Terminal, Point to Single Point, Multicast Gateway
    InternalTerminal & {
      selected: boolean;
    }
  >['dataColumns'] = [
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
  ];

  const [DTHDataColumns, setDTHDataColumns] = useState<
    DatatableProps<
      // DTH
      InternalTerminal & {
        selected: boolean;
      }
    >['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
    {
      header: 'Modcod Forward',
      type: 'editable_enum',
      key: 'modcod_forward_key',
      choices: [{ label: 'none', value: undefined }],
    },
  ]);
  const DTHBColumns: DatatableProps<
    // DTH
    InternalTerminal & {
      selected: boolean;
    }
  >['dataColumns'] = [
    { header: 'Select', type: 'select', key: 'selected' },
    // { header: 'Terminal ID', type: 'number', key: 'id' },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    {
      header: 'Longitude (deg E)',
      type: 'editable_number',
      key: 'longitude',
    },
    { header: 'EIRP', type: 'editable_number', key: 'eirp' },
    { header: 'G/T', type: 'editable_number', key: 'gt' },
    { header: 'Bandwidth', type: 'editable_number', key: 'bandwidth_forward' },
  ];
  const [createOpen, setCreateOpen] = useState(false);
  const [terminalDensity, setTerminalDensity] = useState(0);
  const [method, setMethod] = useState<ValueItem>();
  const [rows, setRows] = useState(
    state.terminals.map((t) => {
      return { ...t, selected: false };
    }),
  );
  // Row object is a super of all columns, display columns only affect the displayed properties.
  // Not sure if this will work. The state is getting set, need to confirm if this object will be updated.
  const columns: DatatableProps<InternalTerminal & { selected: boolean }>['dataColumns'] =
    state.service_type === 'Gateway' && state.data_type === 'Bandwidth'
      ? GatewayBandwidthColumns
      : state.service_type === 'Gateway' && state.data_type === 'Data'
      ? GatewayDataColumns
      : (state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me') &&
        state.data_type === 'Bandwidth'
      ? MobilityBandwidthColumns
      : (state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me') &&
        state.data_type === 'Data'
      ? MobilityDataColumns
      : (state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
          state.service_type === 'Point_to_Point' ||
          state.service_type === 'Multicast_Terminal' ||
          state.service_type === 'Multicast_Gateway') &&
        state.data_type === 'Bandwidth'
      ? TrunkingBandwidthColumns // Currently identical to the other Trunking columns
      : (state.service_type === 'Trunking_Phased_Array_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Phased_Array_Down_Steerable_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Phased_Array_Up' ||
          state.service_type === 'Trunking_Steerable_Down_Steerable_Up' ||
          state.service_type === 'Point_to_Point' ||
          state.service_type === 'Multicast_Terminal' ||
          state.service_type === 'Multicast_Gateway') &&
        state.data_type === 'Data'
      ? TrunkingDColumnsConst // Currently identical to the other Trunking columns
      : state.service_type === 'DTH' && state.data_type === 'Data'
      ? DTHDataColumns
      : state.service_type === 'DTH' && state.data_type === 'Bandwidth'
      ? DTHBColumns
      : [];
  const [sampleTerminals, setSampleTerminals] = useState<typeof rows>([]);
  useEffect(() => {
    dispatch({
      type: 'POST_TERMINALS',
      data: {
        terminal_flight_paths: mobilityRow,
        terminal_modcods_fwd: modcodF,
        terminal_modcods_rtn: modcodR,
        terminals: rows,
        terminal_variations_fwd: variationFRow,
        terminal_variations_rtn: variationRRow,
        terminal_auto_generation_options: { avg_num_of_terminals_per_square_km: 0 },
      },
    });
  }, [rows]);

  const terminalsInputFileRef = useRef<HTMLInputElement>(null);
  const modcodRInputRef = useRef<HTMLInputElement>(null);
  const modcodFInputRef = useRef<HTMLInputElement>(null);
  const mobilityInputRef = useRef<HTMLInputElement>(null);
  const variationFInputRef = useRef<HTMLInputElement>(null);
  const variationRInputRef = useRef<HTMLInputElement>(null);

  // Causes a rerender to happen when forceUpdate() is called
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // eslint-disable-next-line prettier/prettier
  const { contents: terminalFileRows } = useFileReader<(typeof rows)[number]>(
    terminalsInputFileRef.current?.files,
  );

  const { contents: modcodFFileRows, name: mcFName } =
    useFileReader<Service_segment_terminal_modcod_forward>(
      modcodFInputRef.current?.files,
    );
  const [modcodF, setmodcodF] = useState<
    Record<string, Service_segment_terminal_modcod_forward[]>
  >({ none: [] });

  const { contents: modcodRFileRows, name: mcRName } =
    useFileReader<Service_segment_terminal_modcod_return>(modcodRInputRef.current?.files);
  const [modcodR, setmodcodR] = useState<
    Record<string, Service_segment_terminal_modcod_return[]>
  >({ none: [] });

  const [modalModcod, setModalModcod] = useState(false);
  const [modcodOpen, setModcodOpen] = useState(false);

  const { contents: mobilityFileRows, name: mobilityName } =
    useFileReader<Service_segment_terminal_flight_path>(mobilityInputRef.current?.files);
  const [mobilityRow, setmobilityRow] = useState<
    Record<string, Service_segment_terminal_flight_path[]>
  >({
    none: [],
  });

  const { contents: variationFFileRows, name: variationFName } =
    useFileReader<Service_segment_terminal_temporal_variation_forward>(
      variationFInputRef.current?.files,
    );
  const [variationFRow, setvariationFRow] = useState<
    Record<string, Service_segment_terminal_temporal_variation_forward[]>
  >({ none: [] });

  const { contents: variationRFileRows, name: variationRName } =
    useFileReader<Service_segment_terminal_temporal_variation_return>(
      variationRInputRef.current?.files,
    );
  const [variationRRow, setvariationRRow] = useState<
    Record<string, Service_segment_terminal_temporal_variation_return[]>
  >({ none: [] });

  const [modalVariation, setModalVariation] = useState(false);
  const [variationOpen, setVariationOpen] = useState(false);

  // Fire useEffect when the user uploads a file.
  // Files are added to a record in state, with filename/id as an option in the enum.
  useEffect(() => {
    setRows((rws) => [...rws, ...terminalFileRows]);
  }, [terminalFileRows]);

  useEffect(() => {
    setmodcodF((rws) => {
      if (mcFName === '') return { ...rws };
      return { ...rws, [mcFName]: modcodFFileRows };
    });
    setRows((rws) => {
      return rws.map((r) => {
        if (r.selected) {
          return { ...r, modcod_f: mcFName, selected: false };
        }
        return r;
      });
    });
  }, [modcodFFileRows, mcFName]);

  useEffect(() => {
    setDTHDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'modcod_forward_key'
          ? {
              header: 'Modcod FWD',
              key: 'modcod_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(modcodF).map(([k]) => {
                  return { label: k, value: k };
                }),
              ],
            }
          : x,
      ),
    );
    setGatewayDataColumns((rws) => {
      return rws.map((x) => {
        return x.key === 'modcod_forward_key'
          ? {
              header: 'Modcod FWD',
              key: 'modcod_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(modcodF).map(([k]) => {
                  return { label: k, value: k };
                }),
              ],
            }
          : x;
      });
    });
    setMobilityDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'modcod_forward_key'
          ? {
              header: 'Modcod FWD',
              key: 'modcod_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(modcodF).map(([k]) => {
                  return { label: k, value: k };
                }),
              ],
            }
          : x,
      ),
    );
  }, [modcodF]);

  useEffect(() => {
    setmodcodR((rws) => {
      if (mcRName === '') return { ...rws };
      return { ...rws, [mcRName]: modcodRFileRows };
    });
    setRows((rws) => {
      return rws.map((r) => {
        if (r.selected) {
          return { ...r, modcod_r: mcRName, selected: false };
        }
        return r;
      });
    });
  }, [modcodRFileRows, mcRName]);

  useEffect(() => {
    setGatewayDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'modcod_return_key'
          ? {
              header: 'Modcod RTN',
              key: 'modcod_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(modcodR).map(([k]) => {
                  return { value: k, label: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'modcod_return_key'
          ? {
              header: 'Modcod RTN',
              key: 'modcod_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(modcodR).map(([k]) => {
                  return { value: k, label: k };
                }),
              ],
            }
          : x,
      ),
    );
  }, [modcodR]);

  useEffect(() => {
    setmobilityRow((rws) => {
      if (mobilityName === '') return { ...rws };
      return { ...rws, [mobilityName]: mobilityFileRows };
    });
    setRows((rws) => {
      return rws.map((r) => {
        if (r.selected) {
          return { ...r, mobilitypath: mobilityName, selected: false };
        }
        return r;
      });
    });
  }, [mobilityFileRows, mobilityName]);

  useEffect(() => {
    setMobilityBandwidthColumns((rws) =>
      rws.map((x) =>
        x.key === 'mobility_path_key'
          ? {
              header: 'Mobility Path',
              key: 'mobility_path_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(mobilityRow).map(([k]) => {
                  return { value: k, label: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'mobility_path_key'
          ? {
              header: 'Mobility Path',
              key: 'mobility_path_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(mobilityRow).map(([k]) => {
                  return { label: k, value: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
  }, [mobilityRow]);

  useEffect(() => {
    setvariationRRow((rws) => {
      if (variationRName === '') return { ...rws };
      return { ...rws, [variationRName]: variationRFileRows };
    });
    setRows((rws) => {
      return rws.map((r) => {
        if (r.selected) {
          return { ...r, variation_rtn: variationRName, selected: false };
        }
        return r;
      });
    });
  }, [variationRFileRows, variationRName]);

  useEffect(() => {
    setGatewayBandwidthColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_return_key'
          ? {
              header: 'Temporal Variation RTN',
              key: 'variation_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationRRow).map(([k]) => {
                  return { value: k, label: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityBandwidthColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_return_key'
          ? {
              header: 'Temporal Variation RTN',
              key: 'variation_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationRRow).map(([k]) => {
                  return { label: k, value: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_return_key'
          ? {
              header: 'Temporal Variation RTN',
              key: 'variation_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationRRow).map(([k]) => {
                  return { label: k, value: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setGatewayDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_return_key'
          ? {
              header: 'Temporal Variation RTN',
              key: 'variation_return_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationRRow).map(([k]) => {
                  return { label: k, value: k };
                }),
              ],
            }
          : x,
      ),
    );
  }, [variationRRow]);

  useEffect(() => {
    setvariationFRow((rws) => {
      if (variationFName === '') return { ...rws };
      return { ...rws, [variationFName]: variationFFileRows };
    });
    setRows((rws) => {
      return rws.map((r) => {
        if (r.selected) {
          return { ...r, variation_fwd: variationFName, selected: false };
        }
        return r;
      });
    });
  }, [variationFFileRows]);

  useEffect(() => {
    setGatewayBandwidthColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_forward_key'
          ? {
              header: 'Temporal Variation FWD',
              key: 'variation_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationFRow).map(([k]) => {
                  return { label: k, value: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityBandwidthColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_forward_key'
          ? {
              header: 'Temporal Variation FWD',
              key: 'variation_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationFRow).map(([k]) => {
                  return { value: k, label: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setMobilityDataColumns((rws) =>
      rws.map((x) =>
        x.key === 'variation_forward_key'
          ? {
              header: 'Temporal Variation FWD',
              key: 'variation_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationFRow).map(([k]) => {
                  return { label: k, value: k };
                }),
                { value: undefined, label: 'none' },
              ],
            }
          : x,
      ),
    );
    setGatewayDataColumns((rws) =>
      rws.map((x) => {
        return x.key === 'variation_forward_key'
          ? {
              header: 'Temporal Variation FWD',
              key: 'variation_forward_key',
              type: 'editable_enum',
              choices: [
                ...Object.entries(variationFRow).map(([k]) => {
                  return { label: k, value: k };
                }),
              ],
            }
          : x;
      }),
    );
  }, [variationFRow]);

  return (
    <IntramodalBlock>
      <span
        style={{
          ...theme.typoGraphy.heading['T4-bold'],
          color: 'white',
        }}
      >
        {'Define Terminals '}
        <span
          style={{
            ...theme.typoGraphy.heading['T3-medium'],
            color: theme.colors.greyScale[500],
            fontStyle: 'italic',
          }}
        >
          {'(Import through CSV files, or manually define terminals through '}
          <span style={{ color: 'white' }}>Create Terminals</span>
          {'.)'}
        </span>
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => terminalsInputFileRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <>
          <input
            type="file"
            ref={terminalsInputFileRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
          <input
            type="file"
            ref={modcodRInputRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
          <input
            type="file"
            ref={modcodFInputRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
          <input
            type="file"
            ref={mobilityInputRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
          <input
            type="file"
            ref={variationFInputRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
          <input
            type="file"
            ref={variationRInputRef}
            style={{ visibility: 'hidden', position: 'absolute', display: 'none' }}
            accept=".csv"
          />
        </>
        <Button size="small" variant="tertiary-white" onClick={() => null}>
          <Icon iconTitle={'upload'} fill={'#fff'} size={1.8} />
          {'Export'}
        </Button>
        {state.service_type === 'Gateway' ||
        state.service_type === 'Multicast_Gateway' ? (
          <>
            <Button
              size="small"
              variant="tertiary-white"
              onClick={() => setCreateOpen(!createOpen)}
            >
              <Icon iconTitle={'settings'} fill={'#fff'} size={1.8} />
              {'Create Terminals'}
            </Button>
            <Modal open={createOpen}>
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
                  justifyContent="space-between"
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
                    {'Create Terminals'}
                  </span>
                  <ButtonIcon
                    onClick={() => setCreateOpen(false)}
                    iconTitle="close"
                    variant="tertiary"
                  />
                </FlexContainer>
                <FlexContainer
                  flexDirection="column"
                  style={{
                    width: 'auto',
                    border: `solid ${theme.colors.greyScale[700]}`,
                    borderWidth: '0px 1px 0px 1px',
                    borderRadius: '0px 0px 8px 8px',
                    padding: '8px',
                  }}
                >
                  <GridContainer gridTemplateColumns="486px 486px" gap="16px">
                    <Dropdown
                      selectedText={method?.label}
                      items={[
                        { label: 'Uniform', value: 'Uniform_grid' },
                        { label: 'Random', value: 'Random_uniform' },
                        {
                          label: 'Population Density',
                          value: 'Population_density',
                        },
                      ]}
                      postReturnValue={(x) => setMethod(x)}
                      title={'Method'}
                    />
                    <FormattedInput
                      changeFunction={(x) => setTerminalDensity(x)}
                      title={'Avg Terminals/sqKm'}
                      tooltip={''}
                      unit={''}
                      value={terminalDensity}
                    />
                  </GridContainer>
                  <span
                    style={{
                      ...theme.typoGraphy.heading['T3-bold'],
                      color: 'white',
                    }}
                  >
                    {'Sample Terminals '}
                    <span
                      style={{
                        ...theme.typoGraphy.heading['T3-medium'],
                        color: theme.colors.greyScale[500],
                        fontStyle: 'italic',
                      }}
                    >
                      {
                        'Add a few sample terminals to help the system generate terminals.'
                      }
                    </span>
                  </span>
                  <FlexContainer flexDirection="row" gap="4px">
                    <Button
                      size="medium"
                      variant="tertiary-white"
                      onClick={() => {
                        return setSampleTerminals((rws) => [
                          ...rws,
                          {
                            bandwidth_forward: 0,
                            bandwidth_return: 0,
                            cir_forward: 0,
                            cir_return: 0,
                            mir_forward: 0,
                            mir_return: 0,
                            mobility_path_key: undefined,
                            satellite_eirp: 0,
                            eirp: 0,
                            gt: 0,
                            latitude: 0,
                            longitude: 0,
                            id: undefined,
                            target_availability_forward: 0,
                            target_availability_return: 0,
                            modcod_forward_key: undefined,
                            modcod_return_key: undefined,
                            variation_forward_key: undefined,
                            variation_return_key: undefined,
                            selected: false,
                          },
                        ]);
                      }}
                    >
                      <Icon iconTitle="add" size={1.6} fill={'white'} />
                      {'Add'}
                    </Button>
                    <Button
                      size="medium"
                      variant="tertiary-white"
                      onClick={() =>
                        setSampleTerminals((rws) => rws.filter((r) => !r.selected))
                      }
                    >
                      <Icon iconTitle="delete" size={1.6} fill={'white'} />
                      {'Delete'}
                    </Button>
                    {state.service_type === 'Gateway' && state.data_type === 'Data' && (
                      <Dropdown
                        items={[
                          { label: 'Assign Modcod Forward', value: 'modf' },
                          { label: 'Assign Modcod Return', value: 'modr' },
                        ]}
                        postReturnValue={(e) => {
                          e.value === 'modf'
                            ? modcodFInputRef.current?.click()
                            : e.value === 'modr'
                            ? modcodRInputRef.current?.click()
                            : null;
                        }}
                        open={[modalModcod, setModalModcod]}
                        altButton={
                          <Button
                            variant="tertiary-white"
                            size="medium"
                            onClick={() => setModalModcod(!modalModcod)}
                          >
                            <Icon iconTitle="link" fill="white" />
                            {'Assign Modcod'}
                          </Button>
                        }
                      />
                    )}
                    {state.service_type === 'Gateway' && (
                      <Dropdown
                        items={[
                          { label: 'Assign Forward Time Variance', value: 'f' },
                          { label: 'Assign Return Time Variance', value: 'r' },
                        ]}
                        postReturnValue={(e) => {
                          e.value === 'f'
                            ? variationFInputRef.current?.click()
                            : e.value === 'r'
                            ? variationRInputRef.current?.click()
                            : null;
                        }}
                        open={[modalVariation, setModalVariation]}
                        altButton={
                          <Button
                            variant="tertiary"
                            size="medium"
                            onClick={() => setModalVariation(!modalVariation)}
                          >
                            <Icon iconTitle="link" fill="white" />
                            {'Assign Variation'}
                          </Button>
                        }
                      />
                    )}
                  </FlexContainer>
                  <div style={{ width: '998px', height: '288px', isolation: 'isolate' }}>
                    <Datatable
                      data={sampleTerminals} // Should be missing the Lat & Long columns, will be set by the optimizer
                      setData={setSampleTerminals}
                      dataColumns={columns}
                      noRowsMessage={'No Sample Terminals defined.'}
                    />
                  </div>
                  <FlexContainer
                    alignContent={'center'}
                    flexDirection={'row'}
                    alignItems={'center'}
                    flexWrap={'nowrap'}
                    gap={'15px'}
                    justifyContent={'end'}
                    style={{
                      border: `1px solid ${theme.colors.greyScale[700]}`,
                      borderRadius: '0 0 8px 8px',
                      padding: '8px 16px',
                    }}
                  >
                    <Button
                      size="small"
                      variant="primary"
                      onClick={() => {
                        dispatch({
                          type: 'POST_TERMINALS',
                          data: {
                            terminal_auto_generation_options: {
                              avg_num_of_terminals_per_square_km: terminalDensity,
                              method_terminals: sampleTerminals.map(
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                ({ selected, ...sT }) => {
                                  return sT;
                                },
                              ),
                              terminal_method: method?.value ?? 'Random_uniform',
                            },
                          },
                        });
                        setSampleTerminals([]);
                        setCreateOpen(false);
                      }}
                    >
                      {'Generate Terminals'}
                    </Button>
                  </FlexContainer>
                </FlexContainer>
              </GridContainer>
            </Modal>
          </>
        ) : (
          <></>
        )}
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            return setRows((rws) => [
              ...rws,
              {
                bandwidth_forward: 0,
                bandwidth_return: 0,
                cir_forward: 0,
                cir_return: 0,
                mir_forward: 0,
                mir_return: 0,
                mobility_path_key: undefined,
                satellite_eirp: 0,
                eirp: 0,
                gt: 0,
                latitude: 0,
                longitude: 0,
                id: undefined,
                target_availability_forward: 0,
                target_availability_return: 0,
                modcod_forward_key: undefined,
                modcod_return_key: undefined,
                variation_forward_key: undefined,
                variation_return_key: undefined,
                selected: false,
              },
            ]);
          }}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Terminals'}
        </Button>
        {(state.service_type === 'Gateway' ||
          state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me' ||
          state.service_type === 'DTH') &&
          state.data_type === 'Data' && (
            <Dropdown
              items={[
                { label: 'Assign Modcod Forward', value: 'f' },
                { label: 'Assign Modcod Return', value: 'r' },
              ]}
              postReturnValue={(e) => {
                e.value === 'f'
                  ? modcodFInputRef.current?.click()
                  : e.value === 'r'
                  ? modcodRInputRef.current?.click()
                  : null;
              }}
              open={[modcodOpen, setModcodOpen]}
              altButton={
                <Button
                  variant="tertiary-white"
                  size="medium"
                  onClick={() => setModcodOpen(!modcodOpen)}
                >
                  <Icon iconTitle="link" fill={'#fff'} />
                  {'Assign Modcod'}
                </Button>
              }
            />
          )}
        {(state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me') && (
          <Button
            size="small"
            variant="tertiary-white"
            onClick={() => mobilityInputRef.current?.click()}
          >
            <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
            {'Assign Mobility Path'}
          </Button>
        )}
        {(state.service_type === 'Gateway' ||
          state.service_type === 'Mobile_Grid_Beam' ||
          state.service_type === 'Mobile_Follow_Me') && (
          <Dropdown
            items={[
              { label: 'Assign Forward Time Variance', value: 'f' },
              { label: 'Assign Return Time Variance', value: 'r' },
            ]}
            postReturnValue={(e) => {
              e.value === 'f'
                ? variationFInputRef.current?.click()
                : e.value === 'r'
                ? variationRInputRef.current?.click()
                : null;
            }}
            open={[variationOpen, setVariationOpen]}
            altButton={
              <Button
                variant="tertiary-white"
                size="medium"
                onClick={() => setVariationOpen(!variationOpen)}
              >
                <Icon iconTitle="link" fill={'#fff'} />
                {'Assign Variation'}
              </Button>
            }
          />
        )}
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => setRows((rws) => rws.filter((r) => !r.selected))}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <div style={{ height: '486px' }}>
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={columns}
          noRowsMessage={'No Terminals defined.'}
        />
      </div>
    </IntramodalBlock>
  );
};
