import {
  Button,
  Datatable,
  DatatableProps,
  FlexContainer,
  Icon,
  theme,
} from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

// import { useGetServiceGatewaysQuery } from '../../../../features/segment_process/segment_processSlice';
import { useFileReader } from '../../../../hooks/useFileReader';
import { Service_segment_gateway_modem } from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const AddGatewayModems = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rows, setRows] = useState<
    // Segment Name instead of ID
    Array<Service_segment_gateway_modem & { selected: boolean }>
  >(
    state.modems.map((m) => {
      return { ...m, selected: false };
    }),
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const { contents: FileContents } = useFileReader<Service_segment_gateway_modem>(
    fileRef.current?.files,
  );
  useEffect(() => {
    setRows((rws) => [
      ...rws,
      ...FileContents.map((f) => {
        return { ...f, selected: false };
      }),
    ]);
  }, [FileContents]);
  // const { data } = useGetServiceGatewaysQuery(); // Should be getting only gateways from this segment. For sat show, use gateways from last step.
  const [ModemColumns, setModemColumns] = useState<
    DatatableProps<Service_segment_gateway_modem & { selected: boolean }>['dataColumns']
  >([
    { header: 'Select', type: 'select', key: 'selected' },
    {
      header: 'Gateway',
      type: 'editable_enum',
      key: 'gateway_id',
      choices: [{ label: 'none', value: undefined }],
    },
    // { header: 'Modem No.', type: 'number', key: 'id' },
    {
      header: 'Direction',
      type: 'editable_enum',
      key: 'direction',
      choices: [
        { label: 'Uplink', value: 'UpLink' },
        { label: 'Downlink', value: 'DownLink' },
      ],
    },
    {
      header: 'Polarization',
      type: 'editable_enum',
      key: 'polarization',
      choices: [
        { value: 'VLP', label: 'VLP' },
        { value: 'HLP', label: 'HLP' },
        { value: 'LHCP', label: 'LHCP' },
        { value: 'RHCP', label: 'RHCP' },
      ],
    },
    { header: 'Latitude (deg N)', type: 'editable_number', key: 'latitude' },
    { header: 'Longitude (deg E)', type: 'editable_number', key: 'longitude' },
    {
      header: 'Max Frequency',
      type: 'editable_number',
      key: 'max_frequency',
    },
    {
      header: 'Min Frequency',
      type: 'editable_number',
      key: 'min_frequency',
    },
    { header: 'Max Span', type: 'editable_number', key: 'max_span' },
    {
      header: 'MaxAgSymRate',
      type: 'editable_number',
      key: 'max_agg_tot_sym',
    },
    {
      header: 'MaxNumCarrier',
      type: 'editable_number',
      key: 'max_num_carrier',
    },
    {
      header: 'MaxNumSlice',
      type: 'editable_number',
      key: 'max_num_slice',
    },
  ]);
  // useEffect(() => {
  //   setModemColumns((pc) =>
  //     pc.map((c) =>
  //       c.key === 'gateway_id'
  //         ? {
  //             header: 'Gateway',
  //             type: 'editable_enum',
  //             key: 'gateway_id',
  //             choices: [
  //               { label: 'None', value: undefined },
  //               ...(data?.map((g) => {
  //                 return { value: g.id, label: `${g.id}` };
  //               }) ?? []),
  //             ],
  //           }
  //         : c,
  //     ),
  //   );
  // }, [data]);
  useEffect(() => {
    setModemColumns((pc) =>
      pc.map((c) =>
        c.key === 'gateway_id'
          ? {
              header: 'Gateway',
              type: 'editable_enum',
              key: 'gateway_id',
              choices: [
                { label: 'none', value: undefined },
                ...(state.gateways?.map((g) => {
                  return { value: g.id, label: `${g.gateway_name}` };
                }) ?? []),
              ],
            }
          : c,
      ),
    );
  }, [state.gateways]);
  useEffect(() => {
    dispatch({
      type: 'POST_MODEMS',
      data: {
        modems: rows.map((r) => {
          return {
            direction: r.direction,
            latitude: r.latitude,
            longitude: r.longitude,
            max_agg_tot_sym: r.max_agg_tot_sym,
            max_frequency: r.max_frequency,
            max_num_carrier: r.max_num_carrier,
            max_num_slice: r.max_num_slice,
            max_span: r.max_span,
            max_sym_rate: r.max_sym_rate,
            max_term: r.max_term,
            min_frequency: r.min_frequency,
            min_sym_rate: r.min_sym_rate,
            polarization: r.polarization,
            rof: r.rof,
            gateway_id: r.gateway_id,
            id: r.id,
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
        {'Define Gateway Modems'}
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => fileRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={fileRef}
          style={{ visibility: 'hidden', appearance: 'none', position: 'absolute' }}
          accept=".csv"
        />
        <Button size="small" variant="tertiary-white" onClick={() => null}>
          <Icon iconTitle={'upload'} fill={'#fff'} size={1.8} />
          {'Export'}
        </Button>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            setRows((rws) => [
              ...rws,
              {
                id: undefined,
                gateway_id: undefined,
                direction: 'DownLink',
                latitude: 0,
                longitude: 0,
                max_frequency: 0,
                max_num_carrier: 0,
                max_num_slice: 0,
                max_span: 0,
                min_frequency: 0,
                max_agg_tot_sym: 0,
                max_sym_rate: 0,
                max_term: 0,
                min_sym_rate: 0,
                rof: 0,
                polarization: 'VLP',
                selected: false,
              },
            ]);
          }}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Gateway Modems'}
        </Button>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => setRows((rws) => rws.filter((x) => !x.selected))}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <Datatable
        data={rows}
        setData={setRows}
        dataColumns={ModemColumns}
        noRowsMessage={'No Modems defined.'}
      />
    </IntramodalBlock>
  );
};
