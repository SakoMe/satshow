import {
  Button,
  ButtonIcon,
  Datatable,
  Dropdown,
  FlexContainer,
  FlexItem,
  FormattedInput,
  GridContainer,
  Icon,
  Modal,
  theme,
  ValueItem,
} from '@kythera/kui-components';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useFileReader } from '../../../../hooks/useFileReader';
import { CandidateBeam } from '../../../../ts/types/plan';
import { SequenceReducerContext } from './context/SequenceReducer';
import { IntramodalBlock } from './IntramodalBlock';

export const CandidateBeams = () => {
  const { state, dispatch } = useContext(SequenceReducerContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [source, setSource] = useState('');
  const [rows, setRows] = useState<Array<CandidateBeam & { selected: boolean }>>(
    state.candidate_beams.map((b) => {
      return { ...b, selected: false };
    }) ?? [],
  );
  const [open, setOpen] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { contents: FileContents } = useFileReader<CandidateBeam>(
    inputFileRef.current?.files,
  );
  useEffect(() => {
    setRows((old) => [
      ...old,
      ...FileContents.map((x) => {
        return { ...x, selected: false };
      }),
    ]);
  }, [FileContents]);
  useEffect(() => {
    dispatch({
      type: 'POST_BEAMS',
      data: {
        candidate_beams: rows.map((y) => {
          return { diameter: y.diameter, lat: y.lat, long: y.long, no: y.no };
        }),
      },
    });
  }, [rows]);
  return (
    <IntramodalBlock>
      <FlexContainer flexDirection="row" justifyContent="space-between">
        <span
          style={{
            ...theme.typoGraphy.heading['T4-bold'],
            color: 'white',
          }}
        >
          {'Define Candidate Cells '}
          <span
            style={{
              ...theme.typoGraphy.heading['T3-medium'],
              color: theme.colors.greyScale[500],
              fontStyle: 'italic',
            }}
          >
            {'(Import via CSV, or manually define cells with '}
            <span style={{ color: 'white' }}>{'Create Cells'}</span>
            {'.)'}
          </span>
        </span>
      </FlexContainer>
      <FlexContainer flexDirection={'row'} marginTop={'16px'} onInput={forceUpdate}>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => inputFileRef.current?.click()}
        >
          <Icon iconTitle={'download'} fill={'#fff'} size={1.8} />
          {'Import'}
        </Button>
        <input
          type="file"
          ref={inputFileRef}
          style={{ visibility: 'hidden', position: 'absolute' }}
          onChange={(e) => setSource(e.target.value)}
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
            setRows((rws) => [
              ...rws,
              { diameter: 0, lat: 0, long: 0, no: undefined, selected: false },
            ])
          }
        >
          <Icon iconTitle={'add'} fill={'#fff'} size={1.8} />
          {'Add Cell'}
        </Button>
        <Button size="medium" variant="tertiary-white" onClick={() => setOpen(true)}>
          <Icon iconTitle={'settings'} fill={'#fff'} size={1.8} />
          {'Generate Cells'}
        </Button>
        <Modal open={open}>
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
                {'Create Candidate Cells'}
              </span>
              <ButtonIcon
                onClick={() => setOpen(false)}
                iconTitle="close"
                variant="tertiary"
              />
            </FlexContainer>
            <CreateBeamsPopup
              returnFunction={(x) => {
                setOpen(false);
                dispatch({ type: 'POST_BEAMS', data: { create_beams_settings: x } });
                switch (x.beam_type) {
                  case 'Follow_me':
                    setSource('Optimizer - Follow');
                    break;
                  case 'Non_uniform':
                    setSource('Optimizer - Non-uniform');
                    break;
                  case 'Uniform':
                    setSource('Optimizer - Uniform');
                    break;
                  case 'Fixed':
                    setSource('Optimizer - Fixed');
                }
                // Users cannot both have the Optimizer make beams and upload their own beams.
                setRows([]);
                return;
              }}
            />
          </GridContainer>
        </Modal>
        <Button
          size="medium"
          variant="tertiary-white"
          onClick={() => {
            setRows((rws) => {
              return rws.filter((r) => {
                return !r.selected;
              });
            });
            return;
          }}
        >
          <Icon iconTitle={'delete'} fill={'#fff'} size={1.8} />
          {'Delete'}
        </Button>
        <span
          style={{
            ...theme.typoGraphy.heading['T2-bold'],
            color: 'white',
            width: '250px',
            marginLeft: 'auto',
            alignSelf: 'center',
          }}
        >
          {'Source: '}
          {source}
        </span>
      </FlexContainer>
      <div style={{ height: '486px' }}>
        <Datatable
          data={rows}
          setData={setRows}
          dataColumns={[
            { key: 'selected', type: 'select', header: 'Select' },
            // { key: 'no', type: 'editable_number', header: 'Cell No.' },
            { key: 'diameter', type: 'editable_number', header: 'Cell Diameter' },
            { key: 'lat', type: 'editable_number', header: 'Latitude (deg N)' },
            { key: 'long', type: 'editable_number', header: 'Longitude (deg E)' },
          ]}
          noRowsMessage={
            source === ''
              ? 'No Candidate Cells defined.'
              : 'The optimizer will create Cells. Click Continue to proceed.'
          }
        />
      </div>
    </IntramodalBlock>
  );
};

export const CreateBeamsPopup = ({
  returnFunction,
}: {
  returnFunction: (x: {
    beam_type: 'Uniform' | 'Non_uniform' | 'Follow_me' | 'Fixed';
    beam_diameter: number | undefined;
    spacing: number | undefined;
    beam_diameter_range_min: number | undefined;
    beam_diameter_range_max: number | undefined;
  }) => void;
}) => {
  const [type, setType] = useState<ValueItem>({ label: 'Uniform', value: 'Uniform' });
  const [diameter, setDiameter] = useState(0);
  const [mindiameter, setMinDiameter] = useState(0);
  const [maxdiameter, setMaxDiameter] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const handleReturn = () => {
    if (type.value === 'Uniform')
      returnFunction({
        beam_type: 'Uniform',
        beam_diameter: diameter,
        spacing: spacing,
        beam_diameter_range_max: undefined,
        beam_diameter_range_min: undefined,
      });
    if (type.value === 'Non_uniform') {
      if (mindiameter > maxdiameter) return;
      returnFunction({
        beam_type: 'Non_uniform',
        beam_diameter_range_max: maxdiameter,
        beam_diameter_range_min: mindiameter,
        beam_diameter: undefined,
        spacing: undefined,
      });
    }
    if (type.value === 'Follow_me')
      returnFunction({
        beam_type: 'Follow_me',
        beam_diameter_range_max: undefined,
        beam_diameter_range_min: undefined,
        beam_diameter: diameter,
        spacing: undefined,
      });
  };
  return (
    <FlexContainer flexDirection={'column'} style={{ gridArea: 'body' }}>
      <FlexContainer
        flexDirection="column"
        gap="16px"
        padding="16px"
        style={{
          border: `1px solid ${theme.colors.greyScale[700]}`,
          minWidth: '400px',
          minHeight: '300px',
        }}
      >
        <FlexContainer flexDirection="column" gap="8px">
          <span style={{ ...theme.typoGraphy.heading['T3-medium'], color: 'white' }}>
            {'Service Type'}
          </span>
          <Dropdown
            items={[
              { label: 'Uniform', value: 'Uniform' },
              { label: 'Non-uniform', value: 'Non_uniform' },
              { label: 'Follow-me', value: 'Follow_me' },
            ]}
            postReturnValue={(x) => setType(x)}
            selectedText={type.label}
          />
        </FlexContainer>
        {(type.value === 'Follow_me' || type.value === 'Uniform') && (
          <FormattedInput
            title={'Cell Diameter'}
            value={diameter}
            tooltip={'Enter cell diameter.'}
            unit={'deg'}
            changeFunction={(value: number): void => {
              setDiameter(value);
              setSpacing(value * (Math.sqrt(3) / 2));
            }}
          />
        )}
        {type.value === 'Uniform' && (
          <FormattedInput
            title={'Spacing'}
            value={spacing}
            tooltip={'Enter spacing between cells.'}
            unit={'deg'}
            changeFunction={(value) => setSpacing(value)}
          />
        )}
        {type.value === 'Non_uniform' && (
          <FlexContainer flexDirection="row" flexWrap="nowrap" gap="8px">
            <FormattedInput
              title={'Cell Diameter Min'}
              value={mindiameter}
              tooltip={'Enter cell diameter.'}
              unit={'deg'}
              changeFunction={(value) => setMinDiameter(value)}
            />
            <FormattedInput
              title={'Cell Diameter Max'}
              value={maxdiameter}
              tooltip={'Enter cell diameter.'}
              unit={'deg'}
              changeFunction={(value) => setMaxDiameter(value)}
            />
          </FlexContainer>
        )}
      </FlexContainer>
      <FlexContainer
        flexDirection="row"
        justifyContent="end"
        padding={'16px'}
        style={{
          borderRadius: '0 0 8px 8px',
          border: `1px solid ${theme.colors.greyScale[700]}`,
        }}
      >
        <FlexItem>
          <Button size="medium" variant="primary" onClick={() => handleReturn()}>
            <span style={{ marginRight: '8px' }}>{'Generate'}</span>
            <Icon iconTitle="full arrow" fill="black" rotation="right" size={1.8} />
          </Button>
        </FlexItem>
      </FlexContainer>
    </FlexContainer>
  );
};
