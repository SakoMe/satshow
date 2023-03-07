import { Button, Datatable, FlexContainer, Icon, theme } from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useFileReader } from '../../../../hooks/useFileReader';
import { Service_segment_frequency_plan } from '../../../../ts/types/fromPrisma';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const ServiceParams = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [rows, setRows] = useState<
    Array<Service_segment_frequency_plan & { selection: boolean }>
  >(
    state.params.map((p) => {
      return { ...p, selection: false };
    }) ?? [],
  );
  useEffect(() => {
    dispatch({
      type: 'POST_PARAMS',
      data: {
        params: rows.map((r) => {
          return {
            band: r.band,
            direction: r.direction,
            frequency_start: r.frequency_start,
            frequency_end: r.frequency_end,
            polarization: r.polarization,
            service_segment_id: state.service_segment_id,
            service_segment_parameter_id: r.id,
          };
        }),
      },
    });
  }, [rows]);
  const fileRef = useRef<HTMLInputElement>(null);
  const { contents: fileContents } = useFileReader<Service_segment_frequency_plan>(
    fileRef.current?.files,
  );
  useEffect(() => {
    setRows((fts) => {
      return [
        ...fts.map((rw) => {
          return {
            ...rw,
            selection: false,
          };
        }),
        ...fileContents.map((fc) => {
          return {
            ...fc,
            selection: false,
            service_segment_id: state.service_segment_id,
            service_segment_parameter_id: undefined,
          };
        }),
      ];
    });
  }, [fileContents]);

  return (
    <IntramodalBlock>
      <span
        style={{
          ...theme.typoGraphy.heading['T4-bold'],
          color: 'white',
        }}
      >
        {'Define Service Parameters'}
        <span
          style={{
            ...theme.typoGraphy.heading['T3-medium'],
            color: theme.colors.greyScale[500],
            fontStyle: 'italic',
          }}
        >
          {
            '(Import service parameters through a CSV file, or manually add frequency plan using the '
          }
          <span style={{ color: 'white' }}>{'Add Frequency Plan'}</span>
          {'.)'}
        </span>
      </span>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => fileRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={fileRef}
          style={{ appearance: 'none', visibility: 'hidden', position: 'absolute' }}
          accept=".csv"
        />
        <Button size="medium" variant="tertiary-white" onClick={() => null}>
          <Icon iconTitle={'upload'} fill={'#fff'} size={1.8} />
          {'Export'}
        </Button>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() =>
            setRows((rws) => {
              return [
                ...rws,
                {
                  band: 'Ku',
                  direction: 'DownLink',
                  selection: false,
                  frequency_start: 1,
                  frequency_end: 70,
                  polarization: 'HLP',
                  service_segment_id: state.service_segment_id,
                  service_segment_parameter_id: undefined,
                },
              ];
            })
          }
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Frequency Plan'}
        </Button>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => {
            setRows((rws) => rws.filter((r) => !r.selection));
          }}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
      </FlexContainer>
      <div style={{ height: '486px' }}>
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={[
            { key: 'selection', type: 'select', header: 'Select' },
            {
              key: 'band',
              type: 'editable_enum',
              header: 'Band',
              choices: [
                { value: 'Ku', label: 'Ku' },
                { value: 'Ka', label: 'Ka' },
                { value: 'Q', label: 'Q' },
                { value: 'V', label: 'V' },
                { value: 'C', label: 'C' },
              ],
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
              key: 'frequency_start',
              type: 'editable_number',
              header: 'Start Frequency (GHz)',
            },
            {
              key: 'frequency_end',
              type: 'editable_number',
              header: 'Stop Frequency (GHz)',
            },
          ]}
          noRowsMessage={'No Service Parameters specified.'}
        />
      </div>
    </IntramodalBlock>
  );
};
