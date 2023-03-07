import { Button, Datatable, FlexContainer, Icon, theme } from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

// import { useGetAllGatewaysQuery } from '../../../../features/gateways/gatewaysSlice';
import { useFileReader } from '../../../../hooks/useFileReader';
import { Service_segment_gateway } from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const AddGateways = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rows, setRows] = useState<
    // Service Segment Name instead of ID
    Array<Service_segment_gateway & { selected: boolean }>
  >(
    state.gateways.map((g) => {
      return { ...g, selected: false };
    }),
  );
  useEffect(() => {
    // There's got to be a better way.
    // if (
    //   rows.every((o, i, a) => {
    //     return a.every((oo, ii, aa) =>
    //       o.service_segment_gateway_id === oo.service_segment_gateway_id
    //         ? o.polarization === 'HLP' || o.polarization === 'VLP'
    //           ? oo.polarization === 'HLP' || oo.polarization === 'VLP'
    //           : o.polarization === 'LHCP' || o.polarization === 'RHCP'
    //           ? oo.polarization === 'LHCP' || oo.polarization === 'RHCP'
    //           : false
    //         : true,
    //     );
    //   }) &&
    //   rows.length > 0
    // ) {
    //   toast('One or more gateways have incompatible polarizations.');
    // }
    dispatch({
      type: 'POST_GATEWAYS',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data: { gateways: rows.map(({ selected, ...r }) => r) },
    });
  }, [rows]);
  // We don't have a solution yet for mixing predefined gateways and newly created gateways.
  // 1. How to discern between the two in the backend?
  // 2. How to prevent the user from giving names to new gateways but not predefined gateways?
  // const [preGatewaysOpen, setPreGatewaysOpen] = useState(false);
  // const { data } = useGetAllGatewaysQuery();
  // const [segGates, setSegGates] = useState<Record<string, Service_segment_gateway[]>>({});
  // useEffect(() => {
  //   if (data) {
  //     // Parse out the gateways from the segment response.
  //     for (const s of data) {
  //       setSegGates((sg) => {
  //         return {
  //           ...sg,
  //           [s.id ?? '0']: [...(sg[s.id ?? '0'] ?? []).filter((g) => g.id !== s.id), s],
  //         };
  //       });
  //     }
  //   }
  // }, [data]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { contents: fileResult } = useFileReader<Service_segment_gateway>(
    inputFileRef.current?.files,
  );
  useEffect(() => {
    setRows((rws) => [
      ...rws,
      ...fileResult.map((r) => {
        return {
          ...r,
          selected: false,
          id: r.id,
          // segment_name: state.service_segment_name,
        };
      }),
    ]);
  }, [fileResult]);
  return (
    <IntramodalBlock>
      <span style={{ ...theme.typoGraphy.heading['T4-bold'], color: 'white' }}>
        {'Define Gateways'}
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => inputFileRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={inputFileRef}
          style={{ appearance: 'none', visibility: 'hidden', position: 'absolute' }}
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
            setRows((rws) => {
              return [
                ...rws,
                {
                  direction: 'DownLink',
                  eirp: 0,
                  gateway_name: 'New Gateway',
                  gt: 0,
                  latitude: 0,
                  longitude: 0,
                  max_frequency: 0,
                  min_frequency: 0,
                  npr: 0,
                  polarization: 'HLP',
                  selected: false,
                  service_segment_id: state.service_segment_id,
                  // segment_name: state.service_segment_name,
                },
              ];
            });
          }}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Gateways'}
        </Button>
        {/* <Dropdown
          open={[preGatewaysOpen, setPreGatewaysOpen]}
          items={Object.entries(segGates).map(([k, v]) => {
            return {
              label: `Segment ${k}`,
              choices: v.map((gate) => {
                return {
                  label: `Gateway ${gate.id}`,
                  value: `${k}:${gate.id}`,
                };
              }),
            };
          })}
          postReturnValue={(x) => {
            const key_pair = x.value?.split(':') ?? [];
            if (key_pair.length == 2) {
              const gate = segGates[key_pair[0]].find((g) => `${g.id}` == key_pair[1]);
              if (gate)
                setRows((rws) => [
                  ...rws,
                  { ...gate, selected: false, segment_name: state.service_segment_name },
                ]);
            }
            setPreGatewaysOpen(false);
          }}
          altButton={
            <Button
              size="small"
              variant="tertiary-white"
              onClick={() => setPreGatewaysOpen((gO) => !gO)}
            >
              <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
              {'Predefined Gateways'}
            </Button>
          }
        /> */}
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => {
            // Create a new row with the same gateway id and location, but without other column data points
            setRows((rws) => {
              const newRows: typeof rows = rws
                .filter((r) => r.selected)
                .map((rr) => {
                  return {
                    ...rr,
                    direction: 'UpLink',
                    eirp: 0,
                    gt: 0,
                    max_frequency: 0,
                    min_frequency: 0,
                    npr: 0,
                    polarization: 'LHCP',
                    selected: false,
                  };
                });
              return [
                ...rws.map((r) => {
                  return { ...r, selected: false };
                }),
                ...newRows,
              ];
            });
            return;
          }}
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Frequency Band'}
        </Button>
        <Button
          size="small"
          variant="tertiary-white"
          onClick={() => setRows((rws) => rws.filter((r) => !r.selected))}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <div style={{ height: '486px', isolation: 'isolate' }}>
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={[
            { key: 'selected', header: 'Select', type: 'select' },
            { header: 'Gateway Name', type: 'editable_string', key: 'gateway_name' },
            // {
            //   header: 'Gateway No.',
            //   type: 'number',
            //   key: 'id',
            // },
            // {
            //   header: 'Service Segment Name',
            //   type: 'string',
            //   key: 'segment_name',
            // },
            {
              header: 'Latitude (deg N)',
              type: 'editable_number',
              key: 'latitude',
            },
            {
              header: 'Longitude (deg E)',
              type: 'editable_number',
              key: 'longitude',
            },
            {
              header: 'Polarization',
              type: 'editable_enum',
              key: 'polarization',
              choices: [
                { value: 'LHCP', label: 'LHCP' },
                { value: 'RHCP', label: 'RHCP' },
                { value: 'VLP', label: 'VLP' },
                { value: 'HLP', label: 'HLP' },
              ],
            },
            {
              header: 'Uplink Frequency',
              type: 'editable_number',
              key: 'max_frequency',
            },
            {
              header: 'Downlink Frequency',
              type: 'editable_number',
              key: 'min_frequency',
            },
            { header: 'EIRP', type: 'editable_number', key: 'eirp' },
            { header: 'G/T', type: 'editable_number', key: 'gt' },
            { header: 'NPR', type: 'editable_number', key: 'npr' },
          ]}
          noRowsMessage={'No Gateways defined.'}
        />
      </div>
    </IntramodalBlock>
  );
};
